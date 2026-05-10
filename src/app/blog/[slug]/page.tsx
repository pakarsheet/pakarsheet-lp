import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { BlogPost } from "@/hooks/useBlog";
import ArticleClient from "./ArticleClient";

// ─── Data fetching ────────────────────────────────────────────────────────────

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const { data } = await client
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

async function getRelatedPosts(
  category: string,
  excludeId: string
): Promise<BlogPost[]> {
  const client = getClient();
  if (!client) return [];
  try {
    const { data } = await client
      .from("blog_posts")
      .select("id, slug, title, excerpt, coverImage, category, readingTime, views, publishedAt, tags, status, content, createdAt, updatedAt, relatedProductId")
      .eq("status", "published")
      .eq("category", category)
      .neq("id", excludeId)
      .order("publishedAt", { ascending: false })
      .limit(3);
    return data ?? [];
  } catch {
    return [];
  }
}

async function getRelatedProduct(productId: string) {
  const client = getClient();
  if (!client) return null;
  try {
    const { data } = await client
      .from("products")
      .select("id, name, description, price, originalPrice, images, lynkUrl, category")
      .eq("id", productId)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const client = getClient();
  if (!client) return [];
  try {
    const { data } = await client
      .from("blog_posts")
      .select("slug")
      .eq("status", "published");
    return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Artikel tidak ditemukan | Pakarsheet" };

  return {
    title: `${post.title} | Pakarsheet`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      url: `https://pakarsheet.com/blog/${post.slug}`,
      siteName: "Pakarsheet",
      locale: "id_ID",
      type: "article",
      publishedTime: new Date(post.publishedAt).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: {
      canonical: `https://pakarsheet.com/blog/${post.slug}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [relatedPosts, relatedProduct] = await Promise.all([
    getRelatedPosts(post.category, post.id),
    post.relatedProductId ? getRelatedProduct(post.relatedProductId) : null,
  ]);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || undefined,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      "@type": "Organization",
      name: "Pakarsheet",
      url: "https://pakarsheet.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Pakarsheet",
      url: "https://pakarsheet.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClient
        post={post}
        relatedPosts={relatedPosts}
        relatedProduct={relatedProduct}
      />
    </>
  );
}
