import { Search, Video, Heart, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Search,
    title: "Search & Filter",
    description: "Browse pets by type, breed, age, location and more.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Video,
    title: "Live Verify",
    description: "Watch live video of the pet to verify condition in real-time.",
    color: "text-pet-teal bg-pet-teal/10",
  },
  {
    icon: Heart,
    title: "Connect & Adopt",
    description: "Message the owner, schedule a meet, and bring your pet home.",
    color: "text-pet-lavender bg-pet-lavender/10",
  },
  {
    icon: CheckCircle,
    title: "Happy Home",
    description: "Welcome your new family member and share your story!",
    color: "text-pet-amber bg-pet-amber/10",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/50 py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold">How It Works</h2>
          <p className="mt-2 text-muted-foreground">
            Four simple steps to find your perfect companion
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Card key={step.title} className="relative border-none bg-card shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}>
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
