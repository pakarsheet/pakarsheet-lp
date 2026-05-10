import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Simple in-memory rate limiter — max 1 view increment per IP per article per 10 minutes
// Prevents trivial view count inflation without requiring auth
const seen = new Map<string, number>();

function isRateLimited(ip: string, slug: string): boolean {
  const key = `${ip}:${slug}`;
  const now = Date.now();
  const last = seen.get(key);
  if (last && now - last < 10 * 60 * 1000) return true;
  seen.set(key, now);
  // Prune old entries to prevent unbounded memory growth
  if (seen.size > 10_000) {
    const cutoff = now - 10 * 60 * 1000;
    for (const [k, ts] of seen) {
      if (ts < cutoff) seen.delete(k);
    }
  }
  return false;
}

// Validate slug — only allow safe URL characters
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]{1,200}$/.test(slug);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip, slug)) {
    // Return 200 silently — no need to tell the client it was rate limited
    return NextResponse.json({ ok: true });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ ok: false });

  try {
    const client = createClient(url, key);
    const { data } = await client
      .from("blog_posts")
      .select("id, views")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!data) return NextResponse.json({ ok: false });

    await client
      .from("blog_posts")
      .update({ views: (data.views ?? 0) + 1 })
      .eq("id", data.id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
