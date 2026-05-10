"use client";

import { useProducts } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import {
  ArrowLeft, ShieldCheck, Zap,
  ChevronRight, Star, Clock, Globe, ArrowRight,
  ChevronLeft, LayoutDashboard, Edit3, MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { products, isLoading, trackClick } = useProducts();
  const [product, setProduct] = useState<ReturnType<typeof products[0]["valueOf"]> | null>(null);

  useEffect(() => {
    if (!isLoading && products.length > 0) {
      const found = products.find((p) => p.id === id);
      if (found) {
        setProduct(found as any);
      } else {
        router.push("/shop");
      }
    }
  }, [id, products, isLoading, router]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const p = product as any;

  // Normalise images
  const productImages: string[] = (
    p.images?.length > 0 ? p.images : p.image ? [p.image] : []
  ).filter(Boolean);

  if (productImages.length === 0) {
    productImages.push(
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60"
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pb-20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium text-sm">Kembali ke Toko</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck size={14} className="text-white/40" />
            <span className="text-xs font-medium text-neutral-400 tracking-widest uppercase">
              Verified Template
            </span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-28 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* ── Left: image carousel ── */}
          <div className="lg:col-span-7 space-y-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-video rounded-[32px] overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl group"
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={{ prevEl: ".swiper-prev", nextEl: ".swiper-next" }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                className="w-full h-full"
              >
                {productImages.map((img: string, idx: number) => (
                  <SwiperSlide key={idx}>
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`${p.name} - gambar ${idx + 1}`}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                        unoptimized
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {productImages.length > 1 && (
                <>
                  <button className="swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Star, label: "Premium Quality", color: "text-yellow-500/60" },
                { icon: Clock, label: "Lifetime Update", color: "text-blue-500/60" },
                { icon: Globe, label: "Cloud Sync", color: "text-green-500/60" },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="bg-white/[0.02] border border-white/5 p-4 rounded-[24px] text-center"
                >
                  <Icon className={`${color} mx-auto mb-2`} size={18} />
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-tight">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: product info ── */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-white/[0.06] text-white/40 text-xs font-semibold uppercase tracking-widest border border-white/8 mb-5">
                {p.category || "Template"}
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 leading-[1.15] text-white/90">
                {p.name}
              </h1>

              <p className="text-neutral-400 text-base leading-relaxed mb-8">
                {p.description}
              </p>

              {/* Instan delivery badge */}
              <div className="flex items-center gap-4 p-5 rounded-[24px] bg-white/[0.02] border border-white/5 mb-8">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 flex-shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">Instan Delivery</p>
                  <p className="text-xs text-neutral-500">Akses langsung dikirim setelah checkout.</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <p className="text-neutral-600 text-xs font-semibold uppercase tracking-widest mb-2">
                  Harga
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    Rp {p.price.toLocaleString("id-ID")}
                  </span>
                  {p.originalPrice && p.originalPrice > p.price && (
                    <span className="text-neutral-600 line-through text-base">
                      Rp {p.originalPrice.toLocaleString("id-ID")}
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div onClick={() => trackClick(p.id)}>
                <a
                  href={p.lynkUrl || "https://lynk.id/pakarsheet"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-black py-5 rounded-[24px] text-lg font-black hover:bg-neutral-100 active:scale-[0.98] transition-all shadow-[0_16px_40px_rgba(255,255,255,0.08)] flex items-center justify-center gap-3 group"
                >
                  Beli Sekarang
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </div>

              <p className="text-center text-neutral-600 text-xs mt-4 font-medium">
                🔒 Pembayaran aman via Lynk.id
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── Features section ── */}
        <div className="mt-24 pt-20 border-t border-white/5">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-3">
              Yang kamu dapat
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white/90 tracking-tight">
              Fitur Unggulan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              {
                title: "Otomatisasi Apps Script",
                desc: "Skrip otomatis memproses data dalam hitungan detik tanpa perlu coding.",
                icon: Zap,
              },
              {
                title: "UI/UX Dashboard Clean",
                desc: "Tampilan dashboard profesional yang mudah dibaca dan digunakan.",
                icon: LayoutDashboard,
              },
              {
                title: "Lifetime Free Update",
                desc: "Beli sekali, update fitur selamanya tanpa biaya tambahan.",
                icon: Clock,
              },
              {
                title: "Cloud Sync & Backup",
                desc: "Data tersimpan aman di Google Drive, akses dari mana saja.",
                icon: Globe,
              },
              {
                title: "Mudah Dikustomisasi",
                desc: "Sesuaikan dengan kebutuhan bisnis kamu tanpa merusak rumus.",
                icon: Edit3,
              },
              {
                title: "Support Konsultasi",
                desc: "Bingung cara pakai? Tim kami siap bantu via WhatsApp.",
                icon: MessageSquare,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="p-7 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/8 flex items-center justify-center mb-5">
                  <feature.icon size={17} className="text-white/40" />
                </div>
                <h4 className="text-base font-semibold text-white/90 mb-2 tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-neutral-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
