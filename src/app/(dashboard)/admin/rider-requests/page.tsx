import RiderRequestsTabs from "@/components/modules/rider-requests/rider-requests-tabs";

export default function RiderRequestsPage() {
  return (
    <section className="p-5">
      <div>
        <h1 className="text-2xl font-semibold">Rider Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review rider applications and approve or reject them.
        </p>
      </div>
      <RiderRequestsTabs />
    </section>
  );
}
