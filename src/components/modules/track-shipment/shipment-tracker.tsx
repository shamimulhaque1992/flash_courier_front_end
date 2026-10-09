import { format } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ShipmentStatus, TrackedShipment } from "@/types";

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Payment Confirmed",
  READY_FOR_ASSIGNMENT: "Ready for Assignment",
  ASSIGNED: "Rider Assigned",
  ACCEPTED_BY_RIDER: "Accepted by Rider",
  REJECTED_BY_RIDER: "Rejected by Rider",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED_BY_MERCHANT: "Cancelled",
};

const STATUS_BADGE: Record<ShipmentStatus, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  READY_FOR_ASSIGNMENT: "bg-purple-100 text-purple-800",
  ASSIGNED: "bg-indigo-100 text-indigo-800",
  ACCEPTED_BY_RIDER: "bg-cyan-100 text-cyan-800",
  REJECTED_BY_RIDER: "bg-red-100 text-red-800",
  PICKED_UP: "bg-[#007595]/10 text-[#007595]",
  IN_TRANSIT: "bg-sky-100 text-sky-800",
  OUT_FOR_DELIVERY: "bg-teal-100 text-teal-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED_BY_MERCHANT: "bg-gray-100 text-gray-600",
};

export default function ShipmentTracker({
  shipment,
}: {
  shipment: TrackedShipment;
}) {
  const isDelivered = shipment.shipmentStatus === "DELIVERED";
  const isCancelled = shipment.shipmentStatus === "CANCELLED_BY_MERCHANT";

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tracking Number</p>
              <CardTitle className="font-mono text-xl">
                {shipment.trackingNumber}
              </CardTitle>
            </div>
            <span
              className={`inline-flex items-center self-start rounded-full px-3 py-1 text-sm font-medium ${STATUS_BADGE[shipment.shipmentStatus]}`}
            >
              {STATUS_LABELS[shipment.shipmentStatus]}
            </span>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Receiver</p>
              <p className="font-medium">{shipment.receiverName}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Destination</p>
              <p className="font-medium">
                {shipment.receiverDistrict},{" "}
                <span className="capitalize">
                  {shipment.receiverDivision.toLowerCase()}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">
                {isDelivered ? "Delivered At" : "Probable Delivery"}
              </p>
              <p className="font-medium">
                {isDelivered && shipment.actualDeliveryTime
                  ? format(new Date(shipment.actualDeliveryTime), "PPp")
                  : shipment.probableDeliveryTime
                    ? format(new Date(shipment.probableDeliveryTime), "PPp")
                    : "To be determined"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Shipment Created</p>
              <p className="font-medium">
                {format(new Date(shipment.createdAt), "PPp")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shipment History</CardTitle>
        </CardHeader>
        <CardContent>
          {shipment.shipmentHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history yet.</p>
          ) : (
            <ol className="relative border-l border-border ml-3 space-y-6">
              {[...shipment.shipmentHistory].reverse().map((entry, i) => {
                const isFirst = i === 0;
                return (
                  <li key={i} className="ml-6">
                    <span
                      className={`absolute -left-3 flex size-6 items-center justify-center rounded-full ring-4 ring-background ${
                        isFirst
                          ? isCancelled
                            ? "bg-red-100 text-red-600"
                            : "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isFirst ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : (
                        <Circle className="size-3" />
                      )}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <p
                        className={`font-medium text-sm ${isFirst ? "" : "text-muted-foreground"}`}
                      >
                        {STATUS_LABELS[entry.status as ShipmentStatus] ??
                          entry.status}
                      </p>
                      {entry.remarks && (
                        <p className="text-xs text-muted-foreground">
                          {entry.remarks}
                        </p>
                      )}
                      <time className="text-xs text-muted-foreground">
                        {format(new Date(entry.updatedAt), "PPp")}
                      </time>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
