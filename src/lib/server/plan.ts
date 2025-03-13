"use server"

import { db } from "../db";

export async function getUserPlan(userId: string) {
    const subscription = await db.subscription.findFirst({
      where: { userId },
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
  }

  
  export async function getPlanFeatures(userId: string) {
    const subscription = await db.subscription.findFirst({
        where: {
          userId: userId,
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
  }