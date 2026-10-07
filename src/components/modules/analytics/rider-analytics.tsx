"use client";

import { getRiderAnalytics } from "@/api";
import { StatCard, StatCardSkeleton } from "@/components/modules/analytics/stat-card";
import type { RiderAnalytics } from "@/types";
import { useEffect, useState } from "react";

export default function RiderAnalyticsDashboard() {
  const [data, setData] = useState<RiderAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRiderAnalytics()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!data) return <p className="text-muted-foreground">Failed to load analytics.</p>;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">Schedules</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard title="Total" value={data.schedules.total} />
          <StatCard title="Published" value={data.schedules.published} />
          <StatCard title="Completed" value={data.schedules.completed} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Shipments</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard title="Total" value={data.shipments.total} />
          <StatCard title="Delivered" value={data.shipments.delivered} />
          <StatCard title="Out for Delivery" value={data.shipments.outForDelivery} />
          <StatCard title="Picked Up" value={data.shipments.pickedUp} />
          <StatCard title="Accepted" value={data.shipments.accepted} />
          <StatCard title="Rejected" value={data.shipments.rejected} />
        </div>
      </section>
    </div>
  );
}
