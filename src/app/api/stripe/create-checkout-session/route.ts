import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db, SubscriptionStatus } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { priceId, customerEmail } = await req.json();

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Missing customer email" },
        { status: 400 }
      );
    }

    // --- Check for Active Subscription Before Creating Checkout Session ---
    const existingUser = await db.user.findUnique({
      where: { email: customerEmail },
      include: { subscriptions: true },
    });

    if (existingUser) {
      const activeSubscription = existingUser.subscriptions.find(
        (sub) => sub.status === SubscriptionStatus.ACTIVE 
      );

      if (activeSubscription) {
        console.warn(`[API:create-checkout-session] - User ${customerEmail} already has an active subscription (ID: ${activeSubscription.id}). Preventing new checkout session.`);
        return NextResponse.json(
          { message: "You already have an active subscription." },
          { status: 409 } 
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
    
  }
}