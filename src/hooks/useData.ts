"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  lynkUrl: string;
  category: string;
  createdAt: number;
  clicks?: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
  createdAt: number;
};

export type Tutorial = {
  id: string;
  title: string;
  content: string; // Markdown
  videoUrl?: string;
  category: string;
  createdAt: number;
};

export type UserRequest = {
  id: string;
  email: string;
  request: string;
  status: 'pending' | 'reviewed' | 'completed';
  createdAt: number;
};

export type ShopFeature = {
  title: string;
  desc: string;
  icon: string; // icon name string, e.g. "Zap", "Clock"
};

export type ShopTrustBadge = {
  label: string;
  icon: string;
};

export type SiteSettings = {
  id: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  whatsappNumber: string;
  mainLynkUrl: string;
  // Shop page settings
  shopTitle?: string;
  shopSubtitle?: string;
  shopBadgeText?: string;
  shopCategories?: string[]; // e.g. ["Keuangan","Marketing",...]
  shopCtaText?: string;
  shopPaymentNote?: string;
  shopTrustBadges?: ShopTrustBadge[];
  shopFeatures?: ShopFeature[]; // default features for all products
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  readingTime: number;
  views: number;
  publishedAt: number;
  createdAt: number;
  updatedAt: number;
  relatedProductId?: string | null;
};

export function useData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    if (!supabase) {
      const stored = localStorage.getItem("pakarsheet_products");
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        // Fallback to empty or initial products if needed
        setProducts([]);
      }
      setIsLoading(false);
      return;
    }

    try {
      const [prodRes, testRes, tutRes, reqRes, setRes, blogRes] = await Promise.all([
        supabase.from('products').select('*').order('createdAt', { ascending: false }),
        supabase.from('testimonials').select('*').order('createdAt', { ascending: false }),
        supabase.from('tutorials').select('*').order('createdAt', { ascending: false }),
        supabase.from('user_requests').select('*').order('createdAt', { ascending: false }),
        supabase.from('site_settings').select('*').single(),
        supabase.from('blog_posts').select('*').order('createdAt', { ascending: false }),
      ]);

      setProducts(prodRes.data || []);
      setTestimonials(testRes.data || []);
      setTutorials(tutRes.data || []);
      setUserRequests(reqRes.data || []);
      setSettings(setRes.data || null);
      setBlogPosts(blogRes.data || []);
    } catch {
      // silently fail — data will be stale but app won't crash
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- CRUD Operations ---

  // Allowed tables — prevents arbitrary table injection from client code
  const ALLOWED_TABLES = ["products", "testimonials", "tutorials", "user_requests", "site_settings", "blog_posts", "custom_orders"] as const;
  type AllowedTable = typeof ALLOWED_TABLES[number];

  const saveToSupabase = async (table: string, data: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> => {
    if (!(ALLOWED_TABLES as readonly string[]).includes(table)) {
      return { ok: false, error: "Invalid table" };
    }
    if (!supabase) {
      if (table === "products") {
        const updated = products.some(p => p.id === data.id)
          ? products.map(p => p.id === data.id ? (data as unknown as Product) : p)
          : [(data as unknown as Product), ...products];
        setProducts(updated);
        localStorage.setItem("pakarsheet_products", JSON.stringify(updated));
      }
      return { ok: true };
    }
    const { error } = await supabase.from(table as AllowedTable).upsert([data]);
    if (error) {
      return { ok: false, error: error.message };
    }
    await fetchData();
    return { ok: true };
  };

  const deleteFromSupabase = async (table: string, id: string): Promise<{ ok: boolean; error?: string }> => {
    if (!(ALLOWED_TABLES as readonly string[]).includes(table)) {
      return { ok: false, error: "Invalid table" };
    }
    // Validate id is a non-empty string (no SQL injection via Supabase client, but good practice)
    if (!id || typeof id !== "string" || id.length > 128) {
      return { ok: false, error: "Invalid id" };
    }
    if (!supabase) {
      if (table === "products") {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        localStorage.setItem("pakarsheet_products", JSON.stringify(updated));
      }
      return { ok: true };
    }
    const { error } = await supabase.from(table as AllowedTable).delete().eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }
    await fetchData();
    return { ok: true };
  };

  return {
    products, testimonials, tutorials, userRequests, settings, blogPosts,
    isLoading, fetchData, saveToSupabase, deleteFromSupabase
  };
}
