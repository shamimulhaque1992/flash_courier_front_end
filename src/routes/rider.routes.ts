const prefix = "/rider";

export const riderRoutes = [
  {
    title: "Deliveries",
    items: [
      { title: "Overview", url: `${prefix}` },
      { title: "My Deliveries", url: `${prefix}/deliveries` },
    ],
  },
  {
    title: "Schedule",
    items: [
      { title: "My Schedule", url: `${prefix}/my-schedule` },
    ],
  },
];
