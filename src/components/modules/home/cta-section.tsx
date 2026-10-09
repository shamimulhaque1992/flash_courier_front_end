import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Bike } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="border-y border-border/70 bg-muted/60 px-4 py-20">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">Join Flash Courier</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Whether you run a business or want to earn as a delivery rider, we
            have a place for you.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-100">
                <Store className="size-6 text-blue-600" />
              </span>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Become a Merchant</h3>
                <p className="text-sm text-muted-foreground">
                  Register your business and start shipping parcels across
                  Bangladesh with competitive rates and real-time tracking.
                </p>
              </div>
              <Button
                variant="outline"
                render={<Link href="/apply/merchant" />}
                nativeButton={false}
              >
                Apply as Merchant
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-green-100">
                <Bike className="size-6 text-green-600" />
              </span>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Become a Rider</h3>
                <p className="text-sm text-muted-foreground">
                  Earn money on your own schedule by delivering parcels in your
                  area. Flexible hours, fast payouts.
                </p>
              </div>
              <Button
                variant="outline"
                render={<Link href="/apply/rider" />}
                nativeButton={false}
              >
                Apply as Rider
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
