const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      { title: "Overview", url: `${prefix}` },
      { title: "Merchant Requests", url: `${prefix}/merchant-requests` },
      { title: "Rider Requests", url: `${prefix}/rider-requests` },
      { title: "Merchants", url: `${prefix}/merchants` },
      { title: "Riders", url: `${prefix}/riders` },
    ],
  },
];
