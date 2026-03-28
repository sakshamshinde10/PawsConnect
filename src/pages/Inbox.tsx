import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Conversation {
  otherUserId: string;
  petId: string;
  petName: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const Inbox = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchInbox = async () => {
      setLoading(true);

      // Fetch all messages involving the user
      const { data: messages, error } = await supabase
        .from("messages")
        .select(`
          id,
          sender_id,
          receiver_id,
          pet_id,
          content,
          is_read,
          created_at,
          pets!messages_pet_id_fkey (name)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error || !messages) {
        console.error("Error fetching inbox:", error);
        setLoading(false);
        return;
      }

      // We need to fetch profiles for the "other" users
      const otherUserIds = Array.from(new Set(messages.map(m => m.sender_id === user.id ? m.receiver_id : m.sender_id)));
      
      let profilesMap: Record<string, { full_name: string | null; avatar_url: string | null }> = {};
      if (otherUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", otherUserIds);
          
        if (profiles) {
          profilesMap = profiles.reduce((acc, profile) => {
            acc[profile.id] = { full_name: profile.full_name, avatar_url: profile.avatar_url };
            return acc;
          }, {} as Record<string, any>);
        }
      }

      // Group messages into unique conversations: key = `${petId}-${otherUserId}`
      const convosMap = new Map<string, Conversation>();

      messages.forEach(msg => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const key = `${msg.pet_id}-${otherUserId}`;
        
        if (!convosMap.has(key)) {
          const profile = profilesMap[otherUserId];
          const petName = (msg.pets as any)?.name || "Unknown Pet";
          
          convosMap.set(key, {
            otherUserId,
            petId: msg.pet_id,
            petName,
            otherUserName: profile?.full_name || "Pet Owner",
            otherUserAvatar: profile?.avatar_url || "",
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount: (msg.receiver_id === user.id && !msg.is_read) ? 1 : 0
          });
        } else {
          // If already exists, just accumulate unread count
          if (msg.receiver_id === user.id && !msg.is_read) {
            const existing = convosMap.get(key)!;
            existing.unreadCount += 1;
          }
        }
      });

      setConversations(Array.from(convosMap.values()));
      setLoading(false);
    };

    fetchInbox();

    // Subscribe to new messages for the inbox
    const channel = supabase
      .channel("inbox_updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          fetchInbox(); // Refresh on new message
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4 animate-in max-w-md p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <MessageCircle className="h-16 w-16 text-primary mx-auto opacity-80" />
            <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">Sign in to view Inbox</h2>
            <p className="text-muted-foreground text-lg">Log in to see your messages and adoption requests.</p>
            <Button className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm mt-2" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-10">
        <div className="container max-w-3xl">
          <div className="mb-8 pl-2">
            <h1 className="font-heading text-4xl font-extrabold flex items-center gap-3 text-primary tracking-tight">
              <MessageCircle className="h-9 w-9 text-accent" /> Inbox
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Manage all your pet adoption conversations</p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-[40px] p-4 sm:p-8 min-h-[400px]">
            {loading ? (
               <div className="flex flex-col items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground mt-4 font-medium">Loading messages...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center px-4 animate-in fade-in">
                <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-[28px] bg-secondary/50">
                  <PawPrint className="h-10 w-10 text-primary opacity-60" />
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-primary">No messages yet</h3>
                <p className="text-muted-foreground max-w-sm mt-2 text-base">
                  When someone is interested in adopting your pet, or when you message an owner, it will appear here.
                </p>
                <Button variant="outline" className="mt-6 rounded-full h-12 px-6 border-gray-200 text-primary hover:bg-gray-50 font-semibold" asChild>
                  <Link to="/pets">Browse Pets</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {conversations.map((convo, i) => (
                  <Link
                    key={`${convo.petId}-${convo.otherUserId}`}
                    to={`/chat/${convo.petId}?owner=${convo.otherUserId}&pet=${encodeURIComponent(convo.petName)}`}
                    className="block group animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                  >
                    <div className="flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 hover:bg-gray-50 border border-transparent hover:border-gray-100">
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                          <AvatarImage src={convo.otherUserAvatar} />
                          <AvatarFallback className="bg-primary text-white font-bold text-lg">
                            {(convo.otherUserName[0] || "?").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {convo.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 border-2 border-white text-white text-[10px] font-bold flex items-center justify-center">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-heading text-[17px] truncate text-primary ${convo.unreadCount > 0 ? "font-extrabold" : "font-semibold"}`}>
                            {convo.otherUserName}
                          </p>
                          <span className={`text-[12px] whitespace-nowrap flex-shrink-0 mt-1 ${convo.unreadCount > 0 ? "text-accent font-bold" : "text-muted-foreground font-medium"}`}>
                            {formatTime(convo.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-[13px] text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                          <PawPrint className="h-3.5 w-3.5 text-accent" /> 
                          Interested in <span className="font-bold text-primary">{convo.petName}</span>
                        </p>
                        <p className={`text-[15px] truncate mt-2 ${convo.unreadCount > 0 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                          {convo.lastMessage}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Inbox;
