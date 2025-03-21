import { NextResponse,NextRequest } from "next/server";
import { db } from "@/lib/db"; 
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

 const user = await db.user.findFirst({
    where: { id: token.id },
    select: { subscriptions: true },
 });

 const hasSubscription = (user?.subscriptions?.length || 0) > 0;

  return NextResponse.json({ hasSubscription });
}
