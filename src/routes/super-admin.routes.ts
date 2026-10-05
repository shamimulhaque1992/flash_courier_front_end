const prefix = "/super-admin";

export const superAdminRoutes = [
  {
    title: "Management",
    items: [
      { title: "Overview", url: `${prefix}` },
      { title: "Manage Admins", url: `${prefix}/admins` },
      { title: "Shipments", url: `${prefix}/shipments` },
      { title: "Merchant Requests", url: `${prefix}/merchant-requests` },
      { title: "Rider Requests", url: `${prefix}/rider-requests` },
    ],
  },
];
