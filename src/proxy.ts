import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy (Next.js 16 convention, replaces middleware.ts)
 *
 * /admin renders its own LoginScreen client-side when no valid cookie exists.
 * No redirect needed here — the admin page handles auth itself.
 *
 * Protection layers:
 *  1. Admin page checks cookie via GET /api/admin/auth on mount → shows LoginScreen if unauthed
 *  2. All Supabase mutations are protected by RLS policies
 *  3. /api/admin/auth handles its own rate-limiting and auth
 */
export function proxy(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
