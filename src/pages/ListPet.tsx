import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Camera, PawPrint, Upload } from "lucide-react";

const ListPet = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-1 bg-gradient-hero py-12 overflow-hidden">
        <div className="absolute -right-20 top-20 h-72 w-72 bg-primary/8 blur-3xl" style={{ animation: "blob 10s ease-in-out infinite" }} />

        <div className="container max-w-2xl relative">
          <Card className="shadow-card-hover glass rounded-2xl animate-in">
            <CardHeader className="pb-2">
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-warm shadow-glow">
                <PawPrint className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="font-heading text-2xl">List Your <span className="text-gradient-warm">Pet</span></CardTitle>
              <CardDescription>
                Fill in the details below to help find a loving home for your pet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Pet Photos</Label>
                <div className="flex gap-3">
                  <div className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 transition-all hover:border-primary hover:bg-primary/10 hover:shadow-glow">
                    <Camera className="mb-1 h-6 w-6 text-primary" />
                    <span className="text-xs text-muted-foreground">Main Photo</span>
                  </div>
                  <div className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50 transition-all hover:border-primary/50 hover:bg-muted">
                    <Upload className="mb-1 h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add More</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="petName">Pet Name</Label>
                  <Input id="petName" placeholder="e.g. Buddy" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Pet Type</Label>
                  <Select>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">🐕 Dog</SelectItem>
                      <SelectItem value="cat">🐈 Cat</SelectItem>
                      <SelectItem value="bird">🐦 Bird</SelectItem>
                      <SelectItem value="rabbit">🐇 Rabbit</SelectItem>
                      <SelectItem value="other">🐾 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input id="breed" placeholder="e.g. Golden Retriever" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" placeholder="e.g. 2 years" className="h-11 rounded-xl" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price / Adoption Fee ($)</Label>
                  <Input id="price" type="number" placeholder="0 for free adoption" className="h-11 rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. San Francisco, CA" className="h-11 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Tell potential adopters about your pet's personality, habits, and needs..." rows={4} className="rounded-xl" />
              </div>

              <div className="flex items-center justify-between rounded-2xl glass p-5">
                <div>
                  <Label className="text-base font-heading font-bold">Vaccinated</Label>
                  <p className="text-sm text-muted-foreground">Is your pet fully vaccinated?</p>
                </div>
                <Switch />
              </div>

              <Button className="w-full h-12 rounded-xl bg-gradient-warm hover:opacity-90 transition-opacity border-0 shadow-glow text-base font-heading font-bold" size="lg">
                Publish Listing
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListPet;
