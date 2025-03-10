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
    const getUserSubscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id as string,
      },
    });
    
    if (!getUserSubscription) {
      return NextResponse.json({ subscription: null }, { status: 200 });
    }


    return NextResponse.json({ subscription: getUserSubscription }, { status: 200 });

  } catch (error) {
    console.error("[API:subscription-status] - Error fetching subscription:", error);
    return new NextResponse("Error fetching subscription", { status: 500 });
  }
}