"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PaymentsTabs from "@/components/modules/payments/payments-tabs";
import PaymentDetailContent, {
  PaymentDetailSkeleton,
} from "@/components/modules/payments/payment-detail-view";

function MerchantPaymentsContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  if (paymentId) {
    return (
      <Suspense fallback={<PaymentDetailSkeleton />}>
        <PaymentDetailContent
          paymentId={paymentId}
          backHref="/merchant/payments"
        />
      </Suspense>
    );
  }

  return (
    <section className="p-5">
      <div>
        <h1 className="text-2xl font-semibold">My Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all payment transactions for your shipments.
        </p>
      </div>
      <PaymentsTabs role="merchant" />
    </section>
  );
}

export default function MerchantPaymentsPage() {
  return (
    <Suspense fallback={<PaymentDetailSkeleton />}>
      <MerchantPaymentsContent />
    </Suspense>
  );
}
