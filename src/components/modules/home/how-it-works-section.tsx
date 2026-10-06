import { BadgeCheck, CreditCard, PackageCheck, Truck } from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    step: "01",
    title: "Create & Pay",
    description:
      "Merchant creates a shipment, enters receiver details, and pays the delivery fee via bKash.",
  },
  {
    icon: Truck,
    step: "02",
    title: "Rider Assigned",
    description:
      "Admin assigns the shipment to a verified rider based on division and schedule.",
  },
  {
    icon: PackageCheck,
    step: "03",
    title: "Picked Up & In Transit",
    description:
      "Rider picks up the parcel and heads to the destination. Customer gets notified.",
  },
  {
    icon: BadgeCheck,
    step: "04",
    title: "Delivered",
    description:
      "Customer provides OTP to the rider to confirm delivery. Done!",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A simple 4-step process from shipment creation to doorstep delivery.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="relative flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-primary/15 leading-none">
                  {step}
                </span>
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                  <Icon className="size-5" />
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
