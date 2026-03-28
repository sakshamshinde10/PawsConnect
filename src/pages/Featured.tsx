import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Heart, MapPin, Shield, Video, Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SupaPet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  vaccinated: boolean;
  price: number;
  location: string;
  description: string;
  images: string[];
  is_live: boolean;
  is_available: boolean;
  video_url?: string | null;
  created_at: string;
}

const FILTERS = ["All", "Dog", "Cat", "Other"] as const;
type Filter = (typeof FILTERS)[number];

function PetCard({ pet }: { pet: SupaPet }) {
  const [liked, setLiked] = useState(false);

  return (
    <Link
      to={`/pet/${pet.id}`}
      className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-2 flex flex-col h-full cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pet.images?.[0] || "https://images.unsplash.com/photo-1548681528-6a5c45b66063?w=600"}
          alt={pet.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {pet.is_live && (
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
            e.stopPropagation();
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
          <p className="text-sm text-card/80 drop-shadow capitalize">{pet.breed}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {pet.location}
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>{pet.age}</span>
          </div>
          <span className="font-heading text-lg font-bold text-gradient-warm">
            {pet.price === 0 ? "Free" : `₹${Number(pet.price).toLocaleString("en-IN")}`}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            {pet.vaccinated && (
              <Badge variant="secondary" className="text-xs rounded-lg">
                <Shield className="mr-1 h-3 w-3" /> Vaccinated
              </Badge>
            )}
            <Badge variant="outline" className="text-xs rounded-lg capitalize border-gray-200">
              {pet.gender}
            </Badge>
          </div>
          <span className="rounded-full bg-gradient-warm text-white text-sm font-semibold px-5 py-1.5 shadow-sm transition-all group-hover:opacity-90">
            Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

const Featured = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<SupaPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);

      let query = supabase
        .from("pets")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      // Exclude the current user's own listings so they only see other owners' pets
      if (user?.id) {
        query = query.neq("owner_id", user.id);
      }

      const { data, error } = await query;

      if (!error && data) {
        setPets(data as SupaPet[]);
      }
      setLoading(false);
    };

    fetchPets();
  }, [user]);

  const filtered = pets.filter((p) => {
    const matchesType =
      activeFilter === "All" || p.type?.toLowerCase() === activeFilter.toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.breed?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero header */}
        <div className="bg-white border-b border-gray-100 py-12">
          <div className="container">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              🐾 All Listed Pets
            </div>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-heading text-4xl font-extrabold md:text-5xl tracking-tight text-primary">
                  Featured <span className="text-accent">Pets</span>
                </h1>
                <p className="mt-3 text-muted-foreground text-lg max-w-md">
                  Meet all the adorable pets looking for a loving forever home
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, breed, city…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-11 rounded-full border-gray-200 bg-white focus-visible:ring-primary/30 text-[14px]"
                />
              </div>
            </div>

            {/* Filter tabs */}
            <div className="mt-6 flex gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeFilter === f
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white border border-gray-200 text-black/70 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {f === "All" ? `All Pets` : `${f}s`}
                </button>
              ))}
              <span className="ml-auto text-sm text-muted-foreground self-center">
                {loading ? "" : `${filtered.length} pet${filtered.length !== 1 ? "s" : ""} found`}
              </span>
            </div>
          </div>
        </div>

        {/* Pet grid */}
        <div className="container py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading pets…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="text-5xl">🐾</div>
              <p className="text-lg font-semibold text-black/70">No pets found</p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? `No results for "${search}". Try a different search.`
                  : "No pets have been listed yet. Be the first to list one!"}
              </p>
              <Link
                to="/list-pet"
                className="mt-2 rounded-full bg-primary text-white px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                List a Pet
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((pet, i) => (
                <div
                  key={pet.id}
                  style={{ animation: `fade-in 0.4s ease-out ${i * 0.05}s both` }}
                >
                  <PetCard pet={pet} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Featured;
