// Clear cache
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
const { NEXTAUTH_SECRET = "", NEXTAUTH_SALT = "authjs.session-token" } =
  process.env;
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  apiAuthRegister,
  authRoutes,
  publicRoutes,
  DEFAULT_ADMIN_URL,
} from "@/lib/routes";

// const protectedRoutes = [
//   "/dashboard",
//   "/applications",
//   "/notifications",
//   "/settings",
//   "/admin",
// ];

// Check if the request is for a protected route
// const isProtectedRoute = (currPath: string) =>
//   protectedRoutes.some((route) => currPath.startsWith(route));

// Add this helper function at the top level
const matchesPattern = (pathname: string, pattern: string) => {
  // Convert route pattern to regex
  // :id will match any segment except /
  const regexPattern = pattern.replace(/:id/g, "[^/]+");
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(pathname);
};

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  const isApiAuthRoute =
    pathname.startsWith(apiAuthPrefix) || pathname === apiAuthRegister;
  // const isPublicRoute = publicRoutes.includes(pathname) || publicRoutes;
  // Update the public route check
  const isPublicRoute = publicRoutes.some((route) =>
    route.includes(":id") ? matchesPattern(pathname, route) : pathname === route
  );
  const isAuthRoute = authRoutes.includes(pathname);

  if (isApiAuthRoute) {
    return null;
  }

  const token = await getToken({
    req,
    secret: NEXTAUTH_SECRET,
    salt: NEXTAUTH_SALT,
  });

  // user access auth route directly, and application could redirect to dashboard or admin
  if (isAuthRoute) {
    // logged in
    if (token) {
      const userRoles: string[] = token.roles as string[];
      if (userRoles.includes("Admin") || userRoles.includes("HR")) {
        return Response.redirect(new URL(DEFAULT_ADMIN_URL, nextUrl));
      } else {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
    }

    return null;
  }

  // logged out and access not a public route
  // redirect to sign in page
  if (!token && !isPublicRoute) {
    let callbackUrl = pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // Only redirect if we're on the root path '/'
  // /admin/dashboard and /dashboard also re-redirect
  if (
    token &&
    (pathname.startsWith("/admin") || pathname.startsWith("/api/admin"))
  ) {
    const userRoles: string[] = token?.roles as string[];
    if (userRoles?.includes("Admin") || userRoles?.includes("HR")) {
      return null;
    } else {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }

  return null;
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
