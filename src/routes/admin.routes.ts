const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      { title: "Overview", url: `${prefix}` },
      { title: "Merchants", url: `${prefix}/merchants` },
      { title: "Riders", url: `${prefix}/riders` },
    ],
  },
];
