import { mockPets } from "@/data/mockPets";
import { PetCard } from "@/components/pets/PetCard";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedPets({ className }: { className?: string }) {
  const featured = mockPets.filter((p) => p.isFeatured);

  return (
    <section className={className || "py-20 md:py-28"}>
      <div className="container">
        <div className="mb-12 flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Hand-picked for you
            </div>
            <h2 className="font-heading text-4xl font-extrabold md:text-5xl tracking-tight text-primary">
              Featured <span className="text-accent">Pets</span>
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-md">
              Meet our adorable cuties looking for a loving forever home
            </p>
          </div>
          <Button variant="outline" className="mt-6 md:mt-0 rounded-full bg-white shadow-sm hover:shadow-md transition-all border-gray-200 px-6 h-12 text-primary" asChild>
            <Link to="/pets">
              View All Pets <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((pet, i) => (
            <div key={pet.id} style={{ animation: `fade-in 0.5s ease-out ${i * 0.1}s both` }}>
              <PetCard pet={pet} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
