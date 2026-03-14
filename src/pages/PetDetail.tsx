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
          <div className="text-center animate-in">
            <p className="text-7xl">🐾</p>
            <h1 className="mt-4 font-heading text-2xl font-bold">Pet Not Found</h1>
            <Button className="mt-4 rounded-xl bg-gradient-warm border-0" asChild>
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
          <Button variant="ghost" className="mb-6 rounded-xl" asChild>
            <Link to="/pets">
              <ArrowLeft className="h-4 w-4" /> Back to Pets
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Images */}
            <div className="lg:col-span-3 space-y-4 animate-in">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card-hover">
                <img
                  src={pet.images[selectedImage]}
                  alt={pet.name}
                  className="h-full w-full object-cover transition-transform duration-500"
                />
                {pet.isLive && (
                  <Badge className="absolute left-4 top-4 bg-destructive/90 backdrop-blur-sm text-destructive-foreground animate-pulse-soft shadow-lg">
                    <Video className="mr-1 h-3 w-3" /> Live Now
                  </Badge>
                )}
              </div>
              {pet.images.length > 1 && (
                <div className="flex gap-3">
                  {pet.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        selectedImage === i ? "border-primary shadow-glow" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Live video placeholder */}
              {pet.isLive && (
                <Card className="rounded-2xl border-primary/20 bg-gradient-to-r from-primary/5 to-pet-amber/5 shadow-card">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-warm shadow-glow">
                      <Video className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-bold text-lg">Live Video Available</h4>
                      <p className="text-sm text-muted-foreground">Watch {pet.name} in real-time</p>
                    </div>
                    <Button className="rounded-xl bg-gradient-warm border-0 shadow-glow">Watch Live</Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-6 animate-in-delay-1">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-heading text-3xl font-bold">{pet.name}</h1>
                    <p className="text-lg text-muted-foreground">{pet.breed}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-xl hover:bg-primary/10" onClick={() => setLiked(!liked)}>
                      <Heart className={`h-5 w-5 transition-all ${liked ? "fill-primary text-primary scale-110" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl hover:bg-primary/10">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 font-heading text-3xl font-bold text-gradient-warm">
                  {pet.price === 0 ? "Free Adoption" : `$${pet.price}`}
                </p>
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Type", value: pet.type, icon: "🐾" },
                  { label: "Age", value: pet.age, icon: "📅" },
                  { label: "Gender", value: pet.gender, icon: "⚧" },
                  { label: "Vaccinated", value: pet.vaccinated ? "Yes ✓" : "No", icon: "💉" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl glass p-4 transition-all hover:shadow-card">
                    <span className="text-lg">{item.icon}</span>
                    <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                    <p className="font-semibold capitalize">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{pet.location}</span>
              </div>

              {pet.vaccinated && (
                <Badge variant="secondary" className="gap-1 rounded-xl px-4 py-2">
                  <Shield className="h-3 w-3" /> Fully Vaccinated
                </Badge>
              )}

              <div>
                <h3 className="mb-2 font-heading text-lg font-bold">About {pet.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{pet.description}</p>
              </div>

              {/* Owner */}
              <Card className="rounded-2xl glass shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                    <AvatarImage src={pet.ownerAvatar} />
                    <AvatarFallback className="bg-gradient-warm text-primary-foreground font-bold">{pet.ownerName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-heading font-bold text-lg">{pet.ownerName}</p>
                    <p className="text-sm text-muted-foreground">Pet Owner</p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 h-12 rounded-xl bg-gradient-warm hover:opacity-90 transition-opacity border-0 shadow-glow text-base" size="lg">
                  <Heart className="h-5 w-5" /> Adopt {pet.name}
                </Button>
                <Button variant="outline" size="lg" className="h-12 rounded-xl glass hover:shadow-card text-base">
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
