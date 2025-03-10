import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from "@/lib/db";

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
          where: { status: { in: ["ACTIVE"] } },
          include: { plan: true }, 
        },
      },
    });
    let plan = null;

    if (user?.subscriptions && user.subscriptions.length > 0) {
      plan = user.subscriptions[0].plan;
    } else {
      plan = null;
    }

    return NextResponse.json({ plan: plan }, { status: 200 });
  } catch (error) {
    console.error("[API:plan-feature] - Error fetching plans:", error);
    return new NextResponse("Error fetching plans", { status: 500 });
  }
}
