import AdminShipmentsTabs from "@/components/modules/admin-shipments/admin-shipments-tabs";

export default function AdminShipmentsPage() {
  return (
    <section className="p-5">
      <div>
        <h1 className="text-2xl font-semibold">All Shipments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage shipment statuses and assign riders to ready shipments.
        </p>
      </div>
      <AdminShipmentsTabs />
    </section>
  );
}
