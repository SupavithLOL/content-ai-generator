import { NextResponse  } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userId = session.user.id;
    const getUserBillingHistory = await db.billingHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    
    if (!getUserBillingHistory) {
      return NextResponse.json({ subscription: null }, { status: 200 });
    }


    return NextResponse.json({ billingHistory: getUserBillingHistory }, { status: 200 });

  } catch (error) {
    console.error("[API:subscription-status] - Error fetching billing history:", error);
    return new NextResponse("Error fetching subscription", { status: 500 });
  }
}