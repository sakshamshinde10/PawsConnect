import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, Search, User, X, LogOut, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoPaw from "@/assets/logo-paw.png";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/pets", label: "Find a Pet" },
  { to: "/featured", label: "Featured" },
  { to: "/list-pet", label: "List a Pet" },
  { to: "/dashboard", label: "Listed Pets" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const fetchUnread = async () => {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("is_read", false);

      setUnreadCount(count || 0);
    };

    fetchUnread();

    const channel = supabase
      .channel("header_unread_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        () => fetchUnread()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-heading text-2xl font-bold text-foreground tracking-tight">
            Paw<span className="text-accent">Connect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.filter(link => link.to !== "/dashboard" || user).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:bg-secondary hover:text-primary ${location.pathname === link.to
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground"
                }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-gradient-warm" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user && (
            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-secondary hover:text-primary relative hover:-translate-y-1 transition-transform" asChild>
              <Link to="/inbox">
                <MessageCircle className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive border border-white" />
                )}
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-secondary hover:text-primary hover:-translate-y-1 transition-transform" asChild>
            <Link to="/favorites">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-secondary hover:text-primary hover:-translate-y-1 transition-transform" asChild>
            <Link to="/pets">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border/50">
              <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white shadow-shadow-card hover:shadow-shadow-card-hover transition-all border border-gray-100">
                <Avatar className="h-8 w-8 ring-2 ring-secondary">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold truncate max-w-[120px] text-primary">
                  {profile?.full_name || user.email?.split("@")[0]}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl hover:bg-destructive/10 hover:text-destructive"
                onClick={handleSignOut}
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button className="rounded-2xl bg-primary text-white hover:bg-primary/90 hover:shadow-lg transition-all border-0 px-6 py-5 ml-4" asChild>
              <Link to="/login">
                <User className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white p-4 md:hidden shadow-lg absolute w-full rounded-b-3xl">
          <nav className="flex flex-col gap-1">
            {navLinks.filter(link => link.to !== "/dashboard" || user).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`rounded-2xl px-5 py-4 text-sm font-semibold transition-all ${location.pathname === link.to
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-gray-50"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-gray-50">
                  <Avatar className="h-10 w-10 ring-2 ring-secondary">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                      {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-primary">{profile?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-2xl py-6" asChild>
                    <Link to="/inbox" onClick={() => setMobileOpen(false)}>
                      <MessageCircle className="h-5 w-5 mr-2" /> Inbox
                      {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-destructive text-white text-[10px] font-bold">{unreadCount}</span>}
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-2xl py-6" asChild>
                    <Link to="/favorites" onClick={() => setMobileOpen(false)}>
                      <Heart className="h-5 w-5 mr-2" /> Favorites
                    </Link>
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-2xl py-6 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                >
                  <LogOut className="h-5 w-5 mr-2" /> Sign Out
                </Button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-gray-100">
                <Button className="w-full rounded-2xl bg-primary text-white hover:bg-primary/90 py-6" asChild>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <User className="h-5 w-5 mr-2" /> Sign In Required
                  </Link>
                </Button>
                <Button variant="outline" className="w-full rounded-2xl py-6" asChild>
                  <Link to="/favorites" onClick={() => setMobileOpen(false)}>
                    <Heart className="h-5 w-5 mr-2" /> View Favorites
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
