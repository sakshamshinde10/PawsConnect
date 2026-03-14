import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { petTypes, locations } from "@/data/mockPets";
import { useState } from "react";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterType: (type: string) => void;
  onFilterLocation: (location: string) => void;
  onFilterPrice: (price: string) => void;
  activeType: string;
  activeLocation: string;
  activePrice: string;
}

const petTypeLabels: Record<string, string> = {
  dog: "🐕 Dogs",
  cat: "🐈 Cats",
  bird: "🐦 Birds",
  rabbit: "🐇 Rabbits",
  other: "🐾 Other",
};

export function SearchFilters({
  onSearch,
  onFilterType,
  onFilterLocation,
  onFilterPrice,
  activeType,
  activeLocation,
  activePrice,
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasFilters = activeType || activeLocation || activePrice;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by pet name, breed..."
            className="pl-11 h-12 rounded-xl glass text-base"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-12 rounded-xl px-5 transition-all ${showFilters ? "bg-primary/10 text-primary border-primary/20" : ""}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>

      {/* Pet Type Pills */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={activeType === "" ? "default" : "outline"}
          className={`cursor-pointer px-4 py-2 text-sm transition-all duration-300 rounded-xl ${
            activeType === "" ? "bg-gradient-warm border-0 text-primary-foreground shadow-glow" : "hover:border-primary/50"
          }`}
          onClick={() => onFilterType("")}
        >
          🐾 All Pets
        </Badge>
        {petTypes.map((type) => (
          <Badge
            key={type}
            variant={activeType === type ? "default" : "outline"}
            className={`cursor-pointer px-4 py-2 text-sm transition-all duration-300 rounded-xl ${
              activeType === type ? "bg-gradient-warm border-0 text-primary-foreground shadow-glow" : "hover:border-primary/50"
            }`}
            onClick={() => onFilterType(type)}
          >
            {petTypeLabels[type]}
          </Badge>
        ))}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 rounded-2xl glass p-5 shadow-card animate-in">
          <Select value={activeLocation} onValueChange={onFilterLocation}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activePrice} onValueChange={onFilterPrice}>
            <SelectTrigger className="w-[150px] rounded-xl">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="free">Free Adoption</SelectItem>
              <SelectItem value="under100">Under ₹8,000</SelectItem>
              <SelectItem value="under300">Under ₹25,000</SelectItem>
              <SelectItem value="over300">₹25,000+</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-destructive hover:bg-destructive/10"
              onClick={() => {
                onFilterType("");
                onFilterLocation("all");
                onFilterPrice("all");
              }}
            >
              <X className="mr-1 h-3 w-3" /> Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
