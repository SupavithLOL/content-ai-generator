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

    const payments = await db.payment.findMany({
      where: { userId: userId },
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

    return NextResponse.json({ payments: payments }, { status: 200 });

  } catch (error) {
    console.error("[API:payment] - Error fetching payment history:", error);
    return new NextResponse("Error fetching payment history", { status: 500 });
  }
}