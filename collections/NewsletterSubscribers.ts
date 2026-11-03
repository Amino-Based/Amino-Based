import type { CollectionConfig } from "payload";

export const NewsletterSubscribers: CollectionConfig = {
  slug: "newsletter-subscribers",
  admin: { group: 'Customers',
    useAsTitle: "email",
    defaultColumns: ["email", "createdAt"],
  },
  access: {
    create: () => true,
    read: ({ req }) => req.user?.role === "admin",
    update: () => false,
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    { name: "email", type: "email", required: true, unique: true },
  ],
};
