import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Loader2, PawPrint } from "lucide-react";
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partner, setPartner] = useState<ChatPartner | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        <main className="flex-1 flex items-center justify-center bg-gradient-hero">
          <div className="text-center space-y-4 animate-in fade-in p-8 glass rounded-3xl max-w-md">
            <PawPrint className="h-16 w-16 text-primary mx-auto" />
            <h2 className="font-heading text-2xl font-bold">Sign in to Chat</h2>
            <p className="text-muted-foreground">You need to be signed in to message pet owners.</p>
            <Button className="rounded-xl bg-gradient-warm border-0 shadow-glow" asChild>
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
      <main className="flex-1 flex flex-col bg-gradient-hero">
        {/* Chat Header */}
        <div className="border-b glass sticky top-16 z-40">
          <div className="container max-w-3xl flex items-center gap-4 py-3">
            <Button variant="ghost" size="icon" className="rounded-xl flex-shrink-0" asChild>
              <Link to={petId ? `/pet/${petId}` : "/pets"}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

            <Avatar className="h-10 w-10 ring-2 ring-primary/20 flex-shrink-0">
              <AvatarImage src={partner?.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-warm text-primary-foreground font-bold text-sm">
                {(partner?.full_name?.[0] || "?").toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="font-heading font-bold text-sm truncate">{partner?.full_name || "Pet Owner"}</p>
              <p className="text-xs text-muted-foreground truncate">
                Discussing adoption of <span className="text-primary font-medium">{petName}</span>
              </p>
            </div>
          </div>
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
                return (
                  <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] animate-in fade-in ${isOwn ? "slide-in-from-right-2" : "slide-in-from-left-2"}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          isOwn
                            ? "bg-gradient-warm text-white rounded-br-md"
                            : "glass border border-white/30 rounded-bl-md"
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
        <div className="border-t glass sticky bottom-0">
          <div className="container max-w-3xl py-3">
            <form onSubmit={handleSend} className="flex gap-3 items-center">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-12 rounded-2xl bg-background/80 border-white/30 focus-visible:ring-primary/30"
                disabled={sending}
                autoFocus
              />
              <Button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="h-12 w-12 rounded-2xl bg-gradient-warm border-0 shadow-glow hover:opacity-90 transition-all hover:scale-105 flex-shrink-0"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
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
