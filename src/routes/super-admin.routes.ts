const prefix = "/super-admin";

export const superAdminRoutes = [
  {
    title: "Management",
    items: [
      { title: "Overview", url: `${prefix}` },
      { title: "Manage Admins", url: `${prefix}/admins` },
    ],
  },
];
