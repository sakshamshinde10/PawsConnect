import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PetCard } from "@/components/pets/PetCard";
import { SearchFilters } from "@/components/pets/SearchFilters";
import { BreedGrid } from "@/components/pets/BreedGrid";
import { mockPets, type Pet } from "@/data/mockPets";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const Pets = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterBreed, setFilterBreed] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [dbPets, setDbPets] = useState<Pet[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Fetch real pets from Supabase
  useEffect(() => {
    const fetchPets = async () => {
      setLoadingDb(true);
      const { data, error } = await supabase
        .from("pets")
        .select(`
          id,
          name,
          type,
          breed,
          age,
          gender,
          vaccinated,
          price,
          location,
          description,
          images,
          video_url,
          is_live,
          is_featured,
          is_available,
          owner_id,
          created_at,
          profiles!pets_owner_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped: Pet[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          breed: p.breed,
          age: p.age,
          gender: p.gender,
          vaccinated: p.vaccinated,
          price: p.price,
          location: p.location,
          description: p.description || "",
          images: p.images?.length > 0 ? p.images : ["https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&q=80"],
          ownerId: p.owner_id,
          ownerName: p.profiles?.full_name || "Pet Owner",
          ownerAvatar: p.profiles?.avatar_url || "",
          isLive: p.is_live || false,
          isFeatured: p.is_featured || false,
          createdAt: p.created_at,
        }));
        setDbPets(mapped);
      }
      setLoadingDb(false);
    };

    fetchPets();
  }, []);

  // Merge DB pets + mock pets (DB pets first, dedup by id)
  const allPets = useMemo(() => {
    const ids = new Set(dbPets.map((p) => p.id));
    const combined = [...dbPets, ...mockPets.filter((p) => !ids.has(p.id))];
    return combined;
  }, [dbPets]);

  const handleFilterType = (type: string) => {
    setFilterType(type);
    setFilterBreed("");
  };

  const filtered = useMemo(() => {
    return allPets.filter((pet) => {
      const q = search.toLowerCase();
      if (q && !pet.name.toLowerCase().includes(q) && !pet.breed.toLowerCase().includes(q)) return false;
      if (filterType && pet.type !== filterType) return false;
      if (filterBreed && pet.breed.toLowerCase() !== filterBreed) return false;
      if (filterLocation && filterLocation !== "all" && pet.location !== filterLocation) return false;
      if (filterPrice === "free" && pet.price !== 0) return false;
      if (filterPrice === "under100" && pet.price >= 8000) return false;
      if (filterPrice === "under300" && pet.price >= 25000) return false;
      if (filterPrice === "over300" && pet.price < 25000) return false;
      return true;
    });
  }, [search, filterType, filterBreed, filterLocation, filterPrice, allPets]);

  const showBreedGrid = (filterType === "" || filterType === "dog" || filterType === "cat" || filterType === "other") && 
    !filterBreed && filterLocation === "all" && filterPrice === "all";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-10">
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold">
              Find Your <span className="text-gradient-warm">Pet</span>
            </h1>
            <p className="mt-2 text-muted-foreground text-lg">
              {showBreedGrid 
                ? filterType === "" ? "Discover trending and popular pets" : `Discover adorable ${filterType} species`
                : `${filtered.length} adorable ${filterBreed ? filterBreed + ' ' : ''}pets waiting for you`}
            </p>
          </div>

          <SearchFilters
            onSearch={setSearch}
            onFilterType={handleFilterType}
            onFilterBreed={setFilterBreed}
            onFilterLocation={setFilterLocation}
            onFilterPrice={setFilterPrice}
            activeType={filterType}
            activeBreed={filterBreed}
            activeLocation={filterLocation}
            activePrice={filterPrice}
          />

          <div className="mt-8">
            {filterBreed && (
              <Button 
                variant="ghost" 
                className="mb-6 -ml-3 text-muted-foreground hover:text-foreground"
                onClick={() => setFilterBreed("")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to {filterType || "all"} breeds
              </Button>
            )}

            {showBreedGrid ? (
              <div className="mt-4">
                <BreedGrid type={filterType} onSelectBreed={setFilterBreed} searchQuery={search} />
              </div>
            ) : (
              <>
                {loadingDb && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                    <span className="text-muted-foreground">Loading pets...</span>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((pet, i) => (
                    <div key={pet.id} style={{ animation: `fade-in 0.4s ease-out ${i * 0.05}s both` }}>
                      <PetCard pet={pet} />
                    </div>
                  ))}
                </div>

                {filtered.length === 0 && !loadingDb && (
                  <div className="py-24 text-center animate-in">
                    <p className="text-6xl mb-4">🐾</p>
                    <h3 className="font-heading text-2xl font-bold">No pets found</h3>
                    <p className="text-muted-foreground mt-2">
                      {filterBreed 
                        ? `No ${filterBreed} pets are currently listed for adoption. Be the first to list one!`
                        : "Try adjusting your filters"}
                    </p>
                    {filterBreed && (
                      <Button className="mt-4 rounded-xl bg-gradient-warm border-0 shadow-glow" asChild>
                        <a href="/list-pet">List a {filterBreed}</a>
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pets;
