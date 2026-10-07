"use client";

import { getMyCustomerProfile } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer } from "@/types";
import { useEffect, useState } from "react";

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4">
      <span className="w-48 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

export default function CustomerProfile() {
  const [data, setData] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCustomerProfile()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }

  if (!data) return <p className="text-muted-foreground">Failed to load profile.</p>;

  return (
    <div className="divide-y rounded-xl ring-1 ring-foreground/10">
      <div className="flex items-center gap-4 p-6">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted text-xl font-bold uppercase">
          {data.name[0]}
        </div>
        <div>
          <p className="text-lg font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.email}</p>
        </div>
      </div>
      <div className="divide-y px-6">
        <Row label="Contact Number" value={data.contactNumber} />
        <Row label="Address" value={data.address} />
        <Row label="Thana" value={data.thana} />
        <Row label="District" value={data.district} />
        <Row label="Division" value={data.division} />
      </div>
    </div>
  );
}
