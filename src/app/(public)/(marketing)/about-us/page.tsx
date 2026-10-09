import {
  Clock,
  Globe,
  MapPin,
  ShieldCheck,
  Target,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Zap,
    title: "Speed",
    description:
      "We obsess over delivery times. Same-day intra-division delivery is our standard, not a premium.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    description:
      "Every parcel is tracked end-to-end. Our verified rider network ensures your shipment arrives safely.",
  },
  {
    icon: Globe,
    title: "Coverage",
    description:
      "From Dhaka to Sylhet, Chittagong to Rangpur — we cover all 8 divisions and 64 districts of Bangladesh.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We empower merchants to grow their businesses and riders to earn on their own schedule.",
  },
];

const team = [
  {
    name: "Operations",
    description:
      "Our ops team ensures every schedule is optimised and every shipment is assigned to the right rider at the right time.",
  },
  {
    name: "Technology",
    description:
      "We build the platform that connects merchants, riders, and customers in real time — from payment to delivery.",
  },
  {
    name: "Support",
    description:
      "Our support team is always ready to resolve disputes, process refunds, and keep every stakeholder happy.",
  },
];

const milestones = [
  {
    year: "2022",
    event:
      "Flash Courier founded with a vision to modernise last-mile delivery in Bangladesh.",
  },
  {
    year: "2023",
    event:
      "Expanded to all 8 divisions. Onboarded 200+ verified merchants and 300+ riders.",
  },
  {
    year: "2024",
    event:
      "Launched real-time tracking, bKash payment integration, and automated refunds.",
  },
  {
    year: "2025",
    event:
      "Serving 64 districts with 500+ active riders and thousands of daily shipments.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-[#007595] py-24 px-4 text-white text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-4xl font-black sm:text-5xl">
            About Flash Courier
          </h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            Bangladesh's fastest-growing courier and logistics platform —
            connecting merchants, riders, and customers through technology.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Target className="size-4" /> Our Mission
            </span>
            <h2 className="text-3xl font-bold">Delivering more than parcels</h2>
            <p className="text-muted-foreground leading-relaxed">
              Flash Courier was built to solve a simple problem: last-mile
              delivery in Bangladesh is slow, opaque, and unreliable. We set out
              to change that by building a platform where merchants can ship
              with confidence, riders can earn fairly, and customers always know
              where their parcel is.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every feature we build — real-time tracking, instant payments,
              automated refunds — exists to remove friction from the delivery
              experience.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Truck, label: "500+ Active Riders" },
              { icon: MapPin, label: "64 Districts Covered" },
              { icon: Clock, label: "Same-Day Delivery" },
              { icon: ShieldCheck, label: "Secure bKash Payments" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-3 rounded-xl bg-muted/50 p-6 text-center"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </span>
                <p className="text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">What We Stand For</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our values guide every decision — from how we verify riders to how
              we handle refunds.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-0 shadow-sm">
                <CardContent className="pt-6 space-y-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </span>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Our Journey</h2>
            <p className="text-muted-foreground">
              From a small idea to a nationwide logistics platform.
            </p>
          </div>
          <ol className="relative border-l border-border space-y-8 pl-6">
            {milestones.map(({ year, event }) => (
              <li key={year} className="relative">
                <span className="absolute -left-[1.65rem] flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-4 ring-background">
                  {year.slice(2)}
                </span>
                <p className="text-xs font-semibold text-primary mb-1">
                  {year}
                </p>
                <p className="text-sm text-muted-foreground">{event}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">
              The People Behind Flash Courier
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A dedicated team working every day to make deliveries faster and
              more reliable.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {team.map(({ name, description }) => (
              <Card key={name} className="border-0 shadow-sm">
                <CardContent className="pt-6 space-y-2">
                  <h3 className="font-semibold">{name}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
          {[
            { value: "8", label: "Divisions Covered" },
            { value: "64", label: "Districts Served" },
            { value: "500+", label: "Verified Riders" },
            { value: "99%", label: "On-Time Delivery" },
          ].map(({ value, label }) => (
            <div key={label} className="space-y-1">
              <p className="text-4xl font-black">{value}</p>
              <p className="text-sm text-primary-foreground/70">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
