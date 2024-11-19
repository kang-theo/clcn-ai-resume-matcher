// Clear cache
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
const { NEXTAUTH_SECRET = "", NEXTAUTH_SALT = "authjs.session-token" } =
  process.env;

export default async function middleware(req: NextRequest) {
  // const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // Ignore the root page (home page) and static files like /_next
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/register") ||
    pathname.startsWith("/api/jobs") ||
    pathname === "/" ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: NEXTAUTH_SECRET,
    salt: NEXTAUTH_SALT,
  });

  // Option A: Apply NextAuth middleware to other routes
  // return auth(req as any);
  // Option B:

  console.log({ token });

  if (!token) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        {
          meta: {
            code: "401",
            message: "Unauthorized",
          },
        },
        { status: 401 }
      );
    } else {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // url.pathname = "/auth/signin"; // Adjust as needed
    // return NextResponse.redirect(url);
  }
  // Continue to the requested page
  const response = NextResponse.next();

  // Check if the response has a 403 status code
  if (response.status === 403) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return response;
}

export const config = {
  // matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|auth|terms|privacy).*)",
    "/admin/:path*",
  ],
};
