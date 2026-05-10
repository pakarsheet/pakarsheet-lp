import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminSession";

/**
 * Invalidates the cached `site_settings` used by the root layout's
 * `generateMetadata` so the admin can immediately see a new favicon/logo
 * reflected in the document head without waiting for the 1-hour TTL.
 *
 * Protected by the admin session cookie.
 */
export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_SESSION_COOKIE);
  if (!verifyAdminSessionToken(cookie?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Next.js 16's revalidateTag takes a second `profile` arg controlling how
  // long stale content can still be served. We want the change to propagate
  // promptly, so pass a short stale window.
  revalidateTag("site_settings", { expire: 1 });
  return NextResponse.json({ ok: true });
}
