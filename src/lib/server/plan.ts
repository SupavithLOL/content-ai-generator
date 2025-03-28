"use server"

import { db } from "../db";
import { SubscriptionStatus } from "@prisma/client";

export const getUserPlan = async (userId: string) => {
    const subscription = await db.subscription.findFirst({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      include: {
        plan: { 
            select: {
            id: true,
            name: true,
            description: true,
            billingCycle: true,
            },
        },
      }
    });
    const plan = subscription?.plan || null;

    return plan;
  };

    export const getPlanFeatures = async (userId: string) => {
    const subscription = await db.subscription.findFirst({
        where: {
          userId,
          status: SubscriptionStatus.ACTIVE
        },
        include: {
          plan: {
            select: {
              planFeatures: {
                select: {
                  id: true,
                  limitType: true,
                  limitValue: true,
                },
              },
            },
          },
        },
      });
      const planFeture = subscription?.plan.planFeatures || null;
      return planFeture;
  };