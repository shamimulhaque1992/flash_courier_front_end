"use client";

import { getCustomerAnalytics } from "@/api";
import { StatCard, StatCardSkeleton } from "@/components/modules/analytics/stat-card";
import type { CustomerAnalytics } from "@/types";
import { useEffect, useState } from "react";

export default function CustomerAnalyticsDashboard() {
  const [data, setData] = useState<CustomerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomerAnalytics()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 7 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!data) return <p className="text-muted-foreground">Failed to load analytics.</p>;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">My Orders</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard title="Total" value={data.shipments.total} />
          <StatCard title="Delivered" value={data.shipments.delivered} />
          <StatCard title="Out for Delivery" value={data.shipments.outForDelivery} />
          <StatCard title="In Transit" value={data.shipments.inTransit} />
          <StatCard title="Returned" value={data.shipments.returned} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Financials</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard title="Total Spent" value={`৳${data.financials.totalAmountSpent.toFixed(2)}`} />
          <StatCard title="Total Refunded" value={`৳${data.financials.totalRefunded.toFixed(2)}`} />
        </div>
      </section>
    </div>
  );
}
