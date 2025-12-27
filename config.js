const config = {
  appName: "RoleDeck",
  appDescription:
    "Create tailored, password-protected resume decks. Know exactly when recruiters open your links.",
  domainName: "roledeck.io",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  // Lemon Squeezy Configuration
  lemonsqueezy: {
    plans: [
      {
        // Use variant IDs from your Lemon Squeezy Dashboard
        variantId:
          process.env.NODE_ENV === "development"
            ? "VARIANT_ID_DEV" // e.g., "54321"
            : "VARIANT_ID_PROD",
        name: "Starter",
        description: "Perfect for small projects",
        price: 79,
        features: [
          { name: "NextJS boilerplate" },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
        ],
      },
      {
        isFeatured: true,
        variantId:
          process.env.NODE_ENV === "development"
            ? "VARIANT_ID_DEV_ADV"
            : "VARIANT_ID_PROD_ADV",
        name: "Advanced",
        description: "You need more power",
        price: 99,
        priceAnchor: 149,
        features: [
          { name: "NextJS boilerplate" },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
          { name: "1 year of updates" },
          { name: "24/7 support" },
        ],
      },
    ],
  },
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h"
            : "price_456",
        name: "Starter",
        description: "Perfect for small projects",
        price: 79,
        priceAnchor: 99,
        features: [
          { name: "NextJS boilerplate" },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
        ],
      },
      {
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw"
            : "price_456",
        name: "Advanced",
        description: "You need more power",
        price: 99,
        priceAnchor: 149,
        features: [
          { name: "NextJS boilerplate" },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
          { name: "1 year of updates" },
          { name: "24/7 support" },
        ],
      },
    ],
  },
  aws: {
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    fromNoReply: `ShipFast <noreply@resend.shipfa.st>`,
    fromAdmin: `Marc at ShipFast <marc@resend.shipfa.st>`,
    supportEmail: "marc.louvion@gmail.com",
  },
  colors: {
    main: "#570df8",
  },
  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
  },
};

export default config;