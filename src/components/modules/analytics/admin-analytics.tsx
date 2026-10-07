"use client";

import { getAdminAnalytics } from "@/api";
import { StatCard, StatCardSkeleton } from "@/components/modules/analytics/stat-card";
import type { AdminAnalytics } from "@/types";
import { useEffect, useState } from "react";

export default function AdminAnalyticsDashboard() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-muted-foreground">Failed to load analytics.</p>;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">Merchants</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard title="Total" value={data.merchants.total} />
          <StatCard title="Verified" value={data.merchants.verified} />
          <StatCard title="Pending" value={data.merchants.pending} />
          <StatCard title="Rejected" value={data.merchants.rejected} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Riders</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard title="Total" value={data.riders.total} />
          <StatCard title="Verified" value={data.riders.verified} />
          <StatCard title="Pending" value={data.riders.pending} />
          <StatCard title="Rejected" value={data.riders.rejected} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Shipments</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard title="Total" value={data.shipments.total} />
          <StatCard title="Delivered" value={data.shipments.delivered} />
          <StatCard title="In Transit" value={data.shipments.inTransit} />
          <StatCard title="Cancelled" value={data.shipments.cancelled} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Schedules</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard title="Total" value={data.schedules.total} />
          <StatCard title="Published" value={data.schedules.published} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Financials</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard title="Total Revenue" value={`৳${data.financials.totalRevenue.toFixed(2)}`} />
          <StatCard title="Total Refunded" value={`৳${data.financials.totalRefunded.toFixed(2)}`} />
        </div>
      </section>
    </div>
  );
}
