"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  const handleTrack = () => {
    const trimmed = trackingNumber.trim();
    if (!trimmed) return;
    const params = new URLSearchParams({ q: trimmed });
    router.push(`/track?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-24 px-4">
      <div className="mx-auto max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
          <Zap className="size-3.5 text-primary" />
          Fast & Reliable Delivery Across Bangladesh
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Deliver Anything,{" "}
          <span className="text-primary">Anywhere</span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Flash Courier connects merchants, riders, and customers for seamless
          parcel delivery across every division in Bangladesh.
        </p>

        {/* Track parcel inline */}
        <div className="mx-auto max-w-xl space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Track your parcel instantly
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Enter tracking number e.g. FC-ABC123-XY12"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              className="h-11"
            />
            <Button size="lg" onClick={handleTrack} disabled={!trackingNumber.trim()}>
              <Search className="size-4 mr-1" />
              Track
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
