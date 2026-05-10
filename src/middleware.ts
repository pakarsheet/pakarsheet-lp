import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware — server-side route protection.
 *
 * Adds a server-level redirect so unauthenticated users never receive
 * the admin HTML shell at all (previously only protected client-side).
 *
 * NOTE: All data mutations (products, testimonials, etc.) go directly
 * from the browser to Supabase using the anon key. Supabase Row Level
 * Security (RLS) policies are the primary data-layer protection.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect the admin page — redirect to home if no valid session cookie.
  // /api/admin/* routes handle their own auth internally.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const session = req.cookies.get("admin_session");
    if (session?.value !== "1") {
      const homeUrl = req.nextUrl.clone();
      homeUrl.pathname = "/";
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match /admin and all sub-paths, but NOT /api/admin (handled separately)
  matcher: ["/admin", "/admin/:path*"],
};
