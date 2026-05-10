"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  coverImage: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  readingTime: number; // minutes
  views: number;
  publishedAt: number;
  createdAt: number;
  updatedAt: number;
  relatedProductId?: string | null;
};

export const BLOG_CATEGORIES = [
  "Tutorial",
  "Tips & Trik",
  "Use Case",
  "Update",
  "Lainnya",
] as const;

/** Estimate reading time from markdown content (~200 wpm) */
export function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Generate a URL-safe slug from a title */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .order("createdAt", { ascending: false });
      setPosts(data ?? []);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const savePost = async (
    post: Omit<BlogPost, "views" | "createdAt" | "updatedAt"> & {
      id?: string;
      views?: number;
      createdAt?: number;
    }
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!supabase) return { ok: false, error: "Supabase not configured" };
    const now = Date.now();
    const data: BlogPost = {
      views: 0,
      ...post,
      id: post.id || crypto.randomUUID(),
      createdAt: post.createdAt || now,
      updatedAt: now,
      readingTime: calcReadingTime(post.content),
    };
    const { error } = await supabase.from("blog_posts").upsert([data]);
    if (error) return { ok: false, error: error.message };
    await fetchPosts();
    return { ok: true };
  };

  const deletePost = async (id: string): Promise<{ ok: boolean; error?: string }> => {
    if (!supabase) return { ok: false, error: "Supabase not configured" };
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    await fetchPosts();
    return { ok: true };
  };

  const incrementViews = async (id: string, currentViews: number) => {
    if (!supabase) return;
    await supabase
      .from("blog_posts")
      .update({ views: currentViews + 1 })
      .eq("id", id);
  };

  return { posts, isLoading, fetchPosts, savePost, deletePost, incrementViews };
}
