import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import logoPaw from "@/assets/logo-paw.png";

export function Footer() {
  return (
    <footer className="relative border-t bg-card overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-warm opacity-50" />

      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logoPaw} alt="PawConnect" className="h-8 w-8 transition-transform group-hover:rotate-12" />
              <span className="font-heading text-lg font-bold">
                Paw<span className="text-gradient-warm">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting loving families with their perfect furry companions since 2024.
            </p>
          </div>

          {[
            {
              title: "Explore",
              links: [
                { to: "/pets", label: "Find a Pet" },
                { to: "/list-pet", label: "List a Pet" },
                { to: "/pets?type=dog", label: "Dogs" },
                { to: "/pets?type=cat", label: "Cats" },
              ],
            },
            {
              title: "Support",
              links: [
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/faq", label: "FAQ" },
                { to: "/safety", label: "Safety Tips" },
              ],
            },
            {
              title: "Legal",
              links: [
                { to: "/terms", label: "Terms of Service" },
                { to: "/privacy", label: "Privacy Policy" },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-heading font-bold text-foreground">{section.title}</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="hover:text-primary transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© 2024 PawConnect. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="h-4 w-4 fill-primary text-primary animate-pulse-soft" /> for pets everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
