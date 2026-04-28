"use client";

import { useProducts } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Zap, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Skeleton for the detail page
function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-32 relative overflow-hidden animate-pulse">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="h-8 w-40 bg-white/5 rounded-full mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="w-full aspect-square rounded-[40px] bg-white/5" />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="h-6 w-40 bg-white/5 rounded-full" />
            <div className="h-14 w-3/4 bg-white/10 rounded-xl" />
            <div className="h-12 w-48 bg-white/10 rounded-xl" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-5/6 bg-white/5 rounded" />
              <div className="h-4 w-4/6 bg-white/5 rounded" />
            </div>
            <div className="h-16 w-full bg-white/5 rounded-[20px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const { products, isLoading } = useProducts();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!isLoading) {
      const found = products.find((p) => p.id === id);
      if (found) {
        setProduct(found);
      } else {
        router.push("/shop");
      }
    }
  }, [id, products, isLoading, router]);

  if (isLoading || !product) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="min-h-screen pt-24 pb-32 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">

        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-10 transition-colors font-medium text-sm group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          Kembali ke Koleksi
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column - Image (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-full aspect-square relative rounded-[40px] overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl group"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                unoptimized={product.image.startsWith("data:")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

              {/* Floating Badges */}
              <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <span className="text-xs font-semibold text-white tracking-wide uppercase">Ready</span>
              </div>
              {product.category && (
                <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                  <span className="text-xs font-semibold text-white/70 tracking-wide">{product.category}</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-neutral-300 mb-6 font-medium w-fit backdrop-blur-sm">
              <Zap size={14} className="text-yellow-400" /> Script Otomatis Tersedia
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
              {product.name}
            </h1>

            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-white/5">
              <div className="text-4xl md:text-5xl font-bold text-white">
                Rp {product.price.toLocaleString("id-ID")}
              </div>
              <div className="text-neutral-500 mb-2">/ Akses Selamanya</div>
            </div>

            <h3 className="text-xl font-semibold text-white/90 mb-4">Tentang Template Ini</h3>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed mb-8 font-normal">
              {product.description}
            </p>

            {/* Bullet Points Section */}
            <div className="mb-10">
              <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-widest mb-5">Yang Akan Kamu Dapatkan:</h4>
              <ul className="space-y-4">
                {[
                  "File Google Sheets Premium (Siap Pakai)",
                  "Otomasi Apps Script (Berjalan di background)",
                  "Video Panduan Step-by-Step Cara Setup & Penggunaan",
                  "Akses Grup Diskusi / Support 1-on-1 via WhatsApp",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={14} className="text-green-400" />
                    </div>
                    <span className="text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                <CheckCircle2 className="text-green-400 mb-4" size={24} />
                <h4 className="font-semibold text-white mb-2">Akses Instan</h4>
                <p className="text-sm text-neutral-500">File langsung terkirim ke email detik itu juga setelah pembayaran.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                <ShieldCheck className="text-blue-400 mb-4" size={24} />
                <h4 className="font-semibold text-white mb-2">Lisensi Aman</h4>
                <p className="text-sm text-neutral-500">Dilengkapi proteksi file agar template Anda tidak gampang dibajak.</p>
              </div>
            </div>

            {/* CTA Area — Links to lynk.id */}
            <div className="bg-gradient-to-b from-white/5 to-transparent p-1 rounded-3xl">
              <a
                href={product.lynkUrl || "https://lynk.id/pakarsheet"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white text-black py-5 rounded-[20px] text-lg font-bold hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 group"
              >
                Beli & Dapatkan Akses
                <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <ShieldCheck size={14} /> Garansi 100% Work
              </div>
              <div className="w-1 h-1 rounded-full bg-neutral-800" />
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <CheckCircle2 size={14} /> Panduan Lengkap
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
