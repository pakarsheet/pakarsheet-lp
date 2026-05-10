"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Eye, Search, Tag, ArrowRight, BookOpen } from "lucide-react";
import type { BlogPost } from "@/hooks/useBlog";
import { BLOG_CATEGORIES } from "@/hooks/useBlog";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    Tutorial: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Tips & Trik": "bg-green-500/10 text-green-400 border-green-500/20",
    "Use Case": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Update: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Lainnya: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide ${
        colors[category] ?? colors["Lainnya"]
      }`}
    >
      {category}
    </span>
  );
}

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[32px] border border-white/8 bg-white/[0.02] overflow-hidden hover:border-white/15 transition-all duration-300"
        >
          {post.coverImage && (
            <div className="relative w-full aspect-[21/9] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          )}
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <CategoryBadge category={post.category} />
              <span className="text-xs text-neutral-600">
                {formatDate(post.publishedAt)}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white/90 tracking-tight leading-[1.2] mb-3 group-hover:text-white transition-colors">
              {post.title}
            </h2>
            <p className="text-neutral-400 text-base leading-relaxed mb-6 max-w-2xl">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-5 text-xs text-neutral-600">
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> {post.readingTime} menit baca
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={12} /> {post.views.toLocaleString("id-ID")} views
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-white/40 group-hover:text-white/70 transition-colors font-medium">
                Baca selengkapnya <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </motion.article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full rounded-[24px] border border-white/8 bg-white/[0.02] overflow-hidden hover:border-white/15 transition-all duration-300 flex flex-col"
      >
        {post.coverImage ? (
          <div className="relative w-full aspect-[16/9] overflow-hidden flex-shrink-0">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full aspect-[16/9] bg-white/[0.03] flex items-center justify-center flex-shrink-0">
            <BookOpen size={32} className="text-neutral-700" />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge category={post.category} />
          </div>
          <h3 className="text-base font-semibold text-white/90 tracking-tight leading-[1.3] mb-2 group-hover:text-white transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 text-[11px] text-neutral-600">
            <span className="flex items-center gap-1">
              <Clock size={11} /> {post.readingTime} mnt
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} /> {post.views.toLocaleString("id-ID")}
            </span>
            <span className="ml-auto text-neutral-700">
              {formatDate(post.publishedAt)}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center mb-4">
        <BookOpen size={24} className="text-neutral-700" />
      </div>
      <p className="text-neutral-400 font-medium mb-1">
        {query ? `Tidak ada artikel untuk "${query}"` : "Belum ada artikel."}
      </p>
      <p className="text-neutral-600 text-sm">
        {query ? "Coba kata kunci lain." : "Artikel akan segera hadir."}
      </p>
    </div>
  );
}

export default function BlogListClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  // Sync query with ?q= URL param (used by article tag links)
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    queueMicrotask(() => setQuery(q));
  }, [searchParams]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    // Update URL without navigation so it's shareable
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("q", val); else params.delete("q");
    router.replace(`/blog?${params.toString()}`, { scroll: false });
  };

  const allCategories = ["Semua", ...BLOG_CATEGORIES];

  const filtered = useMemo(() => {
    return initialPosts.filter((p) => {
      const matchCat =
        activeCategory === "Semua" || p.category === activeCategory;
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [initialPosts, activeCategory, query]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  // Collect all unique tags from published posts
  const allTags = Array.from(
    new Set(initialPosts.flatMap((p) => p.tags))
  ).slice(0, 12);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">
            Blog
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-5 leading-[1.1]">
            Tips & tutorial <br className="hidden md:block" />
            produktivitas.
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Cara kerja lebih cepat dengan Google Sheets, Apps Script, dan otomasi bisnis.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeCategory === cat
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.03] text-neutral-400 border-white/8 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="grid">
            <EmptyState query={query} />
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <div className="mb-8">
                <PostCard post={featured} featured />
              </div>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Tags cloud */}
        {allTags.length > 0 && (
          <div className="border-t border-white/5 pt-10">
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Tag size={12} /> Topik populer
            </p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleQueryChange(tag)}
                  className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/8 text-xs text-neutral-500 hover:text-white hover:border-white/20 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
