import PaymentsTabs from "@/components/modules/payments/payments-tabs";

export default function MerchantPaymentsPage() {
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
