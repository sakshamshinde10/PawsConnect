import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PetCard } from "@/components/pets/PetCard";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pet } from "@/data/mockPets";
import { useAuth } from "@/contexts/AuthContext";

export function FeaturedPets({ className }: { className?: string }) {
  const { user } = useAuth();
  const [featured, setFeatured] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      
      let query = supabase
        .from("pets")
        .select(`
          *,
          profiles!pets_owner_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (user?.id) {
        query = query.neq("owner_id", user.id);
      }

      const { data, error } = await query.limit(4);

      if (!error && data) {
        const mapped: Pet[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          type: d.type as "dog" | "cat" | "other",
          breed: d.breed,
          age: d.age,
          gender: d.gender as "male" | "female",
          vaccinated: d.vaccinated,
          price: d.price,
          location: d.location,
          description: d.description || "",
          images:
            d.images?.length > 0
              ? d.images
              : ["https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&q=80"],
          ownerId: d.owner_id,
          ownerName: d.profiles?.full_name || "Pet Owner",
          ownerAvatar: d.profiles?.avatar_url || "",
          videoUrl: d.video_url || null,
          isLive: d.is_live || false,
          isFeatured: true,
          createdAt: d.created_at,
        }));
        setFeatured(mapped);
      }
      setLoading(false);
    };

    fetchFeatured();
  }, []);

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

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-5xl mb-4">🐾</p>
            <p className="text-lg font-semibold">No pets listed yet</p>
            <p className="text-sm mt-1">Be the first to list a pet for adoption!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((pet, i) => (
              <div key={pet.id} style={{ animation: `fade-in 0.5s ease-out ${i * 0.1}s both` }}>
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
