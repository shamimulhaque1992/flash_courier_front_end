"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PaymentsTabs from "@/components/modules/payments/payments-tabs";
import PaymentDetailContent, {
  PaymentDetailSkeleton,
} from "@/components/modules/payments/payment-detail-view";

function AdminPaymentsContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  if (paymentId) {
    return (
      <Suspense fallback={<PaymentDetailSkeleton />}>
        <PaymentDetailContent
          paymentId={paymentId}
          backHref="/admin/payments"
        />
      </Suspense>
    );
  }

  return (
    <section className="p-5">
      <div>
        <h1 className="text-2xl font-semibold">All Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all payment transactions across merchants.
        </p>
      </div>
      <PaymentsTabs role="admin" />
    </section>
  );
}

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<PaymentDetailSkeleton />}>
      <AdminPaymentsContent />
    </Suspense>
  );
}
