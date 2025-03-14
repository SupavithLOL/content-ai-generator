import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define routes that require authentication
const protectedRoutes = ["/user", "/admin"];
// Define admin routes that require admin role
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
    // 1. Get the session token using next-auth/jwt
    const sessionToken = await getToken({ req: request });
    const pathname = request.nextUrl.pathname;

    // 2. Check for Admin Routes Authorization (Role-Based)
    if (adminRoutes.some((adminPath) => pathname.startsWith(adminPath))) {
        // Check if the user has admin role in the token
        if (sessionToken?.role !== "ADMIN") {
            // If not admin, redirect to unauthorized page with a message
            return NextResponse.redirect(new URL("/unauthorized?message=Admin privileges required", request.url));
        }
    }

    // 3. Check for Protected Routes Authentication (General Login)
    if (protectedRoutes.some((protectedPath) => pathname.startsWith(protectedPath))) {
        // Check if there is no session token (user is not logged in)
        if (!sessionToken) {
            // If not logged in, redirect to sign-in page, preserving the current path as callbackUrl
            const signInUrl = new URL("/sign-in", request.url);
            signInUrl.searchParams.append("callbackUrl", pathname); // Add callback URL to redirect back after sign-in
            return NextResponse.redirect(signInUrl);
        }
    }

    // 4. If none of the above conditions are met, allow request to proceed
    return NextResponse.next();
}

// Define the paths that the middleware should run for
export const config = {
    matcher: [
        /*
         * Match all pathnames EXCEPT for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_vercel (Vercel internals)
         * 4. all static files in /public
         * 5. /sign-in and /sign-up routes (and potentially /unauthorized) - to avoid redirect loops
         */
        "/((?!api|_next|_vercel|favicon.ico|sign-in|sign-up|unauthorized).*)",
    ],
};