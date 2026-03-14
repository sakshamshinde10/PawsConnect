import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Favorites = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-hero">
        <div className="max-w-md w-full text-center space-y-6 bg-card p-10 rounded-3xl shadow-card glass border border-white/20 animate-in fade-in slide-in-from-bottom-4">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold">Your <span className="text-gradient-warm">Favorites</span></h1>
          <p className="text-muted-foreground text-lg">
            You haven't saved any furry friends yet! 
            Browse our available pets and click the heart icon on any card to save them here for later.
          </p>
          <Button className="w-full h-12 rounded-xl bg-gradient-warm hover:opacity-90 transition-opacity border-0 shadow-glow text-base font-heading font-bold mt-6" asChild>
            <Link to="/pets">
              Browse Available Pets
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
