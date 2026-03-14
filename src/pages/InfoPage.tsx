import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface InfoPageProps {
  title: string;
  subtitle: string;
}

const InfoPage = ({ title, subtitle }: InfoPageProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-hero relative overflow-hidden">
        {/* Soft floating blob background */}
        <div className="absolute top-1/4 -left-20 h-72 w-72 bg-primary/10 blur-3xl rounded-full" style={{ animation: "blob 8s ease-in-out infinite" }} />
        <div className="absolute bottom-1/4 -right-20 h-72 w-72 bg-accent/10 blur-3xl rounded-full" style={{ animation: "blob 10s ease-in-out infinite reverse" }} />

        <div className="max-w-3xl w-full text-center space-y-6 bg-card/80 backdrop-blur-xl p-10 md:p-16 rounded-3xl shadow-card glass border border-white/20 animate-in fade-in slide-in-from-bottom-4 relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            {title.split(' ').map((word, i) => 
               i === title.split(' ').length - 1 ? <span key={i} className="text-gradient-warm">{word}</span> : word + " "
            )}
          </h1>
          <div className="h-1 w-20 bg-primary/20 mx-auto rounded-full my-6"></div>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
            {subtitle}
          </p>
          <div className="pt-8 mt-8 border-t border-border/50">
             <Button className="h-14 rounded-2xl bg-gradient-warm hover:opacity-90 transition-opacity border-0 shadow-glow text-base font-heading font-bold px-10" asChild>
              <Link to="/pets">
                Explore Available Pets
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InfoPage;
