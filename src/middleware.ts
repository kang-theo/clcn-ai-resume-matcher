// Clear cache
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
const { NEXTAUTH_SECRET = "", NEXTAUTH_SALT = "authjs.session-token" } =
  process.env;

const protectedRoutes = [
  "/dashboard",
  "/applications",
  "/notifications",
  "/settings",
  "/admin",
];

// Check if the request is for a protected route
const isProtectedRoute = (currPath: string) =>
  protectedRoutes.some((route) => currPath.startsWith(route));

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore the root page (home page) and static files like /_next
  // if (
  //   pathname === "/home" ||
  //   pathname.startsWith("/auth") ||
  //   pathname.startsWith("/jobs") ||
  //   pathname.startsWith("/api/auth") ||
  //   pathname.startsWith("/api/jobs") ||
  //   pathname.startsWith("/api/register") ||
  //   pathname.startsWith("/_next")
  // ) {
  //   return NextResponse.next();
  // }

  if (isProtectedRoute(pathname)) {
    const token = await getToken({
      req,
      secret: NEXTAUTH_SECRET,
      salt: NEXTAUTH_SALT,
    });

    if (!token) {
      // If no token, redirect to login
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    const userRoles: string[] = token.roles as string[];

    // Determine the default page based on user role
    let defaultPage = "/dashboard"; // Default for regular users
    if (userRoles.includes("Admin") || userRoles.includes("HR")) {
      defaultPage = "/admin/dashboard";
      // Avoid redirect loops by checking if the current path is already the default page
      if (pathname !== defaultPage) {
        // return NextResponse.redirect(new URL(defaultPage, req.url));
        return NextResponse.next();
      }
    } else {
      // Avoid redirect loops by checking if the current path is already the default page
      // normal user can not access admin page
      if (pathname.startsWith("/admin")) {
        const referer =
          req.headers.get("referer") || new URL(defaultPage, req.url);
        return NextResponse.redirect(referer);
        //return NextResponse.redirect(new URL(defaultPage, req.url));
      } else {
        return NextResponse.next();
      }
    }
  }

  // Allow the request to proceed if no redirection is needed
  return NextResponse.next();

  // if (!token) {
  //   if (pathname.startsWith("/api/admin")) {
  //     return NextResponse.json(
  //       {
  //         meta: {
  //           code: "401",
  //           message: "Unauthorized",
  //         },
  //       },
  //       { status: 401 }
  //     );
  //   } else {
  //     return NextResponse.redirect(new URL("/auth/signin", req.url));
  //   }
  // }

  // const userRoles: string[] = token.roles as string[];

  // if (isProtectedRoute(req.nextUrl.pathname)) {
  //   // Check the user's role and redirect accordingly
  //   if (userRoles.includes("admin") || userRoles.includes("hr")) {
  //     return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  //   } else {
  //     // userRoles.include('user')
  //     return NextResponse.redirect(new URL("/dashboard", req.url));
  //   }
  // }

  // // Continue to the requested page
  // const response = NextResponse.next();

  // // Check if the response has a 403 status code
  // if (response.status === 403) {
  //   return NextResponse.redirect(new URL("/auth/signin", req.url));
  // }

  // return response;
}

export const config = {
  // matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|auth|terms|privacy).*)",
    "/admin/:path*",
    "/dashboard/:path*",
    "/applications/:path*",
    "/notifications/:path*",
    "/settings/:path*",
  ],
};
