import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint } from "lucide-react";

const Login = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex flex-1 items-center justify-center bg-gradient-hero py-12 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -right-20 -top-20 h-72 w-72 bg-primary/10 blur-3xl" style={{ animation: "blob 8s ease-in-out infinite" }} />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 bg-pet-amber/15 blur-3xl" style={{ animation: "blob 10s ease-in-out infinite reverse" }} />

        <Card className="w-full max-w-md shadow-card-hover glass rounded-2xl animate-in relative">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-warm shadow-glow">
              <PawPrint className="h-7 w-7 text-primary-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl">Welcome to <span className="text-gradient-warm">PawConnect</span></CardTitle>
            <CardDescription>Sign in to adopt or list pets</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/60">
                <TabsTrigger value="login" className="rounded-lg">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="hello@example.com" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" className="h-11 rounded-xl" />
                </div>
                <Button className="w-full h-11 rounded-xl bg-gradient-warm hover:opacity-90 transition-opacity border-0 shadow-glow" size="lg">Sign In</Button>
                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </p>
              </TabsContent>

              <TabsContent value="register" className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="hello@example.com" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" placeholder="••••••••" className="h-11 rounded-xl" />
                </div>
                <Button className="w-full h-11 rounded-xl bg-gradient-warm hover:opacity-90 transition-opacity border-0 shadow-glow" size="lg">Create Account</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
