import { NextResponse,NextRequest } from 'next/server';
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId: requestedUserId } = await req.json();

    if (userId !== requestedUserId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const existingSubscription = await db.subscription.findFirst({
      where: { userId: requestedUserId, status: { not: "CANCELED" } },
    });

    if (!existingSubscription || !existingSubscription.stripeSubscriptionId) {
      return NextResponse.json({ message: "Subscription not found or already cancelled" }, { status: 404 });
    }

    const stripeSubscriptionId = existingSubscription.stripeSubscriptionId;

    try {
      const canceledSubscription = await stripe.subscriptions.cancel(stripeSubscriptionId);
      console.log(`Stripe Subscription cancelled: ${canceledSubscription.id}`);
    } catch (error: unknown) {
      if (error instanceof Stripe.errors.StripeError) {
        console.error("Stripe API Error:", error.message);
        return NextResponse.json({ message: `Stripe Error: ${error.message}` }, { status: 500 }); 
      }
      console.error("Unexpected Error cancelling Stripe Subscription:", error);
      return NextResponse.json({ message: "Failed to cancel Stripe Subscription" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscription cancellation initiated" });

  } catch (error: unknown) {
    console.error("Error in /api/subscription/cancel:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}