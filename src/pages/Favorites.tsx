import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Favorites = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="mx-auto w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-primary">Your Favorites</h1>
          <p className="text-muted-foreground text-lg">
            You haven't saved any furry friends yet! 
            Browse our available pets and click the heart icon on any card to save them here for later.
          </p>
          <Button className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white transition-opacity border-0 shadow-sm text-base font-semibold mt-6" asChild>
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
