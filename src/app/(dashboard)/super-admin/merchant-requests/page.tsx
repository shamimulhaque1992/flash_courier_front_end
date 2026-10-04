import MerchantRequestsTabs from "@/components/modules/merchant-requests/merchant-requests-tabs";

export default function SuperAdminMerchantRequestsPage() {
  return (
    <section className="p-5">
      <div>
        <h1 className="text-2xl font-semibold">Merchant Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review merchant applications and approve or reject them.
        </p>
      </div>
      <MerchantRequestsTabs />
    </section>
  );
}
