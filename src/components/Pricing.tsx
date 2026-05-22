"use client"

import { motion, useInView, type Variants } from "framer-motion";
import { Tag, Check, ShieldCheck, RefreshCw, TrendingDown, Clock, Users, Zap, Infinity, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { SpotlightCard } from "./SpotlightCard";
import { SectionEyebrow } from "./SectionEyebrow";

/* ─── Shared animation variants ────────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/* ─── Pain point card ───────────────────────────────────────────────────────── */
function PainCard({
  icon: Icon,
  title,
  desc,
  cost,
  costColor,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  cost: string;
  costColor: string;
}) {
  return (
    <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02] flex flex-col justify-between h-full opacity-50 hover:opacity-70 transition-opacity duration-300">
      <div>
        <Icon className="text-neutral-600 mb-5" size={22} />
        <h4 className="text-white/70 font-semibold mb-2 tracking-tight">{title}</h4>
        <p className="text-sm text-neutral-500 font-normal leading-relaxed">{desc}</p>
      </div>
      <div className={`mt-6 pt-5 border-t border-white/5 font-mono text-sm tracking-tight ${costColor}`}>
        {cost}
      </div>
    </div>
  );
}

/* ─── Feature check item ────────────────────────────────────────────────────── */
function FeatureItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-neutral-400 font-normal">
      <div className="w-4 h-4 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0">
        <Check size={10} className="text-white/50" />
      </div>
      {label}
    </div>
  );
}

/* ─── Main section ──────────────────────────────────────────────────────────── */
export function Pricing() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section id="beli" className="py-32 md:py-40 relative overflow-hidden">
      {/* Subtle background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.012] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-10 lg:px-12 xl:px-16 relative">

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          variants={stagger}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-20 md:mb-28"
        >
          <motion.div variants={fadeUp} className="mb-5">
            <SectionEyebrow icon={Tag} label="Harga" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.05]">
            Investasi pintar. <br /> Sekali seumur hidup.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-neutral-400 text-xl font-normal leading-relaxed">
            Hentikan iuran bulanan yang menguras kantong.{" "}
            <br className="hidden md:block" />
            Dapatkan otomasi kelas industri dengan harga sekali jajan.
          </motion.p>
        </motion.div>

        {/* ── Bento grid ── */}
        <motion.div
          ref={gridRef}
          variants={stagger}
          initial="hidden"
          animate={gridInView ? "show" : "hidden"}
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4"
        >

          {/* ── Left: pain points ── */}
          <motion.div variants={fadeUp} className="lg:col-span-4 flex flex-col gap-4">
            <PainCard
              icon={Users}
              title="Sewa agency"
              desc="Membayar jutaan tiap bulan untuk laporan yang sebenarnya bisa otomatis."
              cost="biaya: Rp 60jt+/tahun"
              costColor="text-red-500/50"
            />
            <PainCard
              icon={Clock}
              title="Manual input"
              desc="Menghabiskan 3 jam/hari hanya untuk copy-paste data yang membosankan."
              cost="rugi: 1000+ jam/tahun"
              costColor="text-orange-500/50"
            />
          </motion.div>

          {/* ── Right: main offer + value boxes ── */}
          <motion.div variants={fadeUp} className="lg:col-span-8 flex flex-col gap-4">

            {/* Main offer card */}
            <SpotlightCard className="rounded-[32px] border border-white/10 bg-[#0a0a0a] overflow-hidden">
              <div className="p-8 md:p-10 flex flex-col md:flex-row items-stretch gap-8 md:gap-10">

                {/* Left: copy */}
                <div className="flex-1 flex flex-col justify-between gap-8">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/8 text-neutral-500 text-[11px] font-medium tracking-tight mb-5">
                      <TrendingDown size={12} /> Solusi paling efisien
                    </span>
                    <h3 className="text-2xl md:text-3xl font-semibold text-white/90 mb-3 tracking-tight leading-[1.2]">
                      Akses full template <br className="hidden md:block" />Pakarsheet
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed font-normal max-w-xs">
                      Otomasi lengkap dengan Apps Script, dashboard visual, dan lifetime update tanpa biaya tambahan.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {[
                      "No monthly fees",
                      "Custom UI",
                      "Full support",
                      "Lifetime updates",
                    ].map((t) => (
                      <FeatureItem key={t} label={t} />
                    ))}
                  </div>
                </div>

                {/* Right: price box */}
                <div className="flex-shrink-0 w-full md:w-[220px] rounded-[24px] bg-white text-black flex flex-col items-center justify-center p-6 md:p-8 gap-1 shadow-[0_0_60px_rgba(255,255,255,0.08)]">
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-black/30 mb-2">
                    Mulai dari
                  </p>
                  <div className="text-[3.5rem] font-semibold tracking-tight leading-none mb-1">
                    99rb
                  </div>
                  <p className="text-xs text-black/40 font-medium mb-6">Sekali bayar saja</p>
                  <Link
                    href="/shop"
                    className="w-full bg-black text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors active:scale-95 text-sm tracking-tight"
                  >
                    Pilih Template <ArrowRight size={16} />
                  </Link>
                </div>

              </div>
            </SpotlightCard>

            {/* Value boxes row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-7 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
                <Zap className="text-yellow-500/40 mb-4" size={22} />
                <h4 className="text-white/80 font-semibold mb-2 tracking-tight">Instan aktif</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                  Setelah pembayaran, link copy template langsung dikirim ke email kamu detik itu juga.
                </p>
              </div>
              <div className="p-7 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
                <Infinity className="text-blue-500/40 mb-4" size={22} />
                <h4 className="text-white/80 font-semibold mb-2 tracking-tight">Pakai selamanya</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                  Template ini milik kamu 100%. Tidak ada batasan waktu penggunaan atau jumlah baris data.
                </p>
              </div>
            </div>

          </motion.div>
        </motion.div>

        {/* ── Trust badges ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={gridInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { icon: ShieldCheck, label: "100% aman & terpercaya" },
            { icon: RefreshCw, label: "Bantuan teknis gratis" },
            { icon: Sparkles, label: "Lifetime updates" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-[11px] font-medium text-white/20 tracking-tight">
              <Icon size={14} />
              {label}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
