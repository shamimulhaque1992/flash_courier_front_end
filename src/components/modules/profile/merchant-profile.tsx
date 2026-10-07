"use client";

import { getMyMerchantProfile } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Merchant } from "@/types";
import { useEffect, useState } from "react";

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4">
      <span className="w-48 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

export default function MerchantProfile() {
  const [data, setData] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyMerchantProfile()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
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
          <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
            {data.verificationStatus.toLowerCase()}
          </span>
        </div>
      </div>
      <div className="divide-y px-6">
        <Row label="Contact Number" value={data.contactNumber} />
        <Row label="Business Type" value={data.businessType} />
        <Row label="Trade License No." value={data.tradeLicenseNumber} />
        <Row label="Business License No." value={data.businessLicenseNumber} />
        <Row label="Business Description" value={data.businessDescription} />
        <Row label="Address" value={data.address} />
        <Row label="Thana" value={data.thana} />
        <Row label="District" value={data.district} />
        <Row label="Division" value={data.division} />
      </div>
    </div>
  );
}
