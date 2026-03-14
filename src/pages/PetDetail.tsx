import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, MessageCircle, Share2, Video, PawPrint, CalendarDays, Activity, ShieldCheck, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockPets, type Pet } from "@/data/mockPets";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const PetDetail = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPet = async () => {
      setLoading(true);

      // First try mock data
      const mockPet = mockPets.find((p) => p.id === id);
      if (mockPet) {
        setPet(mockPet);
        setLoading(false);
        return;
      }

      // If not in mock, fetch from Supabase
      try {
        const { data, error } = await supabase
          .from("pets")
          .select(`
            *,
            profiles!pets_owner_id_fkey (
              full_name,
              avatar_url
            )
          `)
          .eq("id", id)
          .single();

        if (!error && data) {
          const dbPet: Pet = {
            id: data.id,
            name: data.name,
            type: data.type as "dog" | "cat" | "other",
            breed: data.breed,
            age: data.age,
            gender: data.gender as "male" | "female",
            vaccinated: data.vaccinated,
            price: data.price,
            location: data.location,
            description: data.description || "",
            images: data.images?.length > 0 ? data.images : ["https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&q=80"],
            ownerId: data.owner_id,
            ownerName: (data.profiles as any)?.full_name || "Pet Owner",
            ownerAvatar: (data.profiles as any)?.avatar_url || "",
            videoUrl: data.video_url || null,
            isLive: data.is_live || false,
            isFeatured: data.is_featured || false,
            createdAt: data.created_at,
          };
          setPet(dbPet);
        }
      } catch (err) {
        console.error("Error fetching pet:", err);
      }
      setLoading(false);
    };

    loadPet();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center animate-in">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading pet details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {pet.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl transition-all duration-300 ${
                        selectedImage === i 
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-glow scale-100" 
                          : "opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      {selectedImage !== i && <div className="absolute inset-0 bg-black/10" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Video Player */}
              {pet.videoUrl && (
                <Card className="rounded-2xl border-primary/20 bg-gradient-to-r from-primary/5 to-pet-amber/5 shadow-card overflow-hidden">
                  <div className="aspect-video w-full bg-black/90">
                    <video 
                      src={pet.videoUrl} 
                      controls 
                      className="w-full h-full object-contain" 
                      preload="metadata"
                    />
                  </div>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-warm shadow-glow">
                      <Video className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-bold text-base">Recorded Video</h4>
                      <p className="text-sm text-muted-foreground">Watch {pet.name} in action</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-8 animate-in-delay-1 flex flex-col">
              <div className="pb-6 border-b border-border/50">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">{pet.name}</h1>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xl text-muted-foreground font-medium">{pet.breed}</p>
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm">{pet.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full hover:bg-primary/10 hover:border-primary/30 transition-all shadow-sm" onClick={() => setLiked(!liked)}>
                      <Heart className={`h-6 w-6 transition-all ${liked ? "fill-primary text-primary scale-110 shadow-glow" : "text-muted-foreground"}`} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full hover:bg-primary/10 hover:border-primary/30 transition-all shadow-sm">
                      <Share2 className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-heading text-4xl font-black text-gradient-warm drop-shadow-sm">
                    {pet.price === 0 ? "Free Adoption" : `₹${pet.price.toLocaleString("en-IN")}`}
                  </span>
                  {pet.price !== 0 && <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Adoption Fee</span>}
                </div>
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Type", value: pet.type, icon: <PawPrint className="h-5 w-5 text-blue-500" />, bg: "bg-blue-500/10" },
                  { label: "Age", value: pet.age, icon: <CalendarDays className="h-5 w-5 text-emerald-500" />, bg: "bg-emerald-500/10" },
                  { label: "Gender", value: pet.gender, icon: <Activity className="h-5 w-5 text-purple-500" />, bg: "bg-purple-500/10" },
                  { label: "Vaccinated", value: pet.vaccinated ? "Yes ✓" : "No", icon: <ShieldCheck className="h-5 w-5 text-amber-500" />, bg: "bg-amber-500/10" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl glass p-5 transition-all duration-300 hover:shadow-card hover:-translate-y-1 group border border-white/40">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2.5 rounded-xl ${item.bg} group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    </div>
                    <p className="font-heading text-lg font-bold capitalize pl-1">{item.value}</p>
                  </div>
                ))}
              </div>

              {pet.vaccinated && (
                <div className="inline-flex">
                  <Badge variant="secondary" className="gap-2 rounded-xl px-4 py-2.5 bg-green-500/10 text-green-700 hover:bg-green-500/20 border-0">
                    <ShieldCheck className="h-4 w-4" /> Fully Vaccinated & Vet Checked
                  </Badge>
                </div>
              )}

              <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                <h3 className="mb-3 font-heading text-2xl font-bold flex items-center gap-2">
                  About {pet.name}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground relative z-10">{pet.description}</p>
              </div>

              {/* Owner */}
              <Card className="rounded-3xl glass shadow-sm border border-white/40 hover:shadow-card transition-shadow duration-300">
                <CardContent className="flex items-center gap-5 p-5">
                  <Avatar className="h-16 w-16 ring-4 ring-primary/10 ring-offset-2 ring-offset-background">
                    <AvatarImage src={pet.ownerAvatar} />
                    <AvatarFallback className="bg-gradient-warm text-primary-foreground font-bold text-xl">{pet.ownerName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-heading font-bold text-xl">{pet.ownerName}</p>
                    <p className="text-sm font-medium text-primary flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified Pet Owner
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3 pt-2 pb-6 mt-auto">
                <Button className="flex-1 h-14 rounded-2xl bg-gradient-warm hover:opacity-90 transition-all hover:-translate-y-1 border-0 shadow-glow text-lg font-heading font-bold overflow-hidden relative group">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <Heart className="h-5 w-5 mr-2 animate-pulse-soft" /> Adopt {pet.name}
                </Button>
                <Button variant="outline" size="lg" className="h-14 w-14 md:w-auto md:px-8 rounded-2xl glass hover:shadow-card text-base font-semibold group border-primary/20 hover:border-primary/50 text-primary" asChild>
                  <Link to={`/chat/${pet.id}?owner=${pet.ownerId}&pet=${encodeURIComponent(pet.name)}`}>
                    <MessageCircle className="h-5 w-5 md:mr-2 group-hover:scale-110 transition-transform duration-300" /> 
                    <span className="hidden md:inline">Message</span>
                  </Link>
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
