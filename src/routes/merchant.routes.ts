const prefix = "/merchant";

export const merchantRoutes = [
  {
    title: "Shipments",
    items: [
      { title: "Overview", url: `${prefix}` },
      { title: "My Shipments", url: `${prefix}/shipments` },
      { title: "My Profile", url: `${prefix}/my-profile` },
    ],
  },
];
