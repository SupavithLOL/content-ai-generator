"use server"

import { db } from "../db";
import { cache } from 'react'

export const getUserPlan = cache(async (userId: string) => {
// export async function getUserPlan(userId: string) {
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
  });

    export const getPlanFeatures = cache(async (userId: string) => {
//   export async function getPlanFeatures(userId: string) {
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
  });