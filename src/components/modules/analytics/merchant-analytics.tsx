"use client";

import { getMerchantAnalytics } from "@/api";
import { StatCard, StatCardSkeleton } from "@/components/modules/analytics/stat-card";
import type { MerchantAnalytics } from "@/types";
import { useEffect, useState } from "react";

export default function MerchantAnalyticsDashboard() {
  const [data, setData] = useState<MerchantAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMerchantAnalytics()
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
        <h2 className="mb-3 text-lg font-semibold">Shipments</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard title="Total" value={data.shipments.total} />
          <StatCard title="Delivered" value={data.shipments.delivered} />
          <StatCard title="In Transit" value={data.shipments.inTransit} />
          <StatCard title="Paid" value={data.shipments.paid} />
          <StatCard title="Pending Payment" value={data.shipments.pendingPayment} />
          <StatCard title="Cancelled" value={data.shipments.cancelled} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Financials</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard title="Total Revenue" value={`৳${data.financials.totalRevenue.toFixed(2)}`} />
          <StatCard title="Total Refunded" value={`৳${data.financials.totalRefunded.toFixed(2)}`} />
          <StatCard title="Total Payments" value={data.financials.totalPayments} />
        </div>
      </section>
    </div>
  );
}
