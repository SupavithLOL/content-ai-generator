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

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: { status: "ACTIVE" },
        },
      },
    });
    
    const subscription = user?.subscriptions || null;


    return NextResponse.json({ subscription }, { status: 200 });

  } catch (error) {
    console.error("[API:subscription-status] - Error fetching subscription:", error);
    return new NextResponse("Error fetching subscription", { status: 500 });
  }
}