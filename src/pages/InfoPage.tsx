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
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 relative overflow-hidden">
        {/* Soft floating blob background */}
        <div className="absolute top-1/4 -left-20 h-72 w-72 bg-secondary/30 blur-3xl rounded-full" style={{ animation: "blob 8s ease-in-out infinite" }} />
        <div className="absolute bottom-1/4 -right-20 h-72 w-72 bg-primary/5 blur-3xl rounded-full" style={{ animation: "blob 10s ease-in-out infinite reverse" }} />

        <div className="max-w-3xl w-full text-center space-y-6 bg-white p-10 md:p-16 rounded-[40px] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary">
            {title.split(' ').map((word, i) => 
               i === title.split(' ').length - 1 ? <span key={i} className="text-accent">{word}</span> : word + " "
            )}
          </h1>
          <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full my-6"></div>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
            {subtitle}
          </p>
          <div className="pt-8 mt-8 border-t border-gray-100">
             <Button className="h-14 rounded-full bg-primary hover:bg-primary/90 text-white transition-opacity border-0 shadow-sm text-base font-semibold px-10" asChild>
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
