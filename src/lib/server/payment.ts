"use server"

import { db } from "../db";

export async function getUserPayment(userId: string) {
    return await db.payment.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          select: { 
            id: true,
            amount: true,
            currency: true,
            status: true,
            method: true,
            provider: true,
            createdAt: true,
            subscriptionId: true,
            stripeCheckoutSessionId: true,
          },
        });
}