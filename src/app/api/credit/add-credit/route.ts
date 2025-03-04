import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, type } = await req.json();
    console.log("Received data:", { amount, type });
    const user = await getUserByEmail(session.user.email);
    const userId = user?.id;

    if (!amount && amount !== 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const [_, newCreditHistoryEntry] = await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { credit: { increment: amount } },
      }),
      db.creditHistory.create({
        data: {
          userId,
          amount: +amount,
          type,
        },
      }),
    ]);

    console.log("Credit added successfully");

    return NextResponse.json({ message: "Credit added successfully", newHistory: newCreditHistoryEntry });
  } catch (error) {
    console.error("Use Credit Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
