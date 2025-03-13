"use server"

import { db } from "../db";

export async function getUserSubscription(userId: string) {
    return db.subscription.findFirst({
      where: { userId },
      select: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
        planId: true,
      },
    });
  }