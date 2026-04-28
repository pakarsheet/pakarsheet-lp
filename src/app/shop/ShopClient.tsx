"use client";

import { useProducts } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import { Search, Sparkles, ArrowRight, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

const categories = ["Semua", "Keuangan", "Marketing", "Inventory", "HR & Admin", "Lainnya"];

function ProductSkeleton() {
  return (
    <div className="h-full relative flex flex-col rounded-[32px] border border-white/5 bg-[#0a0a0a] overflow-hidden animate-pulse">
      <div className="p-3 pb-0">
        <div className="w-full aspect-square rounded-[24px] bg-white/5" />
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-white/10" />
          <div className="h-2 w-16 bg-white/10 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-white/10 rounded mb-3" />
        <div className="h-3 w-full bg-white/5 rounded mb-2" />
        <div className="h-3 w-4/5 bg-white/5 rounded mb-8" />
        <div className="mt-auto pt-5 border-t border-white/5 flex items-end justify-between">
          <div>
            <div className="h-2 w-16 bg-white/10 rounded mb-2" />
            <div className="h-5 w-24 bg-white/10 rounded" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function ShopClient() {
  const { products, isLoading, trackClick } = useProducts();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = activeCategory === "Semua" || p.category === activeCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      <main className="flex-1 container mx-auto px-4 md:px-6 pt-32 pb-24 relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm text-neutral-300 mb-8 font-medium shadow-xl"
          >
            <Sparkles size={16} className="text-yellow-400" />
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Koleksi Template Premium
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6 leading-[1.1]"
          >
            Senjata Rahasia <br className="hidden md:block" />
            <span className="text-neutral-500">Operasional Bisnis.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-normal"
          >
            Pilih sistem siap pakai yang telah dioptimasi dengan Apps Script. Nggak perlu pusing mikir rumus, fokus kembangin bisnis aja.
          </motion.p>
        </div>

        {/* Toolbar & Filters */}
        <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-white text-black shadow-lg"
                    : "bg-white/[0.03] text-neutral-400 border border-white/5 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative w-full md:w-72 group"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={16} className="text-neutral-500 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
            />
          </motion.div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => <ProductSkeleton key={i} />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 text-neutral-500 flex flex-col items-center">
            <LayoutGrid size={48} className="text-neutral-800 mb-4" />
            <p className="text-lg">
              {searchQuery || activeCategory !== "Semua"
                ? "Tidak ada template yang cocok. Coba filter lain."
                : "Belum ada produk yang tersedia."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1, type: "spring", stiffness: 100 }}
                onClick={() => trackClick(product.id)}
              >
                <Link href={`/shop/${product.id}`} className="block group h-full">
                  <div className="h-full relative flex flex-col rounded-[32px] border border-white/10 bg-[#0a0a0a] overflow-hidden hover:border-white/20 hover:bg-[#0f0f0f] transition-all duration-500">
                    <div className="p-3 pb-0 z-10">
                      <div className="relative w-full aspect-square rounded-[24px] bg-neutral-900 overflow-hidden shadow-2xl border border-white/5">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          unoptimized={product.image.startsWith("data:")}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                            Lihat Detail <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1 relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
                          {product.category || "Template"}
                        </span>
                      </div>

                      <h3 className="text-2xl font-semibold text-white/90 mb-3 tracking-tight group-hover:text-white transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-neutral-500 text-sm mb-8 flex-1 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>

                      <div className="mt-auto pt-5 border-t border-white/5 flex items-end justify-between">
                        <div>
                          <div className="text-[10px] text-neutral-600 mb-1 font-medium tracking-widest uppercase">Harga Akses</div>
                          <div className="text-xl font-bold text-white">
                            Rp {product.price.toLocaleString("id-ID")}
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black text-white/40 transition-colors">
                          <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
