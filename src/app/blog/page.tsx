import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import BlogListClient from "./BlogListClient";
import type { BlogPost } from "@/hooks/useBlog";

export const metadata: Metadata = {
  title: "Blog | Pakarsheet",
  description:
    "Tips, tutorial, dan use case seputar Google Sheets, otomasi Apps Script, dan produktivitas bisnis.",
  openGraph: {
    title: "Blog | Pakarsheet",
    description:
      "Tips, tutorial, dan use case seputar Google Sheets, otomasi Apps Script, dan produktivitas bisnis.",
    url: "https://pakarsheet.com/blog",
    siteName: "Pakarsheet",
    locale: "id_ID",
    type: "website",
  },
};

async function getPosts(): Promise<BlogPost[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const client = createClient(url, key);
    const { data } = await client
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("publishedAt", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <Suspense fallback={<div className="min-h-screen pt-28" />}>
      <BlogListClient initialPosts={posts} />
    </Suspense>
  );
}
