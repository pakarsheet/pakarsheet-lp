"use client";

import { useProducts } from "@/hooks/useProducts";
import { useSettings } from "@/hooks/useSettings";
import { motion } from "framer-motion";
import {
  ArrowLeft, Zap, ChevronRight, ArrowRight, ChevronLeft,
  LucideIcon, CheckCircle2, Sparkles, Lock,
  BadgeCheck, Download, ShieldCheck, MessageCircle,
  Star, Truck, Globe,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, use, useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { PriceTimer } from "@/components/PriceTimer";
import { SocialProofBadge } from "@/components/SocialProofBadge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ── Defaults ───────────────────────────────────────────────────────────────────
const DEFAULT_FEATURES = [
  { title: "Otomatisasi Apps Script", desc: "Skrip otomatis memproses data dalam hitungan detik tanpa perlu coding.", icon: "Zap" },
  { title: "UI/UX Dashboard Clean", desc: "Tampilan dashboard profesional yang mudah dibaca dan digunakan.", icon: "LayoutDashboard" },
  { title: "Lifetime Free Update", desc: "Beli sekali, update fitur selamanya tanpa biaya tambahan.", icon: "Clock" },
  { title: "Cloud Sync & Backup", desc: "Data tersimpan aman di Google Drive, akses dari mana saja.", icon: "Globe" },
  { title: "Mudah Dikustomisasi", desc: "Sesuaikan dengan kebutuhan bisnis kamu tanpa merusak rumus.", icon: "Edit3" },
  { title: "Support Konsultasi", desc: "Bingung cara pakai? Tim kami siap bantu via WhatsApp.", icon: "MessageSquare" },
];

const DEFAULT_TRUST_BADGES = [
  { label: "Premium Quality", icon: "Star" },
  { label: "Lifetime Update", icon: "Clock" },
  { label: "Cloud Sync", icon: "Globe" },
];

const DEFAULT_CTA_TEXT = "Beli Sekarang";
const DEFAULT_PAYMENT_NOTE = "🔒 Pembayaran aman via Lynk.id";

// ── Helpers ────────────────────────────────────────────────────────────────────
function resolveIcon(name: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] ?? Zap;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Marketing:  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  Keuangan:   { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",    dot: "bg-blue-400" },
  Inventory:  { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",   dot: "bg-amber-400" },
  "HR & Admin": { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20",  dot: "bg-violet-400" },
  Lainnya:    { bg: "bg-neutral-500/10", text: "text-neutral-400", border: "border-neutral-500/20", dot: "bg-neutral-400" },
};
const DEFAULT_CAT_STYLE = { bg: "bg-white/[0.06]", text: "text-white/50", border: "border-white/10", dot: "bg-white/40" };

const FEATURE_STYLES = [
  { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20" },
  { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20" },
  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20" },
  { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20" },
  { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20" },
];

function shortPreview(text: string, maxChars = 200): string {
  const plain = text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
  if (plain.length <= maxChars) return plain;
  return plain.slice(0, maxChars).replace(/\s\S+$/, "") + "…";
}

function isMarkdown(text: string): boolean {
  return /#{1,6}\s|^\s*[-*+]\s|\*\*|\[.+\]\(.+\)|```/m.test(text);
}

// ── Thumbnail strip ────────────────────────────────────────────────────────────
function ThumbnailStrip({
  images, activeIdx, onSelect,
}: {
  images: string[];
  activeIdx: number;
  onSelect: (i: number) => void;
}) {
  if (images.length <= 1) return null;
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar">
      {images.map((img, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200 ring-2 ${
            i === activeIdx
              ? "ring-white/40 opacity-100 scale-105"
              : "ring-white/[0.06] opacity-40 hover:opacity-70 hover:ring-white/20"
          }`}
        >
          <Image src={img} alt="" fill className="object-cover" unoptimized />
        </button>
      ))}
    </div>
  );
}

// ── Star rating display ────────────────────────────────────────────────────────
function StarRating({ rating = 4.8, count }: { rating?: number; count?: number | null }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < full ? "text-amber-400 fill-amber-400" : half && i === full ? "text-amber-400 fill-amber-400/50" : "text-neutral-700 fill-neutral-700"}
          />
        ))}
      </div>
      <span className="text-[11px] font-bold text-amber-400 tabular-nums">{rating.toFixed(1)}</span>
      {count != null && count > 0 && (
        <span className="text-[11px] text-neutral-600 font-medium tracking-widest uppercase">
          · Highly Rated
        </span>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { products, isLoading, trackClick } = useProducts();
  const { settings, waUrl } = useSettings();
  const [activeImg, setActiveImg] = useState(0);
  const swiperRef = useRef<{ slideTo: (i: number) => void } | null>(null);
  const product = useMemo(
    () => products.find((p) => p.id === id) ?? null,
    [id, products]
  );

  useEffect(() => {
    if (!isLoading && products.length > 0 && !product) router.push("/shop");
  }, [product, products.length, isLoading, router]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-white/[0.08] border-t-white/40 animate-spin" />
      </div>
    );
  }

  const prod = product;

  const productImages: string[] = (
    prod.images?.length > 0 ? prod.images : prod.image ? [prod.image] : []
  ).filter(Boolean);
  if (productImages.length === 0) {
    productImages.push("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60");
  }

  const features =
    (prod.features && prod.features.length > 0) ? prod.features
    : (settings?.shopFeatures && settings.shopFeatures.length > 0) ? settings.shopFeatures
    : DEFAULT_FEATURES;

  const trustBadges =
    (settings?.shopTrustBadges && settings.shopTrustBadges.length > 0)
      ? settings.shopTrustBadges : DEFAULT_TRUST_BADGES;

  const ctaText     = settings?.shopCtaText     || DEFAULT_CTA_TEXT;
  const paymentNote = settings?.shopPaymentNote || DEFAULT_PAYMENT_NOTE;
  const buyUrl      = prod.lynkUrl || settings?.mainLynkUrl || "https://lynk.id/pakarsheet";
  const whatsappUrl = waUrl;

  const hasLongDesc = isMarkdown(prod.description) || prod.description.length > 200;
  const sidebarDesc = hasLongDesc ? shortPreview(prod.description) : prod.description;

  const hasSale      = prod.salePrice != null && prod.salePrice < prod.price;
  const displayPrice = hasSale ? prod.salePrice! : prod.price;
  const discount     = hasSale ? Math.round(((prod.price - prod.salePrice!) / prod.price) * 100) : 0;

  const catStyle = CATEGORY_STYLES[prod.category ?? ""] ?? DEFAULT_CAT_STYLE;
  const buyerCount = prod.socialProofCount != null
    ? prod.socialProofCount
    : prod.clicks > 0 ? Math.max(1, Math.floor(prod.clicks * 0.15)) : null;

  return (
    <div className="min-h-screen bg-[#030303] text-white">

      {/* ── Topbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-12 bg-[#030303]/90 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="container mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors group text-[13px]"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">Kembali</span>
          </Link>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/[0.07] border border-emerald-500/[0.15]">
            <BadgeCheck size={10} className="text-emerald-400" />
            <span className="text-[10px] font-semibold text-emerald-400/70 tracking-wide uppercase hidden sm:block">
              Official Product
            </span>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════
          HERO — full-width gallery + sticky panel
      ════════════════════════════════════════════════════════ */}
      <section className="pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] min-h-[calc(100vh-48px)]">

          {/* ── LEFT: Immersive Gallery ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-[#080808] lg:border-r border-white/[0.05] flex flex-col"
          >
            {/* Official badge overlay */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
              <BadgeCheck size={11} className="text-emerald-400" />
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Official Product</span>
            </div>

            {/* Main swiper — fills available height */}
            <div className="relative flex-1 min-h-[320px] lg:min-h-0 group">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={{ prevEl: ".swiper-prev", nextEl: ".swiper-next" }}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                onSwiper={(s) => { swiperRef.current = s; }}
                onSlideChange={(s) => setActiveImg(s.activeIndex)}
                className="w-full h-full absolute inset-0"
              >
                {productImages.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`${prod.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                        unoptimized
                      />
                      {/* Subtle vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-transparent to-transparent" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Prev / Next */}
              {productImages.length > 1 && (
                <>
                  <button className="swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black">
                    <ChevronLeft size={18} />
                  </button>
                  <button className="swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black">
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-[11px] font-medium text-white/60 tabular-nums">
                    {activeImg + 1} / {productImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip + category info bar */}
            <div className="p-4 lg:p-6 border-t border-white/[0.05] bg-[#080808] space-y-4">
              <ThumbnailStrip
                images={productImages}
                activeIdx={activeImg}
                onSelect={(i) => { swiperRef.current?.slideTo(i); setActiveImg(i); }}
              />
              {/* Trust badges row */}
              <div className="flex flex-wrap gap-2">
                {trustBadges.map(({ icon, label }) => {
                  const Icon = resolveIcon(icon);
                  return (
                    <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-neutral-500 font-medium">
                      <Icon size={11} className="text-white/30" />
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Purchase Panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-12 lg:h-[calc(100vh-48px)] overflow-y-auto custom-scrollbar bg-[#030303]"
          >
            <div className="p-6 lg:p-8 space-y-6">

              {/* ── Category + Rating ── */}
              <div className="space-y-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest ${catStyle.bg} ${catStyle.border} ${catStyle.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                  {prod.category || "Template"}
                </div>
                <StarRating rating={4.8} count={buyerCount} />
              </div>

              {/* ── Product name + desc ── */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1] text-white">
                  {prod.name}
                </h1>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {sidebarDesc}
                  {hasLongDesc && (
                    <a
                      href="#deskripsi"
                      className="text-white/35 hover:text-white/60 transition-colors ml-1 text-xs underline underline-offset-2 decoration-white/20"
                    >
                      selengkapnya ↓
                    </a>
                  )}
                </p>
              </div>

              {/* ── Social proof compact ── */}
              <SocialProofBadge clicks={prod.clicks} socialProofCount={prod.socialProofCount} compact />

              {/* ── Divider ── */}
              <div className="border-t border-white/[0.05]" />

              {/* ── Price block ── */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-[0.18em]">Harga</p>

                <PriceTimer
                  productId={prod.id}
                  price={prod.price}
                  salePrice={prod.salePrice}
                  salePriceUntil={prod.salePriceUntil}
                />

                {/* Hemat badge — shown when sale active */}
                {hasSale && (
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] font-bold text-rose-400 uppercase tracking-wide">
                      Hemat {discount}%
                    </span>
                    <span className="text-[11px] text-neutral-600 font-medium uppercase tracking-widest">
                      Sekali Bayar · Tanpa Langganan
                    </span>
                  </div>
                )}
                {!hasSale && (
                  <p className="text-[11px] text-neutral-600 font-medium uppercase tracking-widest">
                    Sekali Bayar · Tanpa Langganan
                  </p>
                )}
                {!prod.salePrice && prod.originalPrice && prod.originalPrice > prod.price && (
                  <span className="text-neutral-600 line-through text-sm block">
                    Rp {prod.originalPrice.toLocaleString("id-ID")}
                  </span>
                )}
              </div>

              {/* ── CTA ── */}
              <div className="space-y-3" onClick={() => trackClick(prod.id)}>
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full flex items-center justify-center gap-2.5 bg-white text-black py-4 rounded-2xl text-[15px] font-black tracking-tight hover:bg-neutral-100 active:scale-[0.98] transition-all overflow-hidden shadow-[0_4px_24px_rgba(255,255,255,0.08)]"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/[0.04] to-transparent" />
                  <Download size={16} className="flex-shrink-0" />
                  {ctaText}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </a>

                <p className="flex items-center justify-center gap-1.5 text-neutral-600 text-[11px]">
                  <Lock size={9} />
                  {paymentNote}
                </p>
              </div>

              {/* ── Delivery label ── */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">
                <Truck size={11} className="text-neutral-600" />
                Instant Google Drive Delivery
              </div>

              {/* ── Guarantee chips ── */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Globe,        label: "Digital Delivery" },
                  { icon: Lock,         label: "Private G-Drive" },
                  { icon: CheckCircle2, label: "Siap Pakai" },
                  { icon: ShieldCheck,  label: "Garansi 100%" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <Icon size={12} className="text-white/25 flex-shrink-0" />
                    <span className="text-[11px] text-neutral-500 font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* ── Instan delivery highlight ── */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/[0.12]">
                <Zap size={14} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-[12px] font-semibold text-white/80 leading-none mb-0.5">Instan Delivery</p>
                  <p className="text-[11px] text-neutral-600">Akses langsung dikirim setelah checkout.</p>
                </div>
              </div>

              {/* ── Butuh Bantuan card ── */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full px-4 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={15} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white/80 leading-none mb-0.5">Butuh Bantuan?</p>
                    <p className="text-[11px] text-neutral-600">Konsultasi via WhatsApp</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-neutral-600 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
              </a>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          BELOW-FOLD CONTENT
      ════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 sm:px-6 pb-28 lg:pb-20 mt-0 space-y-0">

        {/* ── Deskripsi lengkap ── */}
        {hasLongDesc && (
          <motion.section
            id="deskripsi"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="py-16 border-t border-white/[0.05]"
          >
            <div className="flex items-center gap-2 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07]">
                <Sparkles size={11} className="text-white/30" />
                <span className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.18em]">Tentang Template</span>
              </div>
            </div>
            <div className="max-w-3xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h2 className="text-xl font-bold text-white mt-7 mb-3 tracking-tight">{children}</h2>,
                  h2: ({ children }) => <h3 className="text-lg font-bold text-white mt-6 mb-2.5 tracking-tight">{children}</h3>,
                  h3: ({ children }) => <h4 className="text-base font-semibold text-white/90 mt-5 mb-2">{children}</h4>,
                  p: ({ children }) => <p className="text-neutral-400 text-sm leading-[1.75] mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="space-y-2 mb-5">{children}</ul>,
                  ol: ({ children }) => <ol className="space-y-2 mb-5 list-decimal list-inside text-neutral-400 text-sm">{children}</ol>,
                  li: ({ children }) => (
                    <li className="flex items-start gap-2.5 text-sm text-neutral-400">
                      <CheckCircle2 size={13} className="text-emerald-500/50 flex-shrink-0 mt-[3px]" />
                      <span className="leading-relaxed">{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => <strong className="text-white/90 font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="text-neutral-300 italic">{children}</em>,
                  code: ({ children }) => (
                    <code className="px-1.5 py-0.5 rounded-md bg-white/[0.06] text-xs font-mono text-neutral-300 border border-white/[0.06]">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-white/10 pl-4 my-5 text-neutral-500 italic text-sm">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="border-white/[0.06] my-7" />,
                }}
              >
                {prod.description}
              </ReactMarkdown>
            </div>
          </motion.section>
        )}

        {/* ── Fitur Unggulan ── */}
        <section className="py-16 border-t border-white/[0.05]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] mb-4">
              <Sparkles size={11} className="text-white/30" />
              <span className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.18em]">Yang kamu dapat</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Fitur Unggulan</h2>
            <p className="text-neutral-500 text-base mt-2 max-w-xl">Semua yang kamu butuhkan untuk mengelola bisnis lebih efisien.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature, i) => {
              const Icon = resolveIcon(feature.icon);
              const s = FEATURE_STYLES[i % FEATURE_STYLES.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center mb-5`}>
                    <Icon size={18} className={s.text} />
                  </div>
                  <h4 className="text-base font-semibold text-white/90 mb-2 tracking-tight">{feature.title}</h4>
                  <p className="text-neutral-500 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Bottom CTA band ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="py-16 border-t border-white/[0.05]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-8 rounded-[28px] bg-white/[0.02] border border-white/[0.06]">
            <div>
              <p className="text-[11px] font-semibold text-neutral-600 uppercase tracking-[0.18em] mb-1">Siap mulai?</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{prod.name}</h3>
              <p className="text-neutral-500 text-sm mt-1">
                Rp {displayPrice.toLocaleString("id-ID")} · Sekali bayar, akses selamanya
              </p>
            </div>
            <div onClick={() => trackClick(prod.id)} className="flex-shrink-0">
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 bg-white text-black px-7 py-3.5 rounded-xl font-black text-sm hover:bg-neutral-100 active:scale-[0.98] transition-all shadow-[0_4px_24px_rgba(255,255,255,0.07)] whitespace-nowrap"
              >
                <Download size={15} />
                {ctaText}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </motion.section>

      </div>

      {/* ── Mobile sticky CTA ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-10 bg-gradient-to-t from-[#030303] via-[#030303]/90 to-transparent pointer-events-none">
        <div className="pointer-events-auto" onClick={() => trackClick(prod.id)}>
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full bg-white text-black px-5 py-4 rounded-2xl font-black text-sm active:scale-[0.98] transition-all shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
          >
            <span className="flex items-center gap-2">
              <Download size={15} />
              {ctaText}
            </span>
            <span className="text-black/45 font-semibold text-xs tabular-nums">
              Rp {displayPrice.toLocaleString("id-ID")}
            </span>
          </a>
        </div>
      </div>

    </div>
  );
}
