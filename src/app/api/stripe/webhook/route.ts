import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { SubscriptionStatus, CreditTransactionType } from "@prisma/client";
import { headers } from "next/headers";
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = (await headers()).get("stripe-signature");

    if (!sig) {
        return new NextResponse("Missing stripe-signature", { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("Webhook signature verification failed.", err);
        return new NextResponse("Webhook signature verification failed", { status: 400 });
    }

    const eventId = event.id;

    const isProcessed = await isEventProcessed(eventId);
    if (isProcessed) {
        console.warn(`[Webhook] - Event ID ${eventId} already processed. Ignoring.`);
        return new NextResponse("Success (Idempotent - Already Processed)", { status: 200 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
                break;
            case "invoice.payment_succeeded":
                await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
                break;
            case "customer.subscription.deleted":
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;
            case "customer.subscription.updated":
                await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        await markEventProcessed(eventId);
        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return new NextResponse("Webhook processing error", { status: 500 });
    }
}

async function isEventProcessed(eventId: string): Promise<boolean> {
    const existingEvent = await db.webhookEvent.findUnique({
        where: { eventId: eventId },
    });
    return !!existingEvent;
}

async function markEventProcessed(eventId: string): Promise<void> {
    await db.webhookEvent.create({
        data: { eventId: eventId },
    });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    try {
        const userEmail = session.customer_details?.email as string;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (!userEmail || !subscriptionId || !customerId) {
            console.warn("[Webhook:checkout.session.completed] - Missing userEmail, subscriptionId, or customerId in checkout.session.completed event (Subscription Mode)");
            return;
        }

        const user = await db.user.findUnique({
            where: { email: userEmail },
            include: { subscriptions: true },
        });

        if (!user) {
            console.error("[Webhook:checkout.session.completed] - User not found for email:", userEmail);
            return;
        }

        const activeSubscription = user.subscriptions.find(sub => sub.status === SubscriptionStatus.ACTIVE);
        if (activeSubscription) {
            console.warn(`[Webhook:checkout.session.completed] - User ${userEmail} already has an active subscription (ID: ${activeSubscription.id}). Preventing duplicate subscription.`);
            return new NextResponse("User already has an active subscription", { status: 409 });
        }

        const subscriptionObject = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscriptionObject.items.data[0].price.id;
        const periodEndTimestamp = subscriptionObject.current_period_end;
        const endDate = periodEndTimestamp ? new Date(periodEndTimestamp * 1000) : null;
        const amountTotal = session.amount_total; // May be null or 0 in subscription initial checkout
        const currency = session.currency; // May be null in subscription initial checkout

        const plan = await db.plan.findFirst({ where: { stripePriceId: priceId }, include: { planFeatures: true } });
        if (!plan) {
            console.error("[Webhook:checkout.session.completed] - Plan not found for priceId:", priceId);
            return;
        }

        const creditLimitFeature = plan.planFeatures.find(feature => feature.limitType === 'CREDIT_LIMIT');
        let creditAmountToAdd = 0;

        if (creditLimitFeature && creditLimitFeature.limitValue !== 'unlimited') {
            creditAmountToAdd = parseInt(creditLimitFeature.limitValue, 10);
        }

        if (creditAmountToAdd > 0) {
            await db.user.update({
                where: { email: userEmail },
                data: { credit: { set: creditAmountToAdd } },
            });
            await db.creditHistory.create({
                data: {
                    userId: user.id,
                    amount: creditAmountToAdd,
                    type: CreditTransactionType.EARNED
                }
            })
            console.log(`[Webhook:checkout.session.completed] - Initial credit of ${creditAmountToAdd} allocated to user ${userEmail}`);
        } else {
            console.log(`[Webhook:checkout.session.completed] - No credit allocation for plan ${plan.name} (or unlimited credit)`);
        }

        let paymentMethodDescription: string = session.payment_method_types?.[0] || "card";
        let cardBrand: string | null = null;
        let cardLast4: string | null = null;

        console.log(`[Webhook Debug - Checkout] Default paymentMethodDescription: ${paymentMethodDescription}`);

        try {
            const paymentMethods = await stripe.customers.listPaymentMethods(customerId, { type: 'card' });
            console.log(`[Webhook Debug - Checkout] paymentMethods retrieved:`, paymentMethods); // Log paymentMethods object
            if (paymentMethods.data.length > 0) {
                const paymentMethod = paymentMethods.data[0]; // Use the first payment method in the list
                console.log(`[Webhook Debug - Checkout] paymentMethod from listPaymentMethods:`, paymentMethod); // Log paymentMethod
                if (paymentMethod.type === 'card' && paymentMethod.card) {
                    cardBrand = paymentMethod.card.brand || null;
                    cardLast4 = paymentMethod.card.last4 || null;
                    paymentMethodDescription = `${cardBrand} ${cardLast4}`;
                    console.log(`[Webhook Debug - Checkout] cardBrand: ${cardBrand}, cardLast4: ${cardLast4}`); // Log cardBrand and cardLast4
                    console.log(`[Webhook Debug - Checkout] Updated paymentMethodDescription: ${paymentMethodDescription}`); // Log updated description
                } else {
                    paymentMethodDescription = paymentMethod.type || "card"; // Use type of other payment methods if not card
                    console.log(`[Webhook Debug - Checkout] Payment Method is not card, paymentMethodDescription updated to type: ${paymentMethodDescription}`); // Log updated description for non-card
                }
            } else {
                console.warn("[Webhook:checkout.session.completed] - No payment methods found for customer:", customerId);
                paymentMethodDescription = "Card (Details Not Found)"; // Or other default value
                console.log(`[Webhook Debug - Checkout] No payment methods found, paymentMethodDescription set to: ${paymentMethodDescription}`); // Log default description when no payment methods
            }
        } catch (error) {
            console.error("Error listing payment methods for customer:", customerId, error);
            console.log(`[Webhook Debug - Checkout] Error listing payment methods, paymentMethodDescription remains default: ${paymentMethodDescription}`); // Log when error listing payment methods
            // paymentMethodDescription remains default "card" or value from session.payment_method_types
        }


        const subscription = await db.subscription.create({
            data: {
                userId: user.id,
                planId: plan.id,
                status: SubscriptionStatus.ACTIVE,
                startDate: new Date(),
                endDate: endDate,
                stripeSubscriptionId: subscriptionId,
            },
        });

        await db.payment.create({ // Create Payment record even for subscription initial checkout (amount may be 0)
            data: {
                userId: user.id,
                amount: (amountTotal || 0) / 100, // May be 0
                currency: currency || "usd", // May be "usd" or null
                status: "COMPLETED",
                method: paymentMethodDescription,
                provider: "stripe",
                subscriptionId: subscription.id,
                stripeCheckoutSessionId: session.id,
            },
        });

        

        await db.user.update({
            where: { email: userEmail },
            data: { stripeCustomerId: customerId }
        });

        await db.billingHistory.create({
            data: {
                userId: user.id,
                planId: plan.id,
                subscriptionId: subscription.id,
                planName: plan.name,
                purchaseDate: new Date(),
                endDate: endDate,
                amount: (amountTotal || 0) / 100, // May be 0
                paymentMethod: paymentMethodDescription,
                billingCycle: plan.billingCycle,
                status: SubscriptionStatus.ACTIVE,
            },
        });

    } catch (error) {
        console.error("[Webhook:checkout.session.completed] - Error in handleCheckoutSessionCompleted (Subscription Mode):", error);
        throw error;
    }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    try {
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) return;

        const subscription = await db.subscription.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
            include: { user: true, plan: { include: { planFeatures: true } } },
        });

        if (!subscription) {
            console.error("[Webhook:invoice.payment_succeeded] - Subscription not found for stripeSubscriptionId:", subscriptionId);
            return;
        }

        const creditLimitFeature = subscription.plan.planFeatures.find(feature => feature.limitType === 'CREDIT_LIMIT');
        let creditAmountToAdd = 0;

        if (creditLimitFeature && creditLimitFeature.limitValue !== 'unlimited') {
            creditAmountToAdd = parseInt(creditLimitFeature.limitValue, 10);
        }

        if (creditAmountToAdd > 0) {
            await db.user.update({
                where: { id: subscription.user.id },
                data: { credit: { increment: creditAmountToAdd } },
            });
            await db.creditHistory.create({
                data: {
                    userId: subscription.user.id,
                    amount: creditAmountToAdd,
                    type: CreditTransactionType.EARNED
                }
            })
            console.log(`[Webhook:invoice.payment_succeeded] - Renewal credit of ${creditAmountToAdd} added to user ${subscription.user.email}`);
        } else {
            console.log(`[Webhook:invoice.payment_succeeded] - No credit top-up for plan ${subscription.plan.name} (or unlimited credit)`);
        }

        const subscriptionObject = await stripe.subscriptions.retrieve(subscriptionId);
        const periodEndTimestamp = subscriptionObject.current_period_end;
        const endDate = periodEndTimestamp ? new Date(periodEndTimestamp * 1000) : null;
        const amountPaid = invoice.amount_paid;
        const currency = invoice.currency;

        let paymentMethodDescription: string = invoice.payment_settings?.payment_method_types?.[0] || "card";
        console.log(`[Webhook Debug - Invoice] Default paymentMethodDescription: ${paymentMethodDescription}`); // Log default description

        const paymentIntentId = invoice.payment_intent;
        console.log(`[Webhook Debug - Invoice] paymentIntentId: ${paymentIntentId}`); // Log paymentIntentId
        if (paymentIntentId) {
            try {
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string);
                console.log(`[Webhook Debug - Invoice] paymentIntent retrieved:`, paymentIntent); // Log paymentIntent object
                const paymentMethod = paymentIntent.payment_method;
                console.log(`[Webhook Debug - Invoice] paymentMethod from PaymentIntent:`, paymentMethod); // Log paymentMethod

                let cardBrand: string | null = null;
                let cardLast4: string | null = null;

                if (paymentMethod && typeof paymentMethod === 'string') {
                    const retrievedPaymentMethod = await stripe.paymentMethods.retrieve(paymentMethod);
                    console.log(`[Webhook Debug - Invoice] retrievedPaymentMethod:`, retrievedPaymentMethod); // Log retrievedPaymentMethod
                    if (retrievedPaymentMethod.type === 'card' && retrievedPaymentMethod.card) {
                        cardBrand = retrievedPaymentMethod.card.brand || null;
                        cardLast4 = retrievedPaymentMethod.card.last4 || null;
                        console.log(`[Webhook Debug - Invoice] cardBrand: ${cardBrand}, cardLast4: ${cardLast4}`); // Log cardBrand and cardLast4
                    }
                } else if (paymentMethod && typeof paymentMethod === 'object' && paymentMethod.type === 'card' && paymentMethod.card) {
                    cardBrand = paymentMethod.card.brand || null;
                    cardLast4 = paymentMethod.card.last4 || null;
                    console.log(`[Webhook Debug - Invoice] cardBrand (object): ${cardBrand}, cardLast4 (object): ${cardLast4}`); // Log cardBrand and cardLast4 (object)
                }

                if (cardBrand && cardLast4) {
                    paymentMethodDescription = `${cardBrand} ${cardLast4}`;
                    console.log(`[Webhook Debug - Invoice] Updated paymentMethodDescription: ${paymentMethodDescription}`); // Log updated description
                } else {
                    console.log(`[Webhook Debug - Invoice] cardBrand or cardLast4 is null, paymentMethodDescription remains default`); // Log if card details are missing
                }


            } catch (error) {
                console.error("Error retrieving PaymentIntent or PaymentMethod for invoice:", error);
            }
        } else {
            console.log("[Webhook Debug - Invoice] paymentIntentId is null or undefined"); // Log if paymentIntentId is missing
        }


        await db.subscription.update({
            where: { id: subscription.id },
            data: { status: SubscriptionStatus.ACTIVE, endDate: endDate },
        });


        await db.payment.create({
            data: {
                userId: subscription.user.id,
                amount: (amountPaid || 0) / 100,
                currency: currency || "usd",
                status: "COMPLETED",
                method: paymentMethodDescription,
                provider: "stripe",
                subscriptionId: subscription.id,
                // stripeInvoiceId: invoice.id,
            },
        });

        console.log("[Webhook:invoice.payment_succeeded] - Payment record created for subscriptionId:", subscription.id);

        await db.billingHistory.create({
            data: {
                userId: subscription.user.id,
                planId: subscription.plan.id,
                subscriptionId: subscription.id,
                planName: subscription.plan.name,
                purchaseDate: new Date(),
                endDate: endDate,
                amount: (amountPaid || 0) / 100,
                paymentMethod: paymentMethodDescription,
                billingCycle: subscription.plan.billingCycle,
                status: SubscriptionStatus.ACTIVE,
            },
        });
        console.log("[Webhook:invoice.payment_succeeded] - BillingHistory record created for renewal.");

    } catch (error) {
        console.error("[Webhook:invoice.payment_succeeded] - Error in handleInvoicePaymentSucceeded:", error);
        throw error;
    }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    try {
        const subscriptionId = subscription.id;
        console.log("[Webhook:customer.subscription.deleted] - Start handleSubscriptionDeleted for Stripe Subscription ID:", subscriptionId); // **Log: Start function**
        if (!subscriptionId) {
            console.warn("[Webhook:customer.subscription.deleted] - Subscription ID is missing in event data. Aborting update."); // **Log: Subscription ID missing**
            return;
        }

        const existingSubscription = await db.subscription.findFirst({
            where: { stripeSubscriptionId: subscriptionId }, include: { user: true, plan: true },
        });

        console.log("[Webhook:customer.subscription.deleted] - Query for existingSubscription with stripeSubscriptionId:", subscriptionId, "Result:", existingSubscription); // **Log: DB Query Result**

        if (!existingSubscription) {
            console.warn("[Webhook:customer.subscription.deleted] - Subscription not found in DB for stripeSubscriptionId:", subscriptionId, ". Aborting update."); // **Log: Subscription not found in DB**
            return;
        }

        const canceledAtTimestamp = subscription.canceled_at;
        const canceledAtDate = canceledAtTimestamp ? new Date(canceledAtTimestamp * 1000) : null;

        console.log("[Webhook:customer.subscription.deleted] - Before DB update - Subscription ID:", existingSubscription.id, "Current Status:", existingSubscription.status); // **Log: Before DB Update**

        await db.subscription.update({
            where: { id: existingSubscription.id },
            data: { status: SubscriptionStatus.CANCELED },
        });

        console.log("[Webhook:customer.subscription.deleted] - After DB update - Subscription ID:", existingSubscription.id, "Status updated to CANCELED."); // **Log: After DB Update (Success)**


        await db.billingHistory.create({
            data: {
                userId: existingSubscription.userId,
                planId: existingSubscription.planId,
                subscriptionId: existingSubscription.id,
                planName: existingSubscription.plan.name,
                purchaseDate: existingSubscription.startDate,
                endDate: canceledAtDate,
                amount: existingSubscription.plan.price,
                paymentMethod: "Stripe (Recorded)",
                billingCycle: existingSubscription.plan.billingCycle,
                status: SubscriptionStatus.CANCELED,
            },
        });

        console.log("[Webhook:customer.subscription.deleted] - Billing History created successfully for subscriptionId:", existingSubscription.id); // **Log: Billing History Created**


        console.log("[Webhook:customer.subscription.deleted] - Subscription CANCELED updated for subscriptionId:", existingSubscription.id); // **Log: Function Complete**


    } catch (error) {
        console.error("[Webhook:customer.subscription.deleted] - Error in handleSubscriptionDeleted:", error); // **Log: Error in Function**
        console.error("[Webhook:customer.subscription.deleted] - Error Details:", error); // **Log: Error Details**
        throw error;
    }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    try {
        const subscriptionId = subscription.id;
        if (!subscriptionId) return;

        const existingSubscription = await db.subscription.findFirst({
            where: { stripeSubscriptionId: subscriptionId }, include: { user: true, plan: true },
        });

        if (!existingSubscription) {
            console.warn("[Webhook:customer.subscription.updated] - Subscription not found for update (stripeSubscriptionId):", subscriptionId);
            return;
        }

        const stripeStatus = subscription.status;
        const periodEndTimestamp = subscription.current_period_end;
        const endDate = periodEndTimestamp ? new Date(periodEndTimestamp * 1000) : null;

        let dbStatus: SubscriptionStatus;
        if (stripeStatus === 'active' || stripeStatus === 'trialing') {
            dbStatus = SubscriptionStatus.ACTIVE;
        } else if (stripeStatus === 'canceled' || stripeStatus === 'incomplete_expired') {
            dbStatus = SubscriptionStatus.CANCELED;
        } else if (stripeStatus === 'past_due' || stripeStatus === 'unpaid') {
            dbStatus = SubscriptionStatus.EXPIRED;
        } else {
            dbStatus = SubscriptionStatus.INACTIVE;
        }


        await db.subscription.update({
            where: { id: existingSubscription.id },
            data: { status: dbStatus, endDate: endDate },
        });
        console.log(`[Webhook:customer.subscription.updated] - Subscription status updated to ${dbStatus} for subscriptionId:`, existingSubscription.id, `Stripe Status: ${stripeStatus}`);

        await db.billingHistory.create({
            data: {
                userId: existingSubscription.userId,
                planId: existingSubscription.planId,
                subscriptionId: existingSubscription.id,
                planName: existingSubscription.plan.name,
                purchaseDate: existingSubscription.startDate,
                endDate: endDate,
                amount: existingSubscription.plan.price,
                paymentMethod: "Stripe (Recorded)",
                billingCycle: existingSubscription.plan.billingCycle,
                status: dbStatus,
            },
        });
        console.log("[Webhook:customer.subscription.updated] - BillingHistory record created for status update.");


    } catch (error) {
        console.error("[Webhook:customer.subscription.updated] - Error in handleSubscriptionUpdated:", error);
        throw error;
    }
}