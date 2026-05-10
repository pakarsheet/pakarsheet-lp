"use client";

import { useProducts, type Product } from "@/hooks/useProducts";
import { useSettings } from "@/hooks/useSettings";
import { motion } from "framer-motion";
import {
  ArrowLeft, ShieldCheck, Zap, ChevronRight, Star, Clock,
  Globe, ArrowRight, ChevronLeft, LayoutDashboard, Edit3,
  MessageSquare, LucideIcon, CheckCircle2, Sparkles,
  Package, Lock, BadgeCheck, Download,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, use, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { PriceTimer } from "@/components/PriceTimer";
import { SocialProofBadge } from "@/components/SocialProofBadge";

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

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  Star:   { bg: "bg-amber-500/10",   text: "text-amber-400" },
  Clock:  { bg: "bg-blue-500/10",    text: "text-blue-400" },
  Globe:  { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  Shield: { bg: "bg-violet-500/10",  text: "text-violet-400" },
  Zap:    { bg: "bg-orange-500/10",  text: "text-orange-400" },
  Check:  { bg: "bg-green-500/10",   text: "text-green-400" },
};

const FEATURE_STYLES = [
  { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20" },
  { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20" },
  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20" },
  { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20" },
  { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20" },
];

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
    <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
      {images.map((img, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`relative flex-shrink-0 w-[72px] h-11 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
            i === activeIdx
              ? "border-white/50 opacity-100"
              : "border-white/[0.08] opacity-40 hover:opacity-60 hover:border-white/20"
          }`}
        >
          <Image src={img} alt="" fill className="object-cover" unoptimized />
        </button>
      ))}
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
  const { settings } = useSettings();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const swiperRef = useRef<{ slideTo: (i: number) => void } | null>(null);

  useEffect(() => {
    if (!isLoading && products.length > 0) {
      const found = products.find((p) => p.id === id);
      if (found) setProduct(found);
      else router.push("/shop");
    }
  }, [id, products, isLoading, router]);

  // ── Loading ──
  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-white/[0.08] border-t-white/50 animate-spin" />
      </div>
    );
  }

  const prod = product;

  // Images
  const productImages: string[] = (
    prod.images?.length > 0 ? prod.images : prod.image ? [prod.image] : []
  ).filter(Boolean);
  if (productImages.length === 0) {
    productImages.push("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60");
  }

  // Data
  const features =
    (prod.features && prod.features.length > 0) ? prod.features
    : (settings?.shopFeatures && settings.shopFeatures.length > 0) ? settings.shopFeatures
    : DEFAULT_FEATURES;

  const trustBadges =
    (settings?.shopTrustBadges && settings.shopTrustBadges.length > 0)
      ? settings.shopTrustBadges
      : DEFAULT_TRUST_BADGES;

  const ctaText    = settings?.shopCtaText    || DEFAULT_CTA_TEXT;
  const paymentNote = settings?.shopPaymentNote || DEFAULT_PAYMENT_NOTE;
  const buyUrl     = prod.lynkUrl || settings?.mainLynkUrl || "https://lynk.id/pakarsheet";

  // Display price for mobile sticky (mirrors PriceTimer logic without timer)
  const hasSale = prod.salePrice != null && prod.salePrice < prod.price;
  const displayPrice = hasSale ? prod.salePrice! : prod.price;

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ── Topbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.05] flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Kembali ke Toko</span>
          </Link>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/[0.15]">
            <BadgeCheck size={12} className="text-emerald-400" />
            <span className="text-[11px] font-semibold text-emerald-400/80 tracking-wide uppercase hidden sm:block">
              Verified Template
            </span>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="container mx-auto px-4 pt-20 pb-28 lg:pb-16">

        {/* ── Two-column hero ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-10 lg:gap-14 xl:gap-20 items-start">

          {/* LEFT — media */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            {/* Carousel */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-white/[0.07] group">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={{ prevEl: ".swiper-prev", nextEl: ".swiper-next" }}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                onSwiper={(s) => { swiperRef.current = s; }}
                onSlideChange={(s) => setActiveImg(s.activeIndex)}
                className="w-full h-full"
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
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Arrows */}
              {productImages.length > 1 && (
                <>
                  <button className="swiper-prev absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black text-white">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="swiper-next absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black text-white">
                    <ChevronRight size={16} />
                  </button>
                  {/* Counter */}
                  <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[11px] font-medium text-white/60">
                    {activeImg + 1}/{productImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <ThumbnailStrip
              images={productImages}
              activeIdx={activeImg}
              onSelect={(i) => { swiperRef.current?.slideTo(i); setActiveImg(i); }}
            />

            {/* Trust badges */}
            <div
              className="grid gap-2 pt-1"
              style={{ gridTemplateColumns: `repeat(${trustBadges.length}, minmax(0, 1fr))` }}
            >
              {trustBadges.map(({ icon, label }) => {
                const Icon = resolveIcon(icon);
                const s = BADGE_STYLES[icon] ?? { bg: "bg-white/5", text: "text-white/40" };
                return (
                  <div key={label} className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={13} className={s.text} />
                    </div>
                    <p className="text-[11px] font-medium text-neutral-500 leading-tight">{label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT — info + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-20"
          >
            {/* Category */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-[11px] font-semibold text-white/35 uppercase tracking-widest mb-4">
              <Package size={9} />
              {prod.category || "Template"}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug text-white mb-3">
              {prod.name}
            </h1>

            {/* Description */}
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              {prod.description}
            </p>

            {/* Social proof — compact row */}
            <div className="mb-6">
              <SocialProofBadge clicks={prod.clicks} socialProofCount={prod.socialProofCount} />
            </div>

            {/* Price block */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-4">
              <PriceTimer
                productId={prod.id}
                price={prod.price}
                salePrice={prod.salePrice}
                salePriceUntil={prod.salePriceUntil}
              />
              {!prod.salePrice && prod.originalPrice && prod.originalPrice > prod.price && (
                <span className="text-neutral-600 line-through text-sm block mt-1">
                  Rp {prod.originalPrice.toLocaleString("id-ID")}
                </span>
              )}
            </div>

            {/* CTA */}
            <div onClick={() => trackClick(prod.id)}>
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full flex items-center justify-center gap-2.5 bg-white text-black py-4 rounded-2xl text-[15px] font-black tracking-tight hover:bg-neutral-100 active:scale-[0.98] transition-all overflow-hidden shadow-[0_4px_24px_rgba(255,255,255,0.1)]"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/[0.04] to-transparent" />
                <Download size={16} className="flex-shrink-0" />
                {ctaText}
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </a>
            </div>

            {/* Payment note */}
            <p className="flex items-center justify-center gap-1.5 text-neutral-600 text-xs mt-3 mb-5">
              <Lock size={10} />
              {paymentNote}
            </p>

            {/* Delivery + guarantees */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/[0.1]">
                <Zap size={14} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white/80">Instan Delivery</p>
                  <p className="text-[11px] text-neutral-600 mt-0.5">Akses langsung dikirim setelah checkout.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: ShieldCheck, label: "Pembayaran Aman" },
                  { icon: CheckCircle2, label: "Garansi Akses" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <Icon size={13} className="text-white/25 flex-shrink-0" />
                    <span className="text-[11px] text-neutral-600 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Features ── */}
        <section className="mt-20 lg:mt-28 pt-16 border-t border-white/[0.05]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] mb-3">
              <Sparkles size={11} className="text-white/30" />
              <span className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.18em]">Yang kamu dapat</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Fitur Unggulan</h2>
            <p className="text-neutral-500 text-sm mt-1.5">Semua yang kamu butuhkan untuk mengelola bisnis lebih efisien.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature, i) => {
              const Icon = resolveIcon(feature.icon);
              const s = FEATURE_STYLES[i % FEATURE_STYLES.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="group p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.035] hover:border-white/[0.08] transition-all duration-300"
                >
                  <div className={`w-9 h-9 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center mb-4`}>
                    <Icon size={16} className={s.text} />
                  </div>
                  <h4 className="text-sm font-semibold text-white/90 mb-1.5 tracking-tight">{feature.title}</h4>
                  <p className="text-neutral-500 text-xs leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>


      </main>

      {/* ── Mobile sticky CTA ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-6 bg-gradient-to-t from-[#050505] to-transparent">
        <div onClick={() => trackClick(prod.id)}>
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full bg-white text-black px-5 py-3.5 rounded-2xl font-black text-sm active:scale-[0.98] transition-all shadow-[0_8px_32px_rgba(255,255,255,0.12)]"
          >
            <span className="flex items-center gap-2">
              <Download size={15} />
              {ctaText}
            </span>
            <span className="text-black/50 font-semibold text-xs">
              Rp {displayPrice.toLocaleString("id-ID")}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
