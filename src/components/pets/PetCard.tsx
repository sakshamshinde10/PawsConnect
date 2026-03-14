import { Link } from "react-router-dom";
import { Heart, MapPin, Shield, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Pet } from "@/data/mockPets";
import { useState } from "react";

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pet.images[0]}
          alt={pet.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {pet.isLive && (
            <Badge className="bg-destructive/90 backdrop-blur-sm text-destructive-foreground animate-pulse-soft shadow-lg">
              <Video className="mr-1 h-3 w-3" /> Live
            </Badge>
          )}
          {pet.price === 0 && (
            <Badge className="bg-accent/90 backdrop-blur-sm text-accent-foreground shadow-lg">
              Free Adoption
            </Badge>
          )}
        </div>

        {/* Favorite */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 h-10 w-10 rounded-full glass shadow-lg hover:scale-110 transition-transform"
          onClick={(e) => {
            e.preventDefault();
            setLiked(!liked);
          }}
        >
          <Heart
            className={`h-4 w-4 transition-all duration-300 ${
              liked ? "fill-primary text-primary scale-110" : "text-foreground"
            }`}
          />
        </Button>

        {/* Bottom name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-heading text-xl font-bold text-card drop-shadow-lg">{pet.name}</h3>
          <p className="text-sm text-card/80 drop-shadow">{pet.breed}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {pet.location}
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>{pet.age}</span>
          </div>
          <span className="font-heading text-lg font-bold text-gradient-warm">
            {pet.price === 0 ? "Free" : `$${pet.price}`}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            {pet.vaccinated && (
              <Badge variant="secondary" className="text-xs rounded-lg">
                <Shield className="mr-1 h-3 w-3" /> Vaccinated
              </Badge>
            )}
            <Badge variant="outline" className="text-xs rounded-lg capitalize">
              {pet.gender}
            </Badge>
          </div>
          <Button size="sm" className="rounded-xl bg-gradient-warm hover:opacity-90 transition-opacity border-0 shadow-glow text-primary-foreground" asChild>
            <Link to={`/pet/${pet.id}`}>Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
