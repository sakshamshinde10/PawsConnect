import { Search, Video, Heart, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Filter",
    description: "Browse pets by type, breed, age, location and more.",
    gradient: "from-primary to-pet-amber",
    bg: "bg-primary/10",
  },
  {
    icon: Video,
    title: "Live Verify",
    description: "Watch live video of the pet to verify condition in real-time.",
    gradient: "from-pet-teal to-pet-lavender",
    bg: "bg-pet-teal/10",
  },
  {
    icon: Heart,
    title: "Connect & Adopt",
    description: "Message the owner, schedule a meet, and bring your pet home.",
    gradient: "from-pet-lavender to-primary",
    bg: "bg-pet-lavender/10",
  },
  {
    icon: CheckCircle,
    title: "Happy Home",
    description: "Welcome your new family member and share your story!",
    gradient: "from-pet-amber to-primary",
    bg: "bg-pet-amber/10",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gray-50 border-y border-gray-100">
      <div className="container relative">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-4xl font-extrabold md:text-5xl tracking-tight text-primary">
            How It <span className="text-secondary-foreground">Works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground text-lg">
            Four simple steps to find your perfect companion
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative rounded-3xl bg-white p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-2"
              style={{ animation: `fade-in 0.5s ease-out ${i * 0.1}s both` }}
            >
              {/* Step number */}
              <div className="absolute -top-4 -left-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading text-base font-bold text-white shadow-sm ring-4 ring-white">
                {i + 1}
              </div>

              {/* Icon */}
              <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${step.bg} transition-transform duration-300 group-hover:scale-110`}>
                <step.icon className="h-8 w-8 text-primary" />
              </div>

              <h3 className="mb-2 font-heading text-lg font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>

              {/* Connector line (hidden on last) */}
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-0.5 w-6 bg-gradient-to-r from-border to-transparent lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
