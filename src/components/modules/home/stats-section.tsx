const stats = [
  { value: "8", label: "Divisions Covered" },
  { value: "64", label: "Districts Served" },
  { value: "500+", label: "Verified Riders" },
  { value: "99%", label: "On-Time Delivery" },
];

export default function StatsSection() {
  return (
    <section className="py-16 px-4 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-5xl grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
        {stats.map(({ value, label }) => (
          <div key={label} className="space-y-1">
            <p className="text-4xl font-black">{value}</p>
            <p className="text-sm text-primary-foreground/70">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
