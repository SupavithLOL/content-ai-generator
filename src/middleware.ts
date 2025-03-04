import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/user", "/admin"];

export async function middleware(req: NextRequest) {
    // const token = req.cookies.get("next-auth.session-token")?.value;
    const token = await getToken({ req });

    //เช็คว่าเมื่อเข้าอะไรก็ตามใน path /dashboard จะต้องมี token ถึงจะเข้าได้ 
    if (protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path)) && !token) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    
    return NextResponse.next(
    
);}

export const config = {
    matcher: "/:path*",
  };