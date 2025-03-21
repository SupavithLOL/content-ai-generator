"use server"

import { db } from "../db";
import { SubscriptionStatus } from "@prisma/client";

export const getStripeCustomerById = async(userId: string) => {
  return db.user.findFirst({
    where: { id: userId },
    select: {stripeCustomerId: true}
  })
};  

export const getUserSubscription = async (userId: string) => {
    return db.subscription.findFirst({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      select: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
        planId: true,
      },
    });
  };