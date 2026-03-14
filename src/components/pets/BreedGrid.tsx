import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface BreedGridProps {
  type: string;
  onSelectBreed: (breed: string) => void;
  searchQuery?: string;
}

export function BreedGrid({ type, onSelectBreed, searchQuery = "" }: BreedGridProps) {
  const [breeds, setBreeds] = useState<{ name: string; id?: string; imageId?: string; animalType?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true);
      setBreeds([]);

      try {
        if (type === "dog") {
          const res = await fetch("https://dog.ceo/api/breeds/list/all");
          const data = await res.json();
          if (data.status === "success") {
            const flattenedBreeds: { name: string; id: string }[] = [];
            Object.entries(data.message).forEach(([breed, subBreeds]: [string, any]) => {
              if (subBreeds.length === 0) {
                flattenedBreeds.push({
                  name: breed.charAt(0).toUpperCase() + breed.slice(1),
                  id: breed
                });
              } else {
                subBreeds.forEach((sub: string) => {
                  flattenedBreeds.push({
                    name: `${sub.charAt(0).toUpperCase() + sub.slice(1)} ${breed.charAt(0).toUpperCase() + breed.slice(1)}`,
                    id: `${breed}/${sub}`
                  });
                });
              }
            });
            setBreeds(flattenedBreeds.sort((a, b) => a.name.localeCompare(b.name)));
          }
        } else if (type === "cat") {
          const res = await fetch("https://api.thecatapi.com/v1/breeds");
          const data = await res.json();
          if (Array.isArray(data)) {
            const catBreeds = data.map((cat: any) => ({
              name: cat.name,
              id: cat.id,
              imageId: cat.reference_image_id
            }));
            setBreeds(catBreeds.sort((a: any, b: any) => a.name.localeCompare(b.name)));
          }
        } else if (type === "" || type === "trending") {
          // Trending & popular breeds mixed
          setBreeds([
            { name: "Golden Retriever", id: "retriever/golden", animalType: "dog" },
            { name: "Persian", id: "pers", animalType: "cat" },
            { name: "German Shepherd", id: "germanshepherd", animalType: "dog" },
            { name: "Maine Coon", id: "mcoo", animalType: "cat" },
            { name: "Labrador", id: "labrador", animalType: "dog" },
            { name: "Siamese", id: "siam", animalType: "cat" },
            { name: "Husky", id: "husky", animalType: "dog" },
            { name: "Ragdoll", id: "ragd", animalType: "cat" },
            { name: "Bulldog", id: "bulldog", animalType: "dog" },
            { name: "Bengal", id: "beng", animalType: "cat" },
            { name: "Rabbit", id: "rabbit", animalType: "other" },
            { name: "Parrot", id: "parrot", animalType: "other" },
          ]);
        } else if (type === "other") {
          setBreeds([
            { name: "Rabbit", id: "rabbit" },
            { name: "Hamster", id: "hamster" },
            { name: "Guinea Pig", id: "guinea-pig" },
            { name: "Parrot", id: "parrot" },
            { name: "Cockatiel", id: "cockatiel" },
            { name: "Fish", id: "fish" },
            { name: "Turtle", id: "turtle" },
            { name: "Snake", id: "snake" },
            { name: "Horse", id: "horse" },
            { name: "Lizard", id: "lizard" },
          ].sort((a, b) => a.name.localeCompare(b.name)));
        }
      } catch (error) {
        console.error(`Failed to fetch ${type} breeds`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, [type]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 font-medium">Discovering {type === "" ? "trending" : type} breeds...</span>
      </div>
    );
  }

  const filteredBreeds = breeds.filter(breed => 
    breed.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      {filteredBreeds.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBreeds.map((breed, i) => (
            <BreedCard
              key={breed.name}
              breed={breed.name}
              apiId={breed.id}
              type={breed.animalType || type}
              imageId={breed.imageId}
              delay={i * 50}
              onClick={() => onSelectBreed(breed.name.toLowerCase())}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-4xl form-heading mb-2">🐾</p>
          <p className="text-muted-foreground">No species matched your search.</p>
        </div>
      )}
    </div>
  );
}

function BreedCard({ breed, apiId, type, imageId, delay, onClick }: { breed: string; apiId?: string; type: string; imageId?: string; delay: number; onClick: () => void }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let mounted = true;

    if (type === "dog" && apiId) {
      // Fetch random image for this specific dog breed
      fetch(`https://dog.ceo/api/breed/${apiId}/images/random`)
        .then(res => res.json())
        .then(data => {
          if (mounted && data.status === "success") {
            setImgUrl(data.message);
          }
        })
        .catch(err => console.error(err));
    } else if (type === "cat" && imageId) {
      // The Cat API provides a reference image ID we can use directly
      setImgUrl(`https://cdn2.thecatapi.com/images/${imageId}.jpg`);
    } else if (type === "cat" && apiId) {
      fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${apiId}`)
        .then(res => res.json())
        .then(data => {
          if (mounted && data[0]) {
            setImgUrl(data[0].url);
          }
        })
    } else if (type === "other") {
      // Map static IDs to beautiful placeholder images for 'other' pets
      const placeholders: Record<string, string> = {
        "rabbit": "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&q=80",
        "hamster": "https://headsupfortails.com/cdn/shop/articles/Hamster_10.jpg?v=1645258342",
        "guinea-pig": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&q=80",
        "parrot": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&q=80",
        "cockatiel": "https://problemparrots.co.uk/wp-content/uploads/2024/06/Cockatiel.jpg",
        "fish": "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=600&q=80",
        "turtle": "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&q=80",
        "snake": "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600&q=80",
        "horse": "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&q=80",
        "lizard": "https://i.pinimg.com/236x/94/0d/da/940dda434ccf426d93f3b96abd400c15.jpg"
      };
      setImgUrl(apiId && placeholders[apiId] ? placeholders[apiId] : `https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&q=80`);
    } else {
      // Fallback
      setImgUrl(`https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&q=80`); // generic cute pet picture
    }

    return () => { mounted = false; };
  }, [type, apiId, imageId, breed, isVisible]);

  return (
    <Card
      ref={cardRef}
      className="overflow-hidden cursor-pointer group hover:shadow-glow transition-all duration-300 border-0 shadow-sm glass border-white/20"
      style={{ animationDelay: `${Math.min(delay, 1000)}ms` }}
      onClick={onClick}
    >
      <div className="aspect-square bg-muted/20 relative overflow-hidden">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={breed}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-3 text-center bg-white/50 backdrop-blur-md">
        <h3 className="font-heading font-semibold text-sm truncate" title={breed}>{breed}</h3>
      </CardContent>
    </Card>
  );
}
