import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserByEmail } from "@/data/user";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userCredit = user.credit;

    return NextResponse.json({ credit: userCredit }, { status: 200 });
  } catch (error) {
    console.error("[CREDIT_API_ERROR]", error); // Log error ที่ Server สำหรับ Debugging
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" }, // เพิ่มรายละเอียด error (ถ้าเป็น Error object)
      { status: 500 }
    );
  }
}