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
import { auth } from "@/lib/auth";

export default auth;

export const config = {
  // Match all routes except below ones
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)", "/"],
};
