import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";


const protectedRoutes = ["/user", "/admin"];
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
    const sessionToken = await getToken({ req: request });

    const pathname = request.nextUrl.pathname;
    if (adminRoutes.some((adminPath) => pathname.startsWith(adminPath))) {
        if (sessionToken?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized?message=Admin privileges required", request.url));
        }
    }

    if (pathname.startsWith('/user')) {
        const userId = sessionToken?.id as string | undefined;
        if (!userId) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
          }
      
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/subscription`, {
                headers: { cookie: request.headers.get("cookie") || "" },
            });
    
            const data = await response.json();
            if (!data.hasSubscription) {
              return NextResponse.redirect(new URL('/pricing', request.url));
            }
          } catch (error) {
            console.error("Error checking subscription   in middleware:", error);
            return NextResponse.redirect(new URL('/error?message=SubscriptionCheckFailed', request.url));
          }
        }
        

    if (protectedRoutes.some((protectedPath) => pathname.startsWith(protectedPath))) {
        if (!sessionToken) {
            const signInUrl = new URL("/sign-in", request.url);
            signInUrl.searchParams.append("callbackUrl", pathname);
            return NextResponse.redirect(signInUrl);
        }
    }


    return NextResponse.next();
}


export const config = {
    matcher: [
        '/user/:path*',
        "/((?!api|_next|_vercel|favicon.ico|sign-in|sign-up|unauthorized).*)",
        
    ],
};