import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPaw from "@/assets/logo-paw.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/pets", label: "Find a Pet" },
  { to: "/list-pet", label: "List a Pet" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoPaw} alt="PawConnect" className="h-9 w-9 transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-heading text-xl font-bold text-foreground">
            Paw<span className="text-gradient-warm">Connect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-primary/10 ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
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
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10" asChild>
            <Link to="/favorites">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10" asChild>
            <Link to="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button className="rounded-xl bg-gradient-warm hover:opacity-90 transition-opacity border-0 shadow-glow" asChild>
            <Link to="/login">
              <User className="h-4 w-4" />
              Sign In
            </Link>
          </Button>
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
        <div className="border-t border-border/50 glass p-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" asChild>
                <Link to="/favorites" onClick={() => setMobileOpen(false)}>
                  <Heart className="h-4 w-4" /> Favorites
                </Link>
              </Button>
              <Button className="flex-1 rounded-xl bg-gradient-warm border-0" asChild>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <User className="h-4 w-4" /> Sign In
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
