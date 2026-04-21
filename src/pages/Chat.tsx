import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Loader2, PawPrint, CheckCircle2, HeartHandshake } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  pet_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface ChatPartner {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const Chat = () => {
  const { petId } = useParams();
  const [searchParams] = useSearchParams();
  const ownerId = searchParams.get("owner");
  const petName = searchParams.get("pet") || "Pet";

  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partner, setPartner] = useState<ChatPartner | null>(null);
  const [isAdopted, setIsAdopted] = useState(false);
  const [markingAdopted, setMarkingAdopted] = useState(false);
  const [requestingAdoption, setRequestingAdoption] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if current user is the pet owner
  const isOwner = user?.id === ownerId;

  // Fetch pet adoption status
  useEffect(() => {
    if (!petId) return;
    supabase
      .from("pets")
      .select("is_available")
      .eq("id", petId)
      .single()
      .then(({ data }) => {
        if (data) setIsAdopted(!data.is_available);
      });
  }, [petId]);

  const handleMarkAdopted = async () => {
    if (!petId || !user) return;
    setMarkingAdopted(true);
    const { error } = await supabase
      .from("pets")
      .update({ is_available: false })
      .eq("id", petId);

    if (!error) {
      setIsAdopted(true);
      setShowConfirm(false);

      // Send congratulations to buyer
      const buyerId = messages.find(m => m.sender_id !== user.id)?.sender_id || ownerId;
      if (buyerId && buyerId !== user.id) {
        await supabase.from("messages").insert({
          sender_id: user.id,
          receiver_id: buyerId,
          pet_id: petId,
          content: `Congratulations! Your adoption request for ${petName} has been approved. 🎉`,
        });
      }

      // Navigate to dashboard after short delay
      setTimeout(() => navigate("/dashboard"), 1500);
    }
    setMarkingAdopted(false);
  };

  const handleRequestAdoption = async () => {
    if (!petId || !user || !ownerId) return;
    setRequestingAdoption(true);
    
    // Check if a request was already sent recently
    const hasSent = messages.some(m => m.content === "SYS_ADOPTION_REQUEST" && m.sender_id === user.id);
    
    if (!hasSent) {
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: ownerId,
        pet_id: petId,
        content: "SYS_ADOPTION_REQUEST",
      });
      if (!error) {
        setShowConfirm(false);
      }
    } else {
        setShowConfirm(false);
    }
    setRequestingAdoption(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch partner profile
  useEffect(() => {
    if (!ownerId || !user) return;
    const partnerId = ownerId === user.id ? null : ownerId;
    if (!partnerId) return;

    supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", partnerId)
      .single()
      .then(({ data }) => {
        if (data) setPartner(data as ChatPartner);
      });
  }, [ownerId, user]);

  // Fetch existing messages
  useEffect(() => {
    if (!petId || !user) return;

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("pet_id", petId)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [petId, user]);

  // Real-time subscription
  useEffect(() => {
    if (!petId || !user) return;

    const channel = supabase
      .channel(`chat-${petId}-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `pet_id=eq.${petId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          // Only add if it involves us
          if (newMsg.sender_id === user.id || newMsg.receiver_id === user.id) {
            setMessages((prev) => {
              // Prevent duplicates
              if (prev.find((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [petId, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark unread messages as read
  useEffect(() => {
    if (!user || messages.length === 0) return;
    const unread = messages.filter(
      (m) => m.receiver_id === user.id && !m.is_read
    );
    if (unread.length > 0) {
      supabase
        .from("messages")
        .update({ is_read: true })
        .in("id", unread.map((m) => m.id))
        .then(() => {});
    }
  }, [messages, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !ownerId || !petId) return;

    setSending(true);
    const receiverId = ownerId === user.id ? messages.find(m => m.sender_id !== user.id)?.sender_id || ownerId : ownerId;

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: receiverId,
      pet_id: petId,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
      inputRef.current?.focus();
    }
    setSending(false);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4 animate-in fade-in p-8 bg-white border border-gray-100 shadow-sm rounded-[40px] max-w-md">
            <PawPrint className="h-16 w-16 text-primary mx-auto opacity-80" />
            <h2 className="font-heading text-3xl font-extrabold text-primary tracking-tight">Sign in to Chat</h2>
            <p className="text-muted-foreground text-lg">You need to be signed in to message pet owners.</p>
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-sm font-semibold h-12 px-8 mt-2" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
          <div className="container max-w-3xl flex items-center gap-4 py-3">
            <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 hover:bg-gray-50 text-primary" asChild>
              <Link to={petId ? `/pet/${petId}` : "/pets"}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

            <Avatar className="h-10 w-10 ring-2 ring-secondary flex-shrink-0 shadow-sm">
              <AvatarImage src={partner?.avatar_url || ""} />
              <AvatarFallback className="bg-primary text-white font-bold text-sm">
                {(partner?.full_name?.[0] || "?").toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="font-heading font-extrabold text-base truncate text-primary">{partner?.full_name || "Pet Owner"}</p>
              <p className="text-[13px] text-muted-foreground truncate font-medium mt-0.5">
                Discussing adoption of <span className="text-accent font-bold">{petName}</span>
                {isAdopted && <span className="ml-2 text-green-600 font-bold">· Adopted ✓</span>}
              </p>
            </div>

            {/* Request Adopt */}
            {!isAdopted && !isOwner && (
              <Button
                size="sm"
                className="flex-shrink-0 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 h-9 shadow-sm gap-1.5 transition-all hover:-translate-y-0.5"
                onClick={() => setShowConfirm(true)}
              >
                <HeartHandshake className="h-4 w-4" />
                <span className="hidden sm:inline">Adopt</span>
              </Button>
            )}

            {isAdopted && (
              <div className="flex-shrink-0 flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">Adopted!</span>
              </div>
            )}
          </div>

          {/* Confirmation Banner */}
          {showConfirm && (
            <div className="bg-amber-50 border-t border-amber-200 px-4 py-3">
              <div className="container max-w-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-amber-800 text-sm">
                    {isOwner ? "🐾 Confirm Adoption" : "🐾 Request Adoption"}
                  </p>
                  <p className="text-amber-700 text-xs mt-0.5">
                    {isOwner 
                      ? `This will remove ${petName} from all listings. This cannot be undone easily.` 
                      : `This will notify the owner that you are ready to adopt ${petName}.`}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full h-8 px-4 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => setShowConfirm(false)}
                    disabled={markingAdopted || requestingAdoption}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full h-8 px-4 text-xs bg-green-500 hover:bg-green-600 text-white font-bold gap-1"
                    onClick={isOwner ? handleMarkAdopted : handleRequestAdoption}
                    disabled={markingAdopted || requestingAdoption}
                  >
                    {(markingAdopted || requestingAdoption) ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing...</>
                    ) : (
                      <><CheckCircle2 className="h-3.5 w-3.5" /> {isOwner ? "Yes, Mark Adopted" : "Yes, Request Adoption"}</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-3xl py-6 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-20 space-y-3 animate-in fade-in">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <PawPrint className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold">Start the Conversation!</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Send a message to the pet owner to discuss adoption details, arrange a meeting, or ask questions about {petName}.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.sender_id === user.id;
                const isSystemMessage = msg.content === "SYS_ADOPTION_REQUEST";
                
                if (isSystemMessage) {
                  return (
                    <div key={msg.id} className="my-6 flex justify-center animate-in fade-in slide-in-from-bottom-2">
                       <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-sm text-center shadow-sm">
                         <PawPrint className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                         {isOwn ? (
                           <p className="text-amber-800 text-sm font-medium">
                             You have sent a request to adopt {petName}. Waiting for the owner to confirm!
                           </p>
                         ) : (
                           <div>
                             <p className="text-amber-800 text-sm font-medium mb-3">
                               {partner?.full_name || "This user"} wants to adopt {petName}!
                             </p>
                             {!isAdopted && (
                               <Button 
                                 size="sm" 
                                 className="w-full bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-sm"
                                 onClick={handleMarkAdopted}
                                 disabled={markingAdopted}
                               >
                                 {markingAdopted ? (
                                    <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Confirming...</>
                                 ) : (
                                    <><CheckCircle2 className="mr-1.5 h-4 w-4" /> Confirm Adoption</>
                                 )}
                               </Button>
                             )}
                           </div>
                         )}
                       </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] animate-in fade-in ${isOwn ? "slide-in-from-right-2" : "slide-in-from-left-2"}`}>
                      <div
                        className={`px-5 py-3 rounded-3xl text-[15px] font-medium leading-relaxed shadow-sm max-w-prose ${
                          isOwn
                            ? "bg-primary text-white rounded-br-sm"
                            : "bg-white border border-gray-100 rounded-bl-sm text-gray-800"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <p className={`text-[10px] text-muted-foreground mt-1 px-1 ${isOwn ? "text-right" : "text-left"}`}>
                        {formatTime(msg.created_at)}
                        {isOwn && msg.is_read && <span className="ml-1 text-primary">✓✓</span>}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-100 sticky bottom-0 z-40 p-2 sm:p-4">
          <div className="container max-w-3xl">
            <form onSubmit={handleSend} className="flex gap-3 items-center">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-14 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/30 px-6 shadow-sm text-[15px]"
                disabled={sending}
                autoFocus
              />
              <Button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-sm border-0 transition-all hover:scale-105 flex-shrink-0"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 ml-1" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
