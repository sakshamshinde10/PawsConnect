import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  // Sign In state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign Up state
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  // If user is already logged in, redirect
  if (user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="relative flex flex-1 items-center justify-center bg-gray-50 py-12 overflow-hidden">
          <Card className="w-full max-w-md border border-gray-100 bg-white shadow-sm rounded-3xl animate-in relative text-center">
            <CardContent className="pt-10 pb-10 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="font-heading text-3xl font-extrabold text-primary">You're already signed in!</h2>
              <p className="text-muted-foreground text-lg">Welcome back, {user.email}</p>
              <div className="flex flex-col gap-3 justify-center pt-4 px-6">
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-sm h-12 text-base font-semibold" asChild>
                  <Link to="/pets">Browse Pets</Link>
                </Button>
                <Button variant="outline" className="rounded-full border-gray-200 h-12 text-base font-semibold hover:bg-gray-50 text-primary" asChild>
                  <Link to="/list-pet">List a Pet</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoginLoading(false);
    if (error) {
      setLoginError(error);
    } else {
      navigate("/dashboard");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegLoading(true);
    const { error, confirmed } = await signUp(regEmail, regPassword, regName, regPhone);
    setRegLoading(false);
    if (error) {
      setRegError(error);
    } else if (confirmed) {
      // Auto-confirmed (email confirmation is disabled) — redirect immediately
      navigate("/pets");
    } else {
      // Email confirmation is enabled — show "check your email" message
      setRegSuccess(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex flex-1 items-center justify-center bg-gray-50 py-12 overflow-hidden px-4">
        {/* Decorative blobs */}
        <div className="absolute -right-20 -top-20 h-72 w-72 bg-secondary/40 blur-3xl rounded-full" style={{ animation: "blob 8s ease-in-out infinite" }} />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 bg-primary/5 blur-3xl rounded-full" style={{ animation: "blob 10s ease-in-out infinite reverse" }} />

        <Card className="w-full max-w-md shadow-sm border border-gray-100 bg-white rounded-[40px] animate-in relative p-4 sm:p-6 z-10">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-sm">
              <PawPrint className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="font-heading text-3xl font-extrabold text-primary tracking-tight">Welcome to <span className="text-accent">PawConnect</span></CardTitle>
            <CardDescription className="text-base mt-2">Sign in to adopt or list pets</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-full p-1 h-12 bg-gray-100">
                <TabsTrigger value="login" className="rounded-full text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="rounded-full text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-8">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus-visible:ring-1 focus-visible:ring-primary/30 px-4"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 ml-1">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus-visible:ring-1 focus-visible:ring-primary/30 px-4"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  {loginError && (
                    <p className="text-sm text-destructive bg-destructive/10 p-3.5 rounded-2xl font-medium text-center">{loginError}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 transition-all border-0 shadow-sm font-bold text-base mt-2 text-white"
                  >
                    {loginLoading ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Signing In...</> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-8">
                {regSuccess ? (
                  <div className="text-center py-6 space-y-4 animate-in fade-in">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="font-heading text-2xl font-bold text-primary">Account Created!</h3>
                    <p className="text-muted-foreground text-sm">
                      We've sent a confirmation email to <strong>{regEmail}</strong>. 
                      Please check your inbox and click the link to verify your account.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700 ml-1">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus-visible:ring-1 focus-visible:ring-primary/30 px-4"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-phone" className="text-sm font-semibold text-gray-700 ml-1">Phone Number *</Label>
                      <Input
                        id="reg-phone"
                        type="tel"
                        placeholder="e.g. +91 9876543210"
                        className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus-visible:ring-1 focus-visible:ring-primary/30 px-4"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-sm font-semibold text-gray-700 ml-1">Email *</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="hello@example.com"
                        className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus-visible:ring-1 focus-visible:ring-primary/30 px-4"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-sm font-semibold text-gray-700 ml-1">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Minimum 6 characters"
                        className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus-visible:ring-1 focus-visible:ring-primary/30 px-4"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </div>

                    {regError && (
                      <p className="text-sm text-destructive bg-destructive/10 p-3.5 rounded-2xl font-medium text-center">{regError}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={regLoading}
                      className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 transition-all border-0 shadow-sm font-bold text-base mt-2 text-white"
                    >
                      {regLoading ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Creating Account...</> : "Create Account"}
                    </Button>
                  </form>
                )}
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
