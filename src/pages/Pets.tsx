import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PetCard } from "@/components/pets/PetCard";
import { SearchFilters } from "@/components/pets/SearchFilters";
import { mockPets } from "@/data/mockPets";

const Pets = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");

  const filtered = useMemo(() => {
    return mockPets.filter((pet) => {
      const q = search.toLowerCase();
      if (q && !pet.name.toLowerCase().includes(q) && !pet.breed.toLowerCase().includes(q)) return false;
      if (filterType && pet.type !== filterType) return false;
      if (filterLocation && filterLocation !== "all" && pet.location !== filterLocation) return false;
      if (filterPrice === "free" && pet.price !== 0) return false;
      if (filterPrice === "under100" && pet.price >= 8000) return false;
      if (filterPrice === "under300" && pet.price >= 25000) return false;
      if (filterPrice === "over300" && pet.price < 25000) return false;
      return true;
    });
  }, [search, filterType, filterLocation, filterPrice]);

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
              {filtered.length} adorable pets waiting for you
            </p>
          </div>

          <SearchFilters
            onSearch={setSearch}
            onFilterType={setFilterType}
            onFilterLocation={setFilterLocation}
            onFilterPrice={setFilterPrice}
            activeType={filterType}
            activeLocation={filterLocation}
            activePrice={filterPrice}
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((pet, i) => (
              <div key={pet.id} style={{ animation: `fade-in 0.4s ease-out ${i * 0.05}s both` }}>
                <PetCard pet={pet} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-24 text-center animate-in">
              <p className="text-6xl mb-4">🐾</p>
              <h3 className="font-heading text-2xl font-bold">No pets found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pets;
