// libs/lemonsqueezy.js
import axios from "axios";

const ls = axios.create({
  baseURL: "https://api.lemonsqueezy.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  },
});

export const createCheckout = async ({ variantId, redirectUrl, user }) => {
  try {
    const response = await ls.post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: user.email,
            custom: {
              user_id: user.id,
            },
          },
          product_options: {
            redirect_url: redirectUrl,
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID },
          },
          variant: {
            data: { type: "variants", id: variantId },
          },
        },
      },
    });

    return response.data.data.attributes.url;
  } catch (e) {
    console.error("LS Checkout Error:", e.response?.data || e.message);
    return null;
  }
};