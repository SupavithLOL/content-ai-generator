"use server"

import { db } from "../db";
import { SubscriptionStatus } from "@prisma/client";
import { cache } from 'react'

export const getUserSubscription = cache(async (userId: string) => {
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
  });