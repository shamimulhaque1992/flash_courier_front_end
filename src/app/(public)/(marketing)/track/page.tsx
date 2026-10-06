"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ShipmentTracker from "@/components/modules/track-shipment/shipment-tracker";
import { trackShipmentPublic } from "@/api";
import type { TrackedShipment } from "@/types";

export default function TrackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [input, setInput] = useState(searchParams.get("q") ?? "");
  const [shipment, setShipment] = useState<TrackedShipment | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const q = searchParams.get("q") ?? "";

  useEffect(() => {
    if (!q) {
      setShipment(null);
      setNotFound(false);
      return;
    }
    setLoading(true);
    setNotFound(false);
    trackShipmentPublic(q)
      .then((res) => {
        setShipment(res.data ?? null);
        if (!res.data) setNotFound(true);
      })
      .catch(() => {
        setShipment(null);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [q]);

  const handleTrack = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const params = new URLSearchParams({ q: trimmed });
    router.push(`/track?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Track Your Parcel</h1>
        <p className="text-muted-foreground">
          Enter your tracking number to see the current status of your shipment.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="e.g. FC-ABC123-XY12"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTrack()}
          className="h-11"
        />
        <Button size="lg" onClick={handleTrack} disabled={!input.trim() || loading}>
          <Search className="size-4 mr-1" />
          Track
        </Button>
      </div>

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      )}

      {!loading && notFound && (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <span className="rounded-full bg-muted p-4">
            <SearchX className="size-6 text-muted-foreground" />
          </span>
          <p className="font-semibold text-lg">Shipment not found</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            No shipment found for{" "}
            <span className="font-mono font-medium">{q}</span>. Please check
            the tracking number and try again.
          </p>
        </div>
      )}

      {!loading && shipment && <ShipmentTracker shipment={shipment} />}
    </div>
  );
}
