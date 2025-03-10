import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";


export async function GET() {
    try {
      const session = await getServerSession(authOptions);
  
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const userId = session.user.id;
      const creditHistory = await db.creditHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          amount: true,
          type: true,
          createdAt: true,
        },
      });
  
      return NextResponse.json({ history: creditHistory }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
  }