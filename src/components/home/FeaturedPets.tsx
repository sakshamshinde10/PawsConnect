import { mockPets } from "@/data/mockPets";
import { PetCard } from "@/components/pets/PetCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedPets() {
  const featured = mockPets.filter((p) => p.isFeatured);

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold">Featured Pets</h2>
            <p className="mt-1 text-muted-foreground">
              Hand-picked cuties looking for a loving home
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/pets">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </div>
    </section>
  );
}
