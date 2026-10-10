import PaymentsTable from "@/components/modules/payments/payments-table";

export default function MerchantPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Payments</h1>
        <p className="text-sm text-muted-foreground">View all payment transactions for your shipments.</p>
      </div>
      <PaymentsTable role="merchant" />
    </div>
  );
}
