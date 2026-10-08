"use client";

import MyOrdersTabs from "@/components/modules/my-orders/my-orders-tabs";
import ShipmentDetailView from "@/components/modules/my-orders/shipment-detail-view";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function OrdersPageSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

function MyOrdersContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (id) {
    return (
      <div className="p-6">
        <ShipmentDetailView shipmentId={id} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">My Orders</h1>
      <MyOrdersTabs />
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<OrdersPageSkeleton />}>
      <MyOrdersContent />
    </Suspense>
  );
}
