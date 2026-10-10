const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      { title: "Overview", url: `${prefix}` },
      { title: "Shipments", url: `${prefix}/shipments` },
      { title: "Payments", url: `${prefix}/payments` },
      { title: "Reviews", url: `${prefix}/reviews` },
      { title: "Merchant Requests", url: `${prefix}/merchant-requests` },
      { title: "Rider Requests", url: `${prefix}/rider-requests` },
      { title: "Merchants", url: `${prefix}/merchants` },
      { title: "Riders", url: `${prefix}/riders` },
    ],
  },
];
