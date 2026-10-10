"use client";

import { format } from "date-fns";
import { ArrowLeft, CreditCard, Package, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuspenseGetSinglePayment } from "@/hooks/payment.hook";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-600",
};

const SHIPMENT_STATUS_BADGE: Record<string, string> = {
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

const formatStatus = (s: string) =>
  s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

function PaymentDetailContent({ paymentId, backHref }: { paymentId: string; backHref: string }) {
  const { data } = useSuspenseGetSinglePayment(paymentId);
  const router = useRouter();
  const payment = data?.data;

  if (!payment) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Payment not found.</p>
        <Button variant="link" onClick={() => router.push(backHref)}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <Button variant="ghost" size="sm" onClick={() => router.push(backHref)}>
        <ArrowLeft className="mr-1 size-4" /> Back to Payments
      </Button>

      {/* Payment Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="font-mono text-base">{payment.shipment.trackingNumber}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Created on {format(new Date(payment.createdAt), "PPP")}
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[payment.status] ?? ""}`}
            >
              {payment.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />

          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <CreditCard className="size-3.5" /> Payment Details
            </p>
            <DetailRow label="Amount" value={`${payment.amount} BDT`} />
            {payment.bkashTrxId && (
              <DetailRow label="bKash Trx ID" value={<span className="font-mono">{payment.bkashTrxId}</span>} />
            )}
            {payment.bkashPaymentId && (
              <DetailRow label="bKash Payment ID" value={<span className="font-mono">{payment.bkashPaymentId}</span>} />
            )}
            {payment.payerReference && (
              <DetailRow label="Payer Reference" value={payment.payerReference} />
            )}
            {payment.paidAt && !Number.isNaN(new Date(payment.paidAt).getTime()) && (
              <DetailRow label="Paid At" value={format(new Date(payment.paidAt), "PPp")} />
            )}
            {payment.refundTrxId && (
              <DetailRow label="Refund Trx ID" value={<span className="font-mono">{payment.refundTrxId}</span>} />
            )}
            {payment.refundAmount != null && (
              <DetailRow label="Refund Amount" value={`${payment.refundAmount} BDT`} />
            )}
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Package className="size-3.5" /> Shipment
            </p>
            <DetailRow
              label="Status"
              value={
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${SHIPMENT_STATUS_BADGE[payment.shipment.shipmentStatus] ?? ""}`}
                >
                  {formatStatus(payment.shipment.shipmentStatus)}
                </span>
              }
            />
            <DetailRow label="Receiver" value={payment.shipment.receiverName} />
            <DetailRow
              label="Destination"
              value={
                <span className="capitalize">
                  {payment.shipment.receiverDistrict},{" "}
                  {payment.shipment.receiverDivision.toLowerCase()}
                </span>
              }
            />
          </div>

          {payment.shipment.merchant && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <User className="size-3.5" /> Merchant
                </p>
                <DetailRow label="Name" value={payment.shipment.merchant.name} />
                <DetailRow label="Email" value={payment.shipment.merchant.email} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function PaymentDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-72 w-full rounded-lg" />
    </div>
  );
}

export default PaymentDetailContent;
