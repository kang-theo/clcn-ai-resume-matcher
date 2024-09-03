// Clear cache
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Apply no-store Cache-Control header to specific API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
}

// Add authentication
// import { auth } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";
// import type { NextApiRequest, NextApiResponse } from "next";

// export default function middleware(req: NextRequest, res: NextResponse) {
//   const { pathname } = req.nextUrl;

//   // Ignore the root page (home page) and static files like /_next
//   if (pathname === "/" || pathname.startsWith("/_next")) {
//     return NextResponse.next();
//   }

//   // if Apply NextAuth middleware to other routes
//   return auth(req as any);
// }

// export const config = {
//   // matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)", "/"],
// };
