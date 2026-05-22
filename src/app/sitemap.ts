import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getProductIds(): Promise<{ id: string; updatedAt?: number }[]> {
  const client = getClient();
  if (!client) return [];
  try {
    const { data } = await client
      .from("products")
      .select("id, createdAt")
      .order("createdAt", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

async function getBlogSlugs(): Promise<{ slug: string; updatedAt?: number }[]> {
  const client = getClient();
  if (!client) return [];
  try {
    const { data } = await client
      .from("blog_posts")
      .select("slug, updatedAt")
      .eq("status", "published")
      .order("publishedAt", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pakarsheet.com";
  const [products, blogPosts] = await Promise.all([getProductIds(), getBlogSlugs()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/kalkulator-margin`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/tools/kalkulator-hpp`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/tools/kalkulator-harga-jual`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/tools/kalkulator-roas`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/tools/kalkulator-diskon-bertingkat`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/tools/kalkulator-profit-marketplace`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/custom`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/academy`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/shop/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
