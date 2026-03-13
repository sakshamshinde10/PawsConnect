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
      if (filterPrice === "under100" && pet.price >= 100) return false;
      if (filterPrice === "under300" && pet.price >= 300) return false;
      if (filterPrice === "over300" && pet.price < 300) return false;
      return true;
    });
  }, [search, filterType, filterLocation, filterPrice]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold">Find Your Pet</h1>
            <p className="text-muted-foreground">
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

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-4xl">🐾</p>
              <h3 className="mt-4 font-heading text-xl font-bold">No pets found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pets;
