"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  Box,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Star,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { ShipmentStatus } from "@/types";
import ReviewDialog from "./review-dialog";
import { useGetSingleCustomerShipment } from "@/hooks";

const STATUS_BADGE: Record<ShipmentStatus, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  READY_FOR_ASSIGNMENT: "bg-purple-100 text-purple-800",
  ASSIGNED: "bg-indigo-100 text-indigo-800",
  ACCEPTED_BY_RIDER: "bg-cyan-100 text-cyan-800",
  REJECTED_BY_RIDER: "bg-red-100 text-red-800",
  PICKED_UP: "bg-orange-100 text-orange-800",
  IN_TRANSIT: "bg-sky-100 text-sky-800",
  OUT_FOR_DELIVERY: "bg-teal-100 text-teal-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED_BY_MERCHANT: "bg-gray-100 text-gray-600",
};

const formatStatus = (s: string) =>
  s
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

export default function ShipmentDetailView({
  shipmentId,
}: {
  shipmentId: string;
}) {
  const { data, isLoading, isError } = useGetSingleCustomerShipment(shipmentId);
  const [reviewOpen, setReviewOpen] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 py-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Shipment not found.</p>
        <Button variant="link" onClick={() => router.push("/customer/orders")}>
          Back to orders
        </Button>
      </div>
    );
  }

  const shipment = data.data;
  const history = shipment.shipmentHistory ?? [];
  const isDelivered = shipment.shipmentStatus === "DELIVERED";
  const hasReview = !!shipment.reviews;

  return (
    <div className="mx-auto space-y-6 py-8">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/customer/orders")}
        >
          <ArrowLeft className="mr-1 size-4" /> Back to orders
        </Button>

        {isDelivered && !hasReview && (
          <Button size="sm" onClick={() => setReviewOpen(true)}>
            <Star className="mr-1.5 size-4" /> Leave a Review
          </Button>
        )}
        {isDelivered && hasReview && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-green-500" /> Reviewed
          </span>
        )}
      </div>

      {/* Summary card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="font-mono text-base">
                {shipment.trackingNumber}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Placed on {format(new Date(shipment.createdAt), "PPP")}
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[shipment.shipmentStatus]}`}
            >
              {formatStatus(shipment.shipmentStatus)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />

          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <User className="size-3.5" /> Receiver
            </p>
            <DetailRow label="Name" value={shipment.receiverName} />
            <DetailRow label="Contact" value={shipment.receiverContactNumber} />
            <DetailRow label="Email" value={shipment.receiverEmail} />
            <DetailRow
              label="Address"
              value={
                <span className="capitalize">
                  {[
                    shipment.receiverThana,
                    shipment.receiverDistrict,
                    shipment.receiverDivision.toLowerCase(),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              }
            />
            {shipment.receiverAddress && (
              <DetailRow
                label="Full Address"
                value={shipment.receiverAddress}
              />
            )}
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Package className="size-3.5" /> Package
            </p>
            <DetailRow
              label="Weight"
              value={`${shipment.packageWeight} kg`}
            />
            {shipment.packageDimensions && (
              <DetailRow
                label="Dimensions"
                value={shipment.packageDimensions}
              />
            )}
            {shipment.packageDescription && (
              <DetailRow
                label="Description"
                value={shipment.packageDescription}
              />
            )}
            <DetailRow
              label="Fragile"
              value={shipment.isFragile ? "Yes" : "No"}
            />
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Box className="size-3.5" /> Delivery
            </p>
            <DetailRow
              label="Fee"
              value={`${shipment.deliveryFee} BDT`}
            />
            {shipment.probableDeliveryTime && (
              <DetailRow
                label="Probable Delivery"
                value={format(new Date(shipment.probableDeliveryTime), "PPp")}
              />
            )}
            {shipment.actualDeliveryTime && (
              <DetailRow
                label="Delivered At"
                value={format(new Date(shipment.actualDeliveryTime), "PPp")}
              />
            )}
            {shipment.rider && (
              <DetailRow label="Rider" value={shipment.rider.name} />
            )}
            {shipment.merchant && (
              <DetailRow label="Merchant" value={shipment.merchant.name} />
            )}
          </div>

          {shipment.note && (
            <>
              <Separator />
              <DetailRow label="Note" value={shipment.note} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      {history.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4" /> Shipment Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-border ml-3 space-y-6">
              {[...history].reverse().map((h, i) => (
                <li key={i} className="ml-6">
                  <span className="absolute -left-2 flex size-4 items-center justify-center rounded-full bg-primary ring-4 ring-background">
                    <MapPin className="size-2.5 text-primary-foreground" />
                  </span>
                  <p className="text-sm font-medium">
                    {formatStatus(h.status)}
                  </p>
                  {h.remarks && (
                    <p className="text-xs text-muted-foreground">{h.remarks}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(h.updatedAt), "PPp")}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      <ReviewDialog
        shipment={reviewOpen ? shipment : null}
        onClose={() => setReviewOpen(false)}
      />
    </div>
  );
}
