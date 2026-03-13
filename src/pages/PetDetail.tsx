import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, MessageCircle, Shield, Share2, Video } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockPets } from "@/data/mockPets";
import { useState } from "react";

const PetDetail = () => {
  const { id } = useParams();
  const pet = mockPets.find((p) => p.id === id);
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!pet) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-6xl">🐾</p>
            <h1 className="mt-4 font-heading text-2xl font-bold">Pet Not Found</h1>
            <Button className="mt-4" asChild>
              <Link to="/pets">Browse Pets</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          {/* Back */}
          <Button variant="ghost" className="mb-4" asChild>
            <Link to="/pets">
              <ArrowLeft className="h-4 w-4" /> Back to Pets
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Images */}
            <div className="lg:col-span-3 space-y-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={pet.images[selectedImage]}
                  alt={pet.name}
                  className="h-full w-full object-cover"
                />
                {pet.isLive && (
                  <Badge className="absolute left-4 top-4 bg-destructive text-destructive-foreground animate-pulse-soft">
                    <Video className="mr-1 h-3 w-3" /> Live Now
                  </Badge>
                )}
              </div>
              {pet.images.length > 1 && (
                <div className="flex gap-2">
                  {pet.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                        selectedImage === i ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Live video placeholder */}
              {pet.isLive && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-bold">Live Video Available</h4>
                      <p className="text-sm text-muted-foreground">Watch {pet.name} in real-time</p>
                    </div>
                    <Button>Watch Live</Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-heading text-3xl font-bold">{pet.name}</h1>
                    <p className="text-lg text-muted-foreground">{pet.breed}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setLiked(!liked)}>
                      <Heart className={`h-5 w-5 ${liked ? "fill-primary text-primary" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <p className="mt-1 font-heading text-2xl font-bold text-primary">
                  {pet.price === 0 ? "Free Adoption" : `$${pet.price}`}
                </p>
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Type", value: pet.type },
                  { label: "Age", value: pet.age },
                  { label: "Gender", value: pet.gender },
                  { label: "Vaccinated", value: pet.vaccinated ? "Yes ✓" : "No" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-muted p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-medium capitalize">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{pet.location}</span>
              </div>

              {pet.vaccinated && (
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" /> Fully Vaccinated
                </Badge>
              )}

              <div>
                <h3 className="mb-2 font-heading font-bold">About {pet.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{pet.description}</p>
              </div>

              {/* Owner */}
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={pet.ownerAvatar} />
                    <AvatarFallback>{pet.ownerName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-heading font-bold">{pet.ownerName}</p>
                    <p className="text-sm text-muted-foreground">Pet Owner</p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1" size="lg">
                  <Heart className="h-5 w-5" /> Adopt {pet.name}
                </Button>
                <Button variant="outline" size="lg">
                  <MessageCircle className="h-5 w-5" /> Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PetDetail;
