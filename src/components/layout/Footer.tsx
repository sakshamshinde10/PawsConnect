import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import logoPaw from "@/assets/logo-paw.png";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoPaw} alt="PawConnect" className="h-8 w-8" />
              <span className="font-heading text-lg font-bold">
                Paw<span className="text-primary">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting loving families with their perfect furry companions since 2024.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-heading font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/pets" className="hover:text-primary transition-colors">Find a Pet</Link></li>
              <li><Link to="/list-pet" className="hover:text-primary transition-colors">List a Pet</Link></li>
              <li><Link to="/pets?type=dog" className="hover:text-primary transition-colors">Dogs</Link></li>
              <li><Link to="/pets?type=cat" className="hover:text-primary transition-colors">Cats</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-heading font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/safety" className="hover:text-primary transition-colors">Safety Tips</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-heading font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© 2024 PawConnect. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 fill-primary text-primary" /> for pets everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
