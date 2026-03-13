import { Link } from "react-router-dom";
import { Heart, MapPin, Shield, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Pet } from "@/data/mockPets";
import { useState } from "react";

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pet.images[0]}
          alt={pet.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {pet.isLive && (
            <Badge className="bg-destructive text-destructive-foreground animate-pulse-soft">
              <Video className="mr-1 h-3 w-3" /> Live
            </Badge>
          )}
          {pet.price === 0 && (
            <Badge className="bg-accent text-accent-foreground">
              Free Adoption
            </Badge>
          )}
        </div>

        {/* Favorite */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
          onClick={(e) => {
            e.preventDefault();
            setLiked(!liked);
          }}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              liked ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">{pet.breed}</p>
          </div>
          <span className="font-heading text-lg font-bold text-primary">
            {pet.price === 0 ? "Free" : `$${pet.price}`}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {pet.location}
          </span>
          <span>•</span>
          <span>{pet.age}</span>
          <span>•</span>
          <span className="capitalize">{pet.gender}</span>
        </div>

        <div className="flex items-center justify-between">
          {pet.vaccinated && (
            <Badge variant="secondary" className="text-xs">
              <Shield className="mr-1 h-3 w-3" /> Vaccinated
            </Badge>
          )}
          <Button size="sm" asChild className="ml-auto">
            <Link to={`/pet/${pet.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
