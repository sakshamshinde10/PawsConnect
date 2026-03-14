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
        <main className="relative flex flex-1 items-center justify-center bg-gradient-hero py-12 overflow-hidden">
          <Card className="w-full max-w-md shadow-card-hover glass rounded-2xl animate-in relative text-center">
            <CardContent className="pt-10 pb-10 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="font-heading text-2xl font-bold">You're already signed in!</h2>
              <p className="text-muted-foreground">Welcome back, {user.email}</p>
              <div className="flex gap-3 justify-center pt-4">
                <Button className="rounded-xl bg-gradient-warm border-0 shadow-glow" asChild>
                  <Link to="/pets">Browse Pets</Link>
                </Button>
                <Button variant="outline" className="rounded-xl" asChild>
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
    const { error, confirmed } = await signUp(regEmail, regPassword, regName);
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

              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      className="h-11 rounded-xl"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-xl"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  {loginError && (
                    <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{loginError}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full h-11 rounded-xl bg-gradient-warm hover:opacity-90 transition-opacity border-0 shadow-glow"
                    size="lg"
                  >
                    {loginLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Signing In...</> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                {regSuccess ? (
                  <div className="text-center py-6 space-y-4 animate-in fade-in">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="font-heading text-xl font-bold">Account Created!</h3>
                    <p className="text-muted-foreground text-sm">
                      We've sent a confirmation email to <strong>{regEmail}</strong>. 
                      Please check your inbox and click the link to verify your account.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="h-11 rounded-xl"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="hello@example.com"
                        className="h-11 rounded-xl"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Minimum 6 characters"
                        className="h-11 rounded-xl"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </div>

                    {regError && (
                      <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{regError}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={regLoading}
                      className="w-full h-11 rounded-xl bg-gradient-warm hover:opacity-90 transition-opacity border-0 shadow-glow"
                      size="lg"
                    >
                      {regLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating Account...</> : "Create Account"}
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
