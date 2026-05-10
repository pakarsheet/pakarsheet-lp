"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import {
  Clock,
  Eye,
  ArrowLeft,
  ArrowRight,
  Share2,
  Copy,
  Check,
  ChevronRight,
  ShoppingCart,
  BookOpen,
} from "lucide-react";
import type { BlogPost } from "@/hooks/useBlog";

// ─── Types ────────────────────────────────────────────────────────────────────

type RelatedProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  lynkUrl: string;
  category: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Table of Contents ────────────────────────────────────────────────────────

type TocItem = { id: string; text: string; level: number };

function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const items: TocItem[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`]/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      items.push({ id, text, level });
    }
  }
  return items;
}

function TableOfContents({ items, activeId }: { items: TocItem[]; activeId: string }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Table of contents">
      <p className="text-[11px] font-semibold text-neutral-600 uppercase tracking-widest mb-3">
        Daftar isi
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? "0.75rem" : 0 }}>
            <a
              href={`#${item.id}`}
              className={`block text-xs py-1 leading-relaxed transition-colors ${
                activeId === item.id
                  ? "text-white font-medium"
                  : "text-neutral-600 hover:text-neutral-300"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Product CTA Card ─────────────────────────────────────────────────────────

function ProductCtaCard({ product }: { product: RelatedProduct }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mb-3">
        Template terkait
      </p>
      {product.images?.[0] && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <h4 className="text-sm font-semibold text-white/90 mb-1 tracking-tight">
        {product.name}
      </h4>
      <p className="text-xs text-neutral-500 leading-relaxed mb-4 line-clamp-2">
        {product.description}
      </p>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-lg font-bold text-white">
          Rp {product.price.toLocaleString("id-ID")}
        </span>
        {product.originalPrice && (
          <span className="text-xs text-neutral-600 line-through">
            Rp {product.originalPrice.toLocaleString("id-ID")}
          </span>
        )}
      </div>
      <a
        href={product.lynkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-white text-black text-xs font-bold py-3 rounded-xl hover:bg-neutral-100 transition-colors active:scale-95"
      >
        <ShoppingCart size={13} /> Dapatkan Template
      </a>
      <Link
        href={`/shop/${product.id}`}
        className="w-full flex items-center justify-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors mt-2 py-1"
      >
        Lihat detail <ArrowRight size={11} />
      </Link>
    </div>
  );
}

// ─── Related Post Card ────────────────────────────────────────────────────────

function RelatedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="rounded-[20px] border border-white/8 bg-white/[0.02] overflow-hidden hover:border-white/15 transition-all duration-300">
        {post.coverImage ? (
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full aspect-[16/9] bg-white/[0.03] flex items-center justify-center">
            <BookOpen size={24} className="text-neutral-700" />
          </div>
        )}
        <div className="p-5">
          <CategoryBadge category={post.category} />
          <h4 className="text-sm font-semibold text-white/90 mt-2 mb-1 leading-snug group-hover:text-white transition-colors line-clamp-2">
            {post.title}
          </h4>
          <div className="flex items-center gap-3 text-[11px] text-neutral-600 mt-3">
            <span className="flex items-center gap-1">
              <Clock size={10} /> {post.readingTime} mnt
            </span>
            <span className="flex items-center gap-1">
              <Eye size={10} /> {post.views.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Share Button ─────────────────────────────────────────────────────────────

function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://pakarsheet.com/blog/${slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWa = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
      "_blank"
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-600 flex items-center gap-1.5">
        <Share2 size={12} /> Bagikan:
      </span>
      <button
        onClick={shareWa}
        className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors"
      >
        WhatsApp
      </button>
      <button
        onClick={copyLink}
        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-400 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1.5"
      >
        {copied ? <><Check size={11} /> Tersalin</> : <><Copy size={11} /> Salin link</>}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ArticleClient({
  post,
  relatedPosts,
  relatedProduct,
}: {
  post: BlogPost;
  relatedPosts: BlogPost[];
  relatedProduct: RelatedProduct | null;
}) {
  const [activeId, setActiveId] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const tocItems = extractToc(post.content);

  // Reading progress bar — track window scroll, not article ref
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Track active heading for TOC highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );
    const headings = contentRef.current?.querySelectorAll("h2, h3") ?? [];
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  // Increment view count once on mount
  useEffect(() => {
    fetch(`/api/blog/${post.slug}`, { method: "POST" }).catch(() => {});
  }, [post.slug]);

  return (
    <>
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-white/60 origin-left z-[100]"
        style={{ scaleX }}
      />

      <div className="min-h-screen pt-24 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-neutral-600 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={12} />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span className="text-neutral-500 truncate max-w-[200px]">{post.title}</span>
          </nav>

          <div className="flex gap-10 items-start">
            {/* ── Main content ── */}
            <article className="flex-1 min-w-0" ref={contentRef}>
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <CategoryBadge category={post.category} />
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[11px] text-neutral-600">
                      #{tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white/90 tracking-tight leading-[1.15] mb-5">
                  {post.title}
                </h1>
                <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-5 text-xs text-neutral-600 pb-6 border-b border-white/5">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} /> {post.readingTime} menit baca
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye size={12} /> {post.views.toLocaleString("id-ID")} views
                  </span>
                </div>
              </header>

              {/* Cover image */}
              {post.coverImage && (
                <div className="relative w-full aspect-[21/9] rounded-[24px] overflow-hidden mb-10 border border-white/8">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
              )}

              {/* Markdown content */}
              <div className="prose prose-invert prose-neutral max-w-none
                prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white/90
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-neutral-400 prose-p:leading-relaxed prose-p:text-base
                prose-a:text-white prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-neutral-300
                prose-strong:text-white/90 prose-strong:font-semibold
                prose-code:text-green-400 prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/8 prose-pre:rounded-2xl prose-pre:p-5
                prose-blockquote:border-l-white/20 prose-blockquote:text-neutral-400 prose-blockquote:not-italic
                prose-ul:text-neutral-400 prose-ol:text-neutral-400
                prose-li:marker:text-neutral-600
                prose-hr:border-white/8
                prose-img:rounded-2xl prose-img:border prose-img:border-white/8
                prose-table:text-sm prose-th:text-white/70 prose-td:text-neutral-400 prose-th:border-white/10 prose-td:border-white/8">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSlug, rehypeHighlight]}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/5">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/8 text-xs text-neutral-500 hover:text-white hover:border-white/20 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <ShareButton title={post.title} slug={post.slug} />
              </div>

              {/* Back to blog */}
              <div className="mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} /> Kembali ke Blog
                </Link>
              </div>

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <section className="mt-16 pt-10 border-t border-white/5">
                  <h2 className="text-lg font-semibold text-white/90 tracking-tight mb-6">
                    Artikel terkait
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {relatedPosts.map((p) => (
                      <RelatedPostCard key={p.id} post={p} />
                    ))}
                  </div>
                </section>
              )}

              {/* Bottom CTA banner */}
              <div className="mt-14 rounded-[28px] border border-white/10 bg-white/[0.02] p-8 text-center">
                <p className="text-xs font-semibold text-neutral-600 uppercase tracking-widest mb-3">
                  Siap otomasi?
                </p>
                <h3 className="text-2xl font-semibold text-white/90 tracking-tight mb-3">
                  Coba template Pakarsheet sekarang.
                </h3>
                <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
                  Sekali bayar, pakai selamanya. Tidak perlu coding, tidak perlu setup ribet.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-100 transition-colors active:scale-95"
                >
                  Lihat semua template <ArrowRight size={15} />
                </Link>
              </div>
            </article>

            {/* ── Sticky Sidebar ── */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 space-y-6">
                {/* TOC */}
                {tocItems.length > 0 && (
                  <div className="rounded-[20px] border border-white/8 bg-white/[0.02] p-5">
                    <TableOfContents items={tocItems} activeId={activeId} />
                  </div>
                )}

                {/* Related product CTA */}
                {relatedProduct && (
                  <ProductCtaCard product={relatedProduct} />
                )}

                {/* Generic CTA if no related product */}
                {!relatedProduct && (
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.02] p-5 text-center">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                      <ShoppingCart size={18} className="text-neutral-500" />
                    </div>
                    <p className="text-sm font-semibold text-white/80 mb-1 tracking-tight">
                      Coba template kami
                    </p>
                    <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                      Otomasi Google Sheets mulai dari Rp 99rb.
                    </p>
                    <Link
                      href="/shop"
                      className="w-full flex items-center justify-center gap-1.5 bg-white text-black text-xs font-bold py-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      Lihat Template <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
