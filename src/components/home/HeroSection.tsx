import { Link } from "react-router-dom";
import { ArrowRight, Heart, PawPrint, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-pet-cream py-20 md:py-28">
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-pet-amber/20 blur-3xl" />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm">
            <PawPrint className="h-4 w-4 text-primary" />
            <span>Trusted by 10,000+ pet lovers</span>
            <Heart className="h-4 w-4 fill-primary text-primary" />
          </div>

          <h1 className="mb-6 font-heading text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Find Your Perfect
            <span className="relative ml-3 inline-block text-primary">
              Companion
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full text-primary/30"
                viewBox="0 0 200 12"
                fill="currentColor"
              >
                <path d="M1 8c30-6 60-8 100-4s70 4 98-2" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Browse thousands of adorable pets waiting for their forever home.
            Adopt, don't shop — and verify every pet with live video.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
              <Link to="/pets">
                <Search className="h-5 w-5" />
                Browse Pets
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8" asChild>
              <Link to="/list-pet">
                List Your Pet
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6">
            {[
              { value: "5,000+", label: "Pets Adopted" },
              { value: "2,500+", label: "Happy Families" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-2xl font-bold text-primary md:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
