import { Link } from "react-router-dom";
import { ArrowRight, Heart, PawPrint, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-24 md:py-32 lg:py-40">
      {/* Animated blobs */}
      <div
        className="absolute -right-32 -top-32 h-96 w-96 bg-secondary/30 blur-3xl rounded-full"
        style={{ animation: "blob 8s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-20 -left-20 h-72 w-72 bg-primary/5 blur-3xl rounded-full"
        style={{ animation: "blob 10s ease-in-out infinite reverse" }}
      />
      <div
        className="absolute right-1/4 top-1/3 h-48 w-48 bg-accent/5 blur-3xl rounded-full"
        style={{ animation: "blob 12s ease-in-out infinite 2s" }}
      />

      {/* Floating paw prints */}
      <div className="absolute left-[10%] top-[20%] text-primary/10 text-4xl" style={{ animation: "float-slow 6s ease-in-out infinite" }}>🐾</div>
      <div className="absolute right-[15%] top-[30%] text-accent/15 text-3xl" style={{ animation: "float-delayed 8s ease-in-out infinite 1s" }}>🐾</div>
      <div className="absolute left-[20%] bottom-[15%] text-secondary/30 text-5xl" style={{ animation: "float-slow 7s ease-in-out infinite 2s" }}>🐾</div>
      <div className="absolute right-[25%] bottom-[25%] text-primary/5 text-2xl" style={{ animation: "float-delayed 9s ease-in-out infinite 0.5s" }}>🐾</div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">


          <h1 className="animate-in-delay-1 mb-6 font-heading text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl text-primary">
            Find Your Perfect
            <br />
            <span className="text-accent">
              Companion
            </span>
          </h1>

          <p className="animate-in-delay-2 mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            Browse thousands of adorable pets waiting for their forever home.
            <br className="hidden sm:block" />
            Adopt, don't shop — and verify every pet with <span className="font-semibold text-foreground">live video</span>.
          </p>

          <div className="animate-in-delay-3 flex flex-col items-center justify-center gap-5 sm:flex-row mt-12">
            <Button size="lg" className="w-full sm:w-auto text-base px-10 h-14 rounded-full shadow-sm bg-primary text-white hover:bg-primary/90 hover:-translate-y-1 transition-all font-bold" asChild>
              <Link to="/pets">
                <Search className="h-5 w-5 mr-2" />
                Browse Pets
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-10 h-14 rounded-full bg-white shadow-sm border border-gray-200 hover:shadow-md hover:bg-gray-50 hover:-translate-y-1 transition-all text-primary font-bold" asChild>
              <Link to="/list-pet">
                List Your Pet
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {[
              { value: "5,000+", label: "Pets Adopted", icon: "🏠" },
              { value: "2,500+", label: "Happy Families", icon: "❤️" },
              { value: "98%", label: "Satisfaction", icon: "⭐" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="group bg-white rounded-3xl p-6 md:p-8 transition-all duration-300 hover:shadow-shadow-card-hover hover:-translate-y-2 cursor-default border border-gray-100 shadow-sm"
                style={{ animation: `fade-in 0.6s ease-out ${0.4 + i * 0.1}s both` }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <p className="font-heading text-3xl font-extrabold text-primary md:text-4xl mb-1">
                  {stat.value}
                </p>
                <p className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
