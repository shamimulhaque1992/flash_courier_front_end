import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TrackPageClient from "@/components/modules/track-shipment/track-page-client";

function TrackPageFallback() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <div className="space-y-2 text-center">
        <Skeleton className="h-9 w-64 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<TrackPageFallback />}>
      <TrackPageClient />
    </Suspense>
  );
}
