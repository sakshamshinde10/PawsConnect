import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PawPrint, Plus, MapPin, Loader2, Trash2, Eye, PenLine } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface ListedPet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  price: number;
  location: string;
  images: string[];
  is_available: boolean;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [pets, setPets] = useState<ListedPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMyPets = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPets(data as ListedPet[]);
      }
      setLoading(false);
    };

    fetchMyPets();
  }, [user]);

  const handleDelete = async (petId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const { error } = await supabase.from("pets").delete().eq("id", petId);
    if (!error) {
      setPets((prev) => prev.filter((p) => p.id !== petId));
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gradient-hero">
          <div className="text-center space-y-4 p-8 glass rounded-3xl max-w-md animate-in fade-in">
            <PawPrint className="h-16 w-16 text-primary mx-auto" />
            <h2 className="font-heading text-2xl font-bold">Sign in Required</h2>
            <p className="text-muted-foreground">Sign in to view your dashboard and listed pets.</p>
            <Button className="rounded-xl bg-gradient-warm border-0 shadow-glow" asChild>
              <Link to="/login">Sign In</Link>
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
      <main className="flex-1 bg-gradient-hero">
        <div className="container py-10 max-w-5xl">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 animate-in fade-in">
            <Avatar className="h-20 w-20 ring-4 ring-primary/10 ring-offset-4 ring-offset-background">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-warm text-primary-foreground font-bold text-2xl">
                {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="font-heading text-3xl md:text-4xl font-bold">
                Welcome, <span className="text-gradient-warm">{profile?.full_name || user.email?.split("@")[0]}</span>
              </h1>
              <p className="text-muted-foreground mt-1">{user.email}</p>
            </div>
            <Button className="rounded-xl bg-gradient-warm border-0 shadow-glow font-heading font-bold" asChild>
              <Link to="/list-pet">
                <Plus className="h-4 w-4 mr-2" /> List New Pet
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Listings", value: pets.length, color: "text-blue-500" },
              { label: "Available", value: pets.filter(p => p.is_available).length, color: "text-green-500" },
              { label: "Dogs", value: pets.filter(p => p.type === "dog").length, color: "text-amber-500" },
              { label: "Cats", value: pets.filter(p => p.type === "cat").length, color: "text-purple-500" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-5 text-center border border-white/30 hover:shadow-card transition-shadow">
                <p className={`font-heading text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Listed Pets */}
          <div>
            <h2 className="font-heading text-2xl font-bold mb-6">Your Listed Pets</h2>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading your pets...</span>
              </div>
            ) : pets.length === 0 ? (
              <div className="text-center py-20 glass rounded-3xl border border-white/20 animate-in fade-in">
                <PawPrint className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold">No Pets Listed Yet</h3>
                <p className="text-muted-foreground mt-2 mb-6">Start by listing your first pet for adoption!</p>
                <Button className="rounded-xl bg-gradient-warm border-0 shadow-glow" asChild>
                  <Link to="/list-pet">
                    <Plus className="h-4 w-4 mr-2" /> List Your First Pet
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {pets.map((pet, i) => (
                  <Card
                    key={pet.id}
                    className="glass rounded-2xl border border-white/20 hover:shadow-card transition-all duration-300 overflow-hidden animate-in fade-in"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="sm:w-40 sm:h-40 h-48 flex-shrink-0 overflow-hidden">
                          <img
                            src={pet.images?.[0] || "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=300&q=80"}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-heading text-lg font-bold">{pet.name}</h3>
                                <p className="text-sm text-muted-foreground">{pet.breed} · {pet.age} · {pet.gender}</p>
                              </div>
                              <div className="flex gap-1.5">
                                <Badge className={`rounded-lg capitalize text-xs ${pet.is_available ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                                  {pet.is_available ? "Available" : "Adopted"}
                                </Badge>
                                <Badge variant="outline" className="rounded-lg capitalize text-xs">{pet.type}</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" /> {pet.location}
                              <span className="mx-1">·</span>
                              <span className="font-heading font-bold text-primary">
                                {pet.price === 0 ? "Free" : `₹${pet.price.toLocaleString("en-IN")}`}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="rounded-lg text-xs" asChild>
                              <Link to={`/pet/${pet.id}`}>
                                <Eye className="h-3 w-3 mr-1" /> View
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg text-xs text-destructive border-destructive/20 hover:bg-destructive/10"
                              onClick={() => handleDelete(pet.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
