import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedPets } from "@/components/home/FeaturedPets";
import { HowItWorks } from "@/components/home/HowItWorks";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedPets />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
