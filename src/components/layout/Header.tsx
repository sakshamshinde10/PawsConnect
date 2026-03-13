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
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoPaw} alt="PawConnect" className="h-9 w-9" />
          <span className="font-heading text-xl font-bold text-foreground">
            Paw<span className="text-primary">Connect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                location.pathname === link.to
                  ? "bg-muted text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/favorites">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild>
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
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t bg-card p-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted ${
                  location.pathname === link.to
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/favorites" onClick={() => setMobileOpen(false)}>
                  <Heart className="h-4 w-4" /> Favorites
                </Link>
              </Button>
              <Button className="flex-1" asChild>
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
