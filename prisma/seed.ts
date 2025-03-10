
import { db } from "@/lib/db";
import { LimitType } from "@prisma/client";

async function seed() {

  const Starter = await db.plan.create({
    data: {
      name: "Starter",
      description: "สำหรับผู้เริ่มต้น",
      price: 100,
      billingCycle: "MONTHLY",
      stripePriceId: "price_1Qz7UGE14GZrP2iu6b9gVCnt",
    },
  });

  const Pro = await db.plan.create({
    data: {
      name: "Pro",
      description: "สำหรับทีมขนาดเล็ก",
      price: 200,
      billingCycle: "MONTHLY",
      stripePriceId: "price_1QzBHmE14GZrP2iu4VWXIVTs",
    },
  });

  const Enterprise = await db.plan.create({
    data: {
      name: "Enterprise",
      description: "สำหรับทีมขนาดใหญ่",
      price: 300,
      billingCycle: "MONTHLY",
      stripePriceId: "price_1QzBIAE14GZrP2iurG4MAM4e",
    },
  });

  await db.planFeature.createMany({
    data: [
      {
        planId: Starter.id,
        limitType: LimitType.CREDIT_LIMIT,
        limitValue: "3000",
        description: "Credit per month",
      },
      {
        planId: Starter.id,
        limitType: LimitType.PROJECTS,
        limitValue: "2",
        description: "Project per month",
      },
      {
        planId: Starter.id,
        limitType: LimitType.KEYWORDS,
        limitValue: "20",
        description: "Keywords per month",
      },
    ],
  });

  await db.planFeature.createMany({
    data: [
        {
            planId: Pro.id,
            limitType: LimitType.CREDIT_LIMIT,
            limitValue: "5000",
            description: "Credit per month",
          },
          {
            planId: Pro.id,
            limitType: LimitType.PROJECTS,
            limitValue: "10",
            description: "Project per month",
          },
          {
            planId: Pro.id,
            limitType: LimitType.KEYWORDS,
            limitValue: "50",
            description: "Keywords per month",
          },
    ],
  });

  await db.planFeature.createMany({
    data: [
        {
            planId: Enterprise.id,
            limitType: LimitType.CREDIT_LIMIT,
            limitValue: "8000",
            description: "Credit per month",
          },
          {
            planId: Enterprise.id,
            limitType: LimitType.PROJECTS,
            limitValue: "unlimited",
            description: "Project per month",
          },
          {
            planId: Enterprise.id,
            limitType: LimitType.KEYWORDS,
            limitValue: "unlimited",
            description: "Keywords per month",
          },
    ],
  });

}
