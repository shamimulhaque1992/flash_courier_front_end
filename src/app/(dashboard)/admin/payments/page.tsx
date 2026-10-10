import PaymentsTabs from "@/components/modules/payments/payments-tabs";

export default function AdminPaymentsPage() {
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
