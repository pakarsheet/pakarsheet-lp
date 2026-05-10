"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Calculator, TrendingUp, ShoppingCart, Zap, ArrowRight, Wallet, Megaphone, Store, Factory,
  BadgePercent, CircleDollarSign,
  type LucideIcon,
} from "lucide-react";

type Category = "Semua" | "Keuangan" | "Marketing" | "Marketplace" | "Produksi";

type Tool = {
  slug: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  category: Category;
  tags: string[];
  color: string;
  bg: string;
};

const TOOLS: Tool[] = [
  {
    slug: "kalkulator-margin",
    icon: Calculator,
    title: "Kalkulator Margin Keuntungan",
    desc: "Hitung margin, profit per unit, dan break-even point bisnis kamu secara instan.",
    category: "Keuangan",
    tags: ["UMKM", "Keuangan"],
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    slug: "kalkulator-hpp",
    icon: TrendingUp,
    title: "Kalkulator HPP",
    desc: "Hitung Harga Pokok Produksi dari bahan baku, tenaga kerja, dan overhead.",
    category: "Produksi",
    tags: ["Produksi", "Keuangan"],
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    slug: "kalkulator-harga-jual",
    icon: ShoppingCart,
    title: "Kalkulator Harga Jual Marketplace",
    desc: "Hitung harga jual minimum di Shopee, Tokopedia, dan TikTok Shop setelah fee platform.",
    category: "Marketplace",
    tags: ["Marketplace", "Marketing"],
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    slug: "kalkulator-roas",
    icon: Zap,
    title: "Kalkulator ROAS Iklan",
    desc: "Hitung Return on Ad Spend, cost per acquisition, dan apakah iklan kamu profitable.",
    category: "Marketing",
    tags: ["Marketing", "Iklan"],
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    slug: "kalkulator-diskon-bertingkat",
    icon: BadgePercent,
    title: "Kalkulator Diskon Bertingkat",
    desc: "Hitung harga akhir setelah diskon 20% + 10%, voucher, cashback, ongkir, dan biaya layanan.",
    category: "Marketplace",
    tags: ["Marketplace", "Promo"],
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
  },
  {
    slug: "kalkulator-profit-marketplace",
    icon: CircleDollarSign,
    title: "Kalkulator Profit Marketplace",
    desc: "Hitung profit bersih setelah HPP, fee platform, voucher seller, subsidi ongkir, packaging, dan iklan.",
    category: "Marketplace",
    tags: ["Marketplace", "Profit"],
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const CATEGORIES: { id: Category; icon: LucideIcon | null }[] = [
  { id: "Semua",       icon: null },
  { id: "Keuangan",    icon: Wallet },
  { id: "Marketing",   icon: Megaphone },
  { id: "Marketplace", icon: Store },
  { id: "Produksi",    icon: Factory },
];

export default function ToolsClient() {
  const [active, setActive] = useState<Category>("Semua");

  const filtered = useMemo(
    () => (active === "Semua" ? TOOLS : TOOLS.filter((t) => t.category === active)),
    [active]
  );

  // Count per category (for badge)
  const counts = useMemo(() => {
    const c: Record<string, number> = { Semua: TOOLS.length };
    for (const t of TOOLS) c[t.category] = (c[t.category] || 0) + 1;
    return c;
  }, []);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-3 sm:mb-4">Tools Gratis</p>
          <h1 className="text-[32px] sm:text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-4 sm:mb-5 leading-[1.1]">
            Kalkulator bisnis, <br className="hidden md:block" />langsung pakai.
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Tidak perlu daftar. Tidak perlu install. Hasil instan untuk keputusan bisnis yang lebih cepat.
          </p>
        </div>

        {/* Category filter — horizontal scroll on mobile */}
        <div
          className="flex items-center gap-2 mb-6 sm:mb-8 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
          role="tablist"
          aria-label="Filter kategori tools"
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                role="tab"
                aria-selected={isActive}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
                  isActive
                    ? "bg-white text-black shadow-lg"
                    : "bg-white/[0.03] text-neutral-400 border border-white/8 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {Icon && <Icon size={14} className={isActive ? "" : "opacity-70"} />}
                <span>{cat.id}</span>
                <span className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded-md ${isActive ? "bg-black/10 text-black/70" : "bg-white/5 text-neutral-500"}`}>
                  {counts[cat.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tools Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            Tidak ada tool di kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-10 sm:mb-16">
            {filtered.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group block">
                <div className="h-full p-5 sm:p-7 rounded-[24px] sm:rounded-[28px] border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 active:scale-[0.99]">
                  <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${tool.bg}`}>
                      <tool.icon size={18} className={tool.color} />
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider flex-shrink-0 mt-1">
                      {tool.category}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-white/90 tracking-tight mb-2 group-hover:text-white transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4 sm:mb-5">{tool.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/40 group-hover:text-white/70 transition-colors">
                    Coba sekarang <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="rounded-[24px] sm:rounded-[28px] border border-white/8 bg-white/[0.02] p-6 sm:p-8 text-center">
          <p className="text-xs font-semibold text-neutral-600 uppercase tracking-widest mb-3">Mau yang otomatis?</p>
          <h3 className="text-lg sm:text-xl font-semibold text-white/90 tracking-tight mb-3">
            Tracking semua ini secara otomatis setiap bulan.
          </h3>
          <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Kalkulator ini bagus untuk sekali hitung. Template Pakarsheet bisa tracking otomatis setiap hari.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-100 transition-colors active:scale-95"
          >
            Lihat Template <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
