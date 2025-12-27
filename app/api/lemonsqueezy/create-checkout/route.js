// app/api/lemonsqueezy/create-checkout/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { createCheckout } from "@/libs/lemonsqueezy";

export async function POST(req) {
  const body = await req.json();

  if (!body.variantId) {
    return NextResponse.json({ error: "Variant ID is required" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checkoutUrl = await createCheckout({
      variantId: body.variantId,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://lvh.me:3000'}/dashboard`,
      user: user,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}