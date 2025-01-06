import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  // Public routes accessible to all users
  const isPublicRoute = req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register") ||
    req.nextUrl.pathname === "/"

  // Protected routes only accessible to authenticated users
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/settings")

  // Admin routes only accessible to admin users
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isAdmin = token?.role === "ADMIN"

  if (isPublicRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return NextResponse.next()
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}