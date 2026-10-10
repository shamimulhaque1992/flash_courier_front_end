import PaymentsTable from "@/components/modules/payments/payments-table";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Payments</h1>
        <p className="text-sm text-muted-foreground">View all payment transactions across merchants.</p>
      </div>
      <PaymentsTable role="admin" />
    </div>
  );
}
