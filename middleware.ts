import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Add paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/request-access",
  "/about",
  "/pricing",
  "/contact",
  "/api/auth/login",
  "/api/request-access",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get token from header
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check role-based access
    if (pathname.startsWith("/admin") && (decoded as any).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Configure paths that should be protected
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/dashboard/:path*",
  ],
};
