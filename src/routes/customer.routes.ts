const prefix = "/customer";

export const customerRoutes = [
  {
    title: "Overview",
    items: [
      { title: "Overview", url: `${prefix}` },
    ],
  },
  {
    title: "Orders",
    items: [
      { title: "My Orders", url: `${prefix}/orders` },
      { title: "My Profile", url: `${prefix}/my-profile` },
    ],
  },
];
