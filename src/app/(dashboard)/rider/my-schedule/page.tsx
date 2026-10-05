import MyScheduleTabs from "@/components/modules/my-schedule/my-schedule-tabs";

export default function MySchedulePage() {
  return (
    <section className="p-6">
      <div className="mb-1">
        <h1 className="text-2xl font-semibold">My Schedules</h1>
        <p className="text-sm text-muted-foreground">
          Manage your weekly delivery schedules. You can create one schedule per day of the week.
        </p>
      </div>
      <MyScheduleTabs />
    </section>
  );
}
