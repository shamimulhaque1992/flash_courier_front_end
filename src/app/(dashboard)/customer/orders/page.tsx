"use client";

import MyOrdersTabs from "@/components/modules/my-orders/my-orders-tabs";
import ShipmentDetailView from "@/components/modules/my-orders/shipment-detail-view";
import { useSearchParams } from "next/navigation";

export default function MyOrdersPage() {
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
