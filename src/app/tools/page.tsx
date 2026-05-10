import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, TrendingUp, ShoppingCart, ArrowRight, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Tools Gratis untuk Bisnis | Pakarsheet",
  description:
    "Kalkulator bisnis gratis: margin keuntungan, HPP, ROAS iklan, harga jual marketplace. Langsung pakai, tanpa daftar.",
  openGraph: {
    title: "Tools Gratis untuk Bisnis | Pakarsheet",
    description: "Kalkulator bisnis gratis untuk UMKM dan marketer Indonesia.",
    url: "https://pakarsheet.com/tools",
    siteName: "Pakarsheet",
    locale: "id_ID",
    type: "website",
  },
};

const TOOLS = [
  {
    slug: "kalkulator-margin",
    icon: Calculator,
    title: "Kalkulator Margin Keuntungan",
    desc: "Hitung margin, profit per unit, dan break-even point bisnis kamu secara instan.",
    tags: ["UMKM", "Keuangan"],
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    slug: "kalkulator-hpp",
    icon: TrendingUp,
    title: "Kalkulator HPP",
    desc: "Hitung Harga Pokok Produksi dari bahan baku, tenaga kerja, dan overhead.",
    tags: ["Produksi", "Keuangan"],
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    slug: "kalkulator-harga-jual",
    icon: ShoppingCart,
    title: "Kalkulator Harga Jual Marketplace",
    desc: "Hitung harga jual minimum di Shopee, Tokopedia, dan TikTok Shop setelah fee platform.",
    tags: ["Marketplace", "Marketing"],
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    slug: "kalkulator-roas",
    icon: Zap,
    title: "Kalkulator ROAS Iklan",
    desc: "Hitung Return on Ad Spend, cost per acquisition, dan apakah iklan kamu profitable.",
    tags: ["Marketing", "Iklan"],
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">Tools Gratis</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-5 leading-[1.1]">
            Kalkulator bisnis, <br className="hidden md:block" />langsung pakai.
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Tidak perlu daftar. Tidak perlu install. Hasil instan untuk keputusan bisnis yang lebih cepat.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {TOOLS.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group block">
              <div className="h-full p-7 rounded-[28px] border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 ${tool.bg}`}>
                  <tool.icon size={18} className={tool.color} />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg font-semibold text-white/90 tracking-tight mb-2 group-hover:text-white transition-colors">
                  {tool.title}
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed mb-5">{tool.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/40 group-hover:text-white/70 transition-colors">
                  Coba sekarang <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-8 text-center">
          <p className="text-xs font-semibold text-neutral-600 uppercase tracking-widest mb-3">Mau yang otomatis?</p>
          <h3 className="text-xl font-semibold text-white/90 tracking-tight mb-3">
            Tracking semua ini secara otomatis setiap bulan.
          </h3>
          <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
            Kalkulator ini bagus untuk sekali hitung. Template Pakarsheet bisa tracking otomatis setiap hari.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-100 transition-colors"
          >
            Lihat Template <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
