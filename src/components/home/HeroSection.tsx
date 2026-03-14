import { Link } from "react-router-dom";
import { ArrowRight, Heart, PawPrint, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 md:py-32 lg:py-40">
      {/* Animated blobs */}
      <div
        className="absolute -right-32 -top-32 h-96 w-96 bg-primary/10 blur-3xl"
        style={{ animation: "blob 8s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-20 -left-20 h-72 w-72 bg-pet-amber/15 blur-3xl"
        style={{ animation: "blob 10s ease-in-out infinite reverse" }}
      />
      <div
        className="absolute right-1/4 top-1/3 h-48 w-48 bg-pet-teal/10 blur-3xl"
        style={{ animation: "blob 12s ease-in-out infinite 2s" }}
      />

      {/* Floating paw prints */}
      <div className="absolute left-[10%] top-[20%] text-primary/10 text-4xl" style={{ animation: "float-slow 6s ease-in-out infinite" }}>🐾</div>
      <div className="absolute right-[15%] top-[30%] text-pet-amber/15 text-3xl" style={{ animation: "float-delayed 8s ease-in-out infinite 1s" }}>🐾</div>
      <div className="absolute left-[20%] bottom-[15%] text-pet-teal/10 text-5xl" style={{ animation: "float-slow 7s ease-in-out infinite 2s" }}>🐾</div>
      <div className="absolute right-[25%] bottom-[25%] text-pet-lavender/10 text-2xl" style={{ animation: "float-delayed 9s ease-in-out infinite 0.5s" }}>🐾</div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Trust badge */}
          <div className="animate-in mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 backdrop-blur-sm px-5 py-2.5 text-sm font-medium shadow-card">
            <Sparkles className="h-4 w-4 text-pet-amber" />
            <span>Trusted by <strong className="text-primary">10,000+</strong> pet lovers</span>
            <Heart className="h-4 w-4 fill-primary text-primary" />
          </div>

          <h1 className="animate-in-delay-1 mb-6 font-heading text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
            Find Your Perfect
            <br />
            <span className="text-gradient-warm">
              Companion
            </span>
          </h1>

          <p className="animate-in-delay-2 mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            Browse thousands of adorable pets waiting for their forever home.
            <br className="hidden sm:block" />
            Adopt, don't shop — and verify every pet with <span className="font-semibold text-foreground">live video</span>.
          </p>

          <div className="animate-in-delay-3 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 h-13 rounded-xl shadow-glow bg-gradient-warm hover:opacity-90 transition-opacity border-0" asChild>
              <Link to="/pets">
                <Search className="h-5 w-5" />
                Browse Pets
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 h-13 rounded-xl glass hover:shadow-card transition-shadow" asChild>
              <Link to="/list-pet">
                List Your Pet
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8">
            {[
              { value: "5,000+", label: "Pets Adopted", icon: "🏠" },
              { value: "2,500+", label: "Happy Families", icon: "❤️" },
              { value: "98%", label: "Satisfaction", icon: "⭐" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="group glass rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-default"
                style={{ animation: `fade-in 0.6s ease-out ${0.4 + i * 0.1}s both` }}
              >
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <p className="font-heading text-2xl font-bold text-gradient-warm md:text-3xl">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
