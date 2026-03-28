import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { petTypes, locations } from "@/data/mockPets";
import { useState, useEffect } from "react";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterType: (type: string) => void;
  onFilterBreed: (breed: string) => void;
  onFilterLocation: (location: string) => void;
  onFilterPrice: (price: string) => void;
  activeType: string;
  activeBreed: string;
  activeLocation: string;
  activePrice: string;
}

const petTypeLabels: Record<string, string> = {
  dog: "🐕 Dogs",
  cat: "🐈 Cats",
  other: "🐾 Other Pets",
};

export function SearchFilters({
  onSearch,
  onFilterType,
  onFilterBreed,
  onFilterLocation,
  onFilterPrice,
  activeType,
  activeBreed,
  activeLocation,
  activePrice,
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasFilters = activeType || activeBreed || activeLocation || activePrice;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by pet name, breed..."
            className="pl-12 h-14 rounded-full bg-white border border-gray-100 shadow-sm text-base focus-visible:ring-1 focus-visible:ring-primary/30"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-14 rounded-full px-6 transition-all border-gray-200 shadow-sm ${showFilters ? "bg-secondary text-primary border-primary/20" : "bg-white hover:bg-gray-50"}`}
        >
          <SlidersHorizontal className="h-[18px] w-[18px] mr-2" />
          <span className="hidden sm:inline font-semibold">Filters</span>
        </Button>
      </div>

      {/* Pet Type Pills */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={activeType === "" ? "default" : "outline"}
          className={`cursor-pointer px-5 py-2.5 text-[15px] font-semibold transition-all duration-300 rounded-full ${
            activeType === "" ? "bg-primary border-0 text-white shadow-sm" : "bg-white border-gray-200 hover:border-primary/50 text-muted-foreground"
          }`}
          onClick={() => onFilterType("")}
        >
          🐾 All Pets
        </Badge>
        {petTypes.map((type) => (
          <Badge
            key={type}
            variant={activeType === type ? "default" : "outline"}
            className={`cursor-pointer px-5 py-2.5 text-[15px] font-semibold transition-all duration-300 rounded-full ${
              activeType === type ? "bg-primary border-0 text-white shadow-sm" : "bg-white border-gray-200 hover:border-primary/50 text-muted-foreground"
            }`}
            onClick={() => onFilterType(type)}
          >
            {petTypeLabels[type]}
          </Badge>
        ))}
      </div>


      {/* Expanded Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 rounded-3xl bg-gray-50 border border-gray-100 p-6 shadow-sm animate-in">
          <Select value={activeLocation} onValueChange={onFilterLocation}>
            <SelectTrigger className="w-[180px] rounded-2xl h-12 bg-white border-gray-200 border">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all" className="rounded-xl">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc} className="rounded-xl">{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activePrice} onValueChange={onFilterPrice}>
            <SelectTrigger className="w-[150px] rounded-2xl h-12 bg-white border-gray-200 border">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all" className="rounded-xl">Any Price</SelectItem>
              <SelectItem value="free" className="rounded-xl">Free Adoption</SelectItem>
              <SelectItem value="under100" className="rounded-xl">Under ₹8,000</SelectItem>
              <SelectItem value="under300" className="rounded-xl">Under ₹25,000</SelectItem>
              <SelectItem value="over300" className="rounded-xl">₹25,000+</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-destructive hover:bg-destructive/10 h-12 px-6 ml-auto"
              onClick={() => {
                onFilterType("");
                onFilterBreed("");
                onFilterLocation("all");
                onFilterPrice("all");
              }}
            >
              <X className="mr-2 h-4 w-4" /> Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
