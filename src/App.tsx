import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Pets from "./pages/Pets";
import PetDetail from "./pages/PetDetail";
import Login from "./pages/Login";
import ListPet from "./pages/ListPet";
import Favorites from "./pages/Favorites";
import Chat from "./pages/Chat";
import Inbox from "./pages/Inbox";
import Dashboard from "./pages/Dashboard";
import InfoPage from "./pages/InfoPage";
import NotFound from "./pages/NotFound";
import Featured from "./pages/Featured";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/available-pets" element={<Pets />} />
            <Route path="/featured" element={<Featured />} />
            <Route path="/pet/:id" element={<PetDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/list-pet" element={<ListPet />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/chat/:petId" element={<Chat />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<InfoPage title="About Us" subtitle="PawConnect was founded in 2024 to connect loving families with perfect, furry companions. We believe every pet deserves a safe, loving forever home." />} />
            <Route path="/contact" element={<InfoPage title="Contact Support" subtitle="Need help finding a pet or listing an adoption? Reach out to us at support@pawconnect.online and our trusted support herd will assist you within 24 hours." />} />
            <Route path="/faq" element={<InfoPage title="Frequent Questions" subtitle={"Q: How much does adoption cost?\nA: It varies by pet, though many listed are completely free to good homes.\n\nQ: Do you verify listings?\nA: Yes, all new owners undergo a strict security verification to ensure pet safety."} />} />
            <Route path="/safety" element={<InfoPage title="Safety Tips" subtitle={"1. Always meet the pet and current owner in a public, safe environment.\n2. Ask for documentation of vaccinations.\n3. Never wire money upfront without seeing the pet."} />} />
            <Route path="/terms" element={<InfoPage title="Terms of Service" subtitle="By using PawConnect, you agree to treat animals with utmost respect and adhere to all local wildlife and pet ownership laws." />} />
            <Route path="/privacy" element={<InfoPage title="Privacy Policy" subtitle="We take your privacy seriously. Your data is securely encrypted and never sold to third-party data brokers." />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
