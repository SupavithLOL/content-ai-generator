import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from "@/lib/db";
// import { PlanFeature } from "@prisma/client";

// export async function GET() {
//   const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//   try {
//     const userId = session.user.id;

//     const user = await db.user.findUnique({
//       where: { id: userId },
//       include: {
//         subscriptions: {
//           where: { status: { in: ["ACTIVE"] } },
//           include: { plan: true },
//         },
//       },
//     });

//     let plan = null;

//     if (user?.subscriptions && user.subscriptions.length > 0) {
//       plan = user.subscriptions[0].plan;
//     } else {
//       plan = null; 
//     }

//     let planFeature: PlanFeature[] = [];

//     if (plan) {
//       planFeature = await db.planFeature.findMany({
//         where: { planId: plan.id },
//       });
//     } else {
//       planFeature = [];
//     }

//     return NextResponse.json({ planFeature: planFeature }, { status: 200 });
//   } catch (error) {
//     console.error("[API:plan-feature] - Error fetching plans feature:", error);
//     return new NextResponse("Error fetching plans", { status: 500 });
//   }
// }

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userId = session.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: { status: "ACTIVE" },
          include: {
            plan: {
              include: { planFeatures: true }, // ดึง planFeature พร้อมกัน
            },
          },
        },
      },
    });

    const planFeature = user?.subscriptions?.[0]?.plan?.planFeatures || [];

    return NextResponse.json({ planFeature }, { status: 200 });
  } catch (error) {
    console.error("[API:plan-feature] - Error fetching plans feature:", error);
    return new NextResponse("Error fetching plans", { status: 500 });
  }
}
