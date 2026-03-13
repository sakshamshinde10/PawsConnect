import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Camera, Upload } from "lucide-react";

const ListPet = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">List Your Pet</CardTitle>
              <CardDescription>
                Fill in the details below to help find a loving home for your pet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Pet Photos</Label>
                <div className="flex gap-3">
                  <div className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-input bg-muted/50 transition-colors hover:border-primary hover:bg-muted">
                    <Camera className="mb-1 h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Main Photo</span>
                  </div>
                  <div className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-input bg-muted/50 transition-colors hover:border-primary hover:bg-muted">
                    <Upload className="mb-1 h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add More</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="petName">Pet Name</Label>
                  <Input id="petName" placeholder="e.g. Buddy" />
                </div>
                <div className="space-y-2">
                  <Label>Pet Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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
                  <Input id="breed" placeholder="e.g. Golden Retriever" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" placeholder="e.g. 2 years" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price / Adoption Fee ($)</Label>
                  <Input id="price" type="number" placeholder="0 for free adoption" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. San Francisco, CA" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Tell potential adopters about your pet's personality, habits, and needs..." rows={4} />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-muted p-4">
                <div>
                  <Label className="text-base">Vaccinated</Label>
                  <p className="text-sm text-muted-foreground">Is your pet fully vaccinated?</p>
                </div>
                <Switch />
              </div>

              <Button className="w-full" size="lg">
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
