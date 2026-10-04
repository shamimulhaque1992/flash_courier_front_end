const prefix = "/merchant";

export const merchantRoutes = [
  {
    title: "Parcels",
    items: [
      { title: "Overview", url: `${prefix}` },
      { title: "My Parcels", url: `${prefix}/parcels` },
      { title: "Create Parcel", url: `${prefix}/parcels/create` },
    ],
  },
];
