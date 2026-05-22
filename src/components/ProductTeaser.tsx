"use client"

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useData } from "@/hooks/useData";
import { SectionEyebrow } from "./SectionEyebrow";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductTeaser() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  const { products, isLoading } = useData();
  // Show max 3 featured products
  const featured = products.slice(0, 3);

  return (
    <section className="py-32 md:py-40 border-t border-white/5 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/[0.012] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-10 lg:px-12 xl:px-16 relative">

        {/* Header */}
        <motion.div
          ref={headerRef}
          variants={stagger}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-20 md:mb-28"
        >
          <motion.div variants={fadeUp} className="mb-5">
            <SectionEyebrow icon={ShoppingBag} label="Template Pilihan" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.05]">
            Langsung pakai, <br />langsung jalan.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-neutral-400 text-xl font-normal leading-relaxed">
            Pilih template yang sesuai kebutuhan bisnis kamu. Sekali bayar, pakai selamanya.
          </motion.p>
        </motion.div>

        {/* Product grid */}
        <motion.div
          ref={gridRef}
          variants={stagger}
          initial="hidden"
          animate={gridInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto"
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="rounded-[32px] border border-white/5 bg-[#0a0a0a] overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-white/[0.03]" />
                  <div className="p-7 space-y-3">
                    <div className="h-4 w-3/4 bg-white/5 rounded" />
                    <div className="h-3 w-full bg-white/[0.03] rounded" />
                    <div className="h-3 w-2/3 bg-white/[0.03] rounded" />
                    <div className="h-8 w-1/3 bg-white/5 rounded mt-4" />
                  </div>
                </motion.div>
              ))
            : featured.length === 0
            ? /* Fallback when no products yet */
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="rounded-[32px] border border-white/5 bg-[#0a0a0a] overflow-hidden group hover:border-white/10 transition-colors duration-300"
                >
                  <div className="aspect-video bg-white/[0.02] flex items-center justify-center">
                    <Sparkles size={32} className="text-white/10" aria-hidden="true" />
                  </div>
                  <div className="p-7">
                    <div className="h-3 w-16 bg-white/5 rounded mb-3" />
                    <div className="h-5 w-3/4 bg-white/8 rounded mb-2" />
                    <div className="h-3 w-full bg-white/[0.03] rounded mb-1" />
                    <div className="h-3 w-2/3 bg-white/[0.03] rounded mb-6" />
                    <div className="h-8 w-24 bg-white/5 rounded" />
                  </div>
                </motion.div>
              ))
            : featured.map((product) => {
                const thumb = product.images?.[0] ?? product.image;
                const isOnSale =
                  product.salePrice &&
                  product.salePriceUntil &&
                  product.salePriceUntil > Date.now();
                const displayPrice = isOnSale ? product.salePrice! : product.price;

                return (
                  <motion.div key={product.id} variants={fadeUp}>
                    <Link
                      href={`/shop/${product.id}`}
                      className="group block rounded-[32px] border border-white/5 bg-[#0a0a0a] overflow-hidden hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-video bg-white/[0.02] overflow-hidden relative">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles size={32} className="text-white/10" aria-hidden="true" />
                          </div>
                        )}
                        {isOnSale && (
                          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/90 text-white text-[11px] font-semibold">
                            <Tag size={10} aria-hidden="true" /> SALE
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-7">
                        <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/30 mb-2">
                          {product.category}
                        </p>
                        <h3 className="text-lg font-semibold text-white/90 mb-2 tracking-tight leading-snug line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-neutral-500 text-sm leading-relaxed mb-5 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-semibold text-white/90 tracking-tight">
                              {formatPrice(displayPrice)}
                            </span>
                            {isOnSale && product.originalPrice && (
                              <span className="text-sm text-neutral-600 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                            <ArrowRight size={14} className="text-white/50 group-hover:text-black transition-colors" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
        </motion.div>

        {/* CTA to shop */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={gridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/[0.03] text-white/70 text-sm font-semibold hover:bg-white/[0.07] hover:text-white hover:border-white/20 transition-all active:scale-95"
          >
            Lihat semua template <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
