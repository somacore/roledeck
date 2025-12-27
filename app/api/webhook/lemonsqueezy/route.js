// app/api/webhook/lemonsqueezy/route.js
import { NextResponse } from "next/server";
import { createAdminClient } from "@/libs/supabase/admin";
import crypto from "crypto";

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("x-signature");
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(body);
  const eventName = payload.meta.event_name;
  const userId = payload.meta.custom_data.user_id;
  const supabase = createAdminClient();

  if (eventName === "order_created") {
    const { error } = await supabase
      .from("profiles")
      .update({ 
        has_access: true,
        price_id: payload.data.attributes.variant_id.toString() 
      })
      .eq("id", userId);

    if (error) console.error("Webhook Update Error:", error);
  }

  return NextResponse.json({ received: true });
}