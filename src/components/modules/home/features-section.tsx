import { Clock, MapPin, ShieldCheck, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Same-Day Delivery",
    description:
      "Intra-division shipments are picked up and delivered within the same day.",
  },
  {
    icon: MapPin,
    title: "Nationwide Coverage",
    description:
      "We cover all 8 divisions of Bangladesh with a growing network of verified riders.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description:
      "Track your parcel at every step — from pickup to delivery — with live status updates.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Pay safely via bKash. Automatic refunds on cancellations, no questions asked.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Why Choose Flash Courier?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built for speed, reliability, and transparency at every step of the
            delivery journey.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
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
  );
}
