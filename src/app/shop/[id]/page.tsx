"use client";

import { useData } from "@/hooks/useData";
import { useProducts } from "@/hooks/useProducts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ExternalLink, ShieldCheck, Zap, 
  ChevronRight, Star, Clock, Globe, ArrowRight,
  ChevronLeft, LayoutDashboard, Edit3, MessageSquare
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, use } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const { products, isLoading, trackClick } = useProducts();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && products.length > 0) {
      const found = products.find((p) => p.id === id);
      if (found) {
        setProduct(found);
      } else {
        router.push("/shop");
      }
    }
  }, [id, products, isLoading, router]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Handle both single image (legacy) and multiple images
  const productImages = product.images || [product.image];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pb-20">
      {/* Navbar Area (Simplified for focus) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Toko</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck size={16} className="text-blue-400" />
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Verified Template</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 lg:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT: IMAGE CAROUSEL SECTION */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video md:aspect-square lg:aspect-video rounded-[40px] overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl group"
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={{
                  prevEl: '.swiper-prev',
                  nextEl: '.swiper-next',
                }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                className="w-full h-full"
              >
                {productImages.map((img: string, idx: number) => (
                  <SwiperSlide key={idx}>
                    <div className="relative w-full h-full">
                      <Image 
                        src={img} 
                        alt={`${product.name} - ${idx + 1}`}
                        fill 
                        className="object-cover"
                        priority
                        unoptimized
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Custom Navigation */}
              {productImages.length > 1 && (
                <>
                  <button className="swiper-prev absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
                    <ChevronLeft size={24} />
                  </button>
                  <button className="swiper-next absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Sub-features grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] text-center">
                <Star className="text-yellow-500 mx-auto mb-2" size={20} />
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-tighter">Premium Quality</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] text-center">
                <Clock className="text-blue-500 mx-auto mb-2" size={20} />
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-tighter">Lifetime Update</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] text-center">
                <Globe className="text-green-500 mx-auto mb-2" size={20} />
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-tighter">Cloud Sync</p>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT SECTION */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20 mb-6">
                {product.category || "Template"}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                {product.name}
              </h1>
              <p className="text-neutral-400 text-lg leading-relaxed mb-10">
                {product.description}
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex items-center gap-4 p-6 rounded-[32px] bg-white/[0.02] border border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Instan Delivery</h4>
                    <p className="text-sm text-neutral-500">Akses langsung dikirim setelah checkout.</p>
                  </div>
                </div>
              </div>

              {/* Price Area */}
              <div className="mb-10">
                <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mb-2">Harga Investasi</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-neutral-600 line-through text-lg">
                    Rp {(product.price * 2.5).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* CTA Area */}
              <div className="bg-gradient-to-b from-white/5 to-transparent p-1 rounded-[32px]" onClick={() => trackClick(product.id)}>
                <a
                  href={product.lynkUrl || "https://lynk.id/pakarsheet"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-black py-6 rounded-[28px] text-xl font-black hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 group"
                >
                  Beli Sekarang
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              
              <p className="text-center text-neutral-600 text-xs mt-6 font-medium">
                🔒 Pembayaran aman via Lynk.id
              </p>
            </motion.div>
          </div>

        </div>

        {/* FITUR UNGGULAN SECTION */}
        <div className="mt-32 pt-24 border-t border-white/5">
          <div className="mb-16 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Fitur Unggulan</h2>
            <p className="text-neutral-500 text-lg">Keunggulan template yang akan mengotomatisasi operasional bisnis Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Otomatisasi Apps Script", desc: "Dilengkapi dengan skrip otomatis yang memproses data dalam hitungan detik.", icon: Zap, color: "text-yellow-400" },
              { title: "UI/UX Dashboard Clean", desc: "Tampilan dashboard yang bersih dan profesional, memudahkan pembacaan data.", icon: LayoutDashboard, color: "text-blue-400" },
              { title: "Lifetime Free Update", desc: "Cukup beli sekali, Anda akan mendapatkan update fitur selamanya secara gratis.", icon: Clock, color: "text-green-400" },
              { title: "Cloud Sync & Backup", desc: "Data tersimpan aman di Google Drive Anda, akses dari mana saja kapan saja.", icon: Globe, color: "text-purple-400" },
              { title: "Mudah Dikustomisasi", desc: "Bisa disesuaikan dengan kebutuhan spesifik bisnis Anda tanpa merusak rumus.", icon: Edit3, color: "text-orange-400" },
              { title: "Support Konsultasi", desc: "Bingung cara pakai? Kami siap bantu lewat chat WhatsApp kapanpun.", icon: MessageSquare, color: "text-red-400" },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/[0.05] transition-colors" />
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${feature.color} border border-white/5 shadow-xl`}>
                  <feature.icon size={28} />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-neutral-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
