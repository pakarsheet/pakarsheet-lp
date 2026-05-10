"use client"

import { motion, useMotionValue, useTransform, animate, useInView, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { Users, Database, Clock, Star, TrendingUp } from "lucide-react";
import { SectionEyebrow } from "./SectionEyebrow";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const count = useMotionValue(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const display = useTransform(count, (latest) =>
    decimals > 0
      ? latest.toFixed(decimals)
      : Math.round(latest).toLocaleString("id-ID")
  );

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [isInView, count, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

// ─── Stats data — UPDATE THESE VALUES to match your real numbers ──────────────
const stats = [
  {
    icon: Users,
    value: 850,
    suffix: "+",
    label: "Pengguna Aktif",
    sublabel: "dan terus bertambah tiap bulan",
    color: "from-blue-500/20 to-blue-500/0",
    dot: "bg-blue-400",
    glow: "shadow-blue-500/20",
    bar: 85,
    barColor: "bg-blue-400",
  },
  {
    icon: Database,
    value: 125000,
    suffix: "+",
    label: "Data Terproses",
    sublabel: "baris data dikelola otomatis",
    color: "from-violet-500/20 to-violet-500/0",
    dot: "bg-violet-400",
    glow: "shadow-violet-500/20",
    bar: 92,
    barColor: "bg-violet-400",
  },
  {
    icon: Clock,
    value: 1200,
    suffix: " jam",
    label: "Jam Dihemat",
    sublabel: "total waktu kerja yang kembali",
    color: "from-amber-500/20 to-amber-500/0",
    dot: "bg-amber-400",
    glow: "shadow-amber-500/20",
    bar: 78,
    barColor: "bg-amber-400",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    decimals: 1,
    label: "Rating Kepuasan",
    sublabel: "rata-rata dari semua review",
    color: "from-green-500/20 to-green-500/0",
    dot: "bg-green-400",
    glow: "shadow-green-500/20",
    bar: 98,
    barColor: "bg-green-400",
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative group flex flex-col gap-6 p-7 rounded-[28px] border border-white/8 bg-[#0d0d0d] hover:border-white/15 transition-colors duration-300 overflow-hidden"
    >
      {/* Gradient glow top-right */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.color} rounded-full blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Top row: icon + trend badge */}
      <div className="flex items-start justify-between relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/8 flex items-center justify-center">
          <stat.icon size={18} className="text-white/50" />
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/8">
          <TrendingUp size={10} className="text-white/30" />
          <span className="text-[10px] font-medium text-white/30 tracking-wide">Live</span>
        </div>
      </div>

      {/* Number */}
      <div className="relative z-10">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-5xl font-bold tracking-tight text-white leading-none">
            <Counter value={stat.value} decimals={(stat as { decimals?: number }).decimals ?? 0} />
          </span>
          <span className="text-2xl font-semibold text-white/40 leading-none">{stat.suffix}</span>
        </div>
        <p className="text-sm font-semibold text-white/70 tracking-tight">{stat.label}</p>
        <p className="text-xs text-neutral-600 mt-1">{stat.sublabel}</p>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mt-auto space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-neutral-700 font-medium">Pencapaian</span>
          <span className="text-[10px] text-neutral-600 font-semibold">{stat.bar}%</span>
        </div>
        <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${stat.barColor} opacity-60`}
            initial={{ width: 0 }}
            animate={inView ? { width: `${stat.bar}%` } : {}}
            transition={{ duration: 1.6, delay: index * 0.1 + 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function StatsCounter() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const avatarColors = [
    "bg-blue-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-green-500",
    "bg-rose-500",
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          variants={stagger}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4"
          >
            <SectionEyebrow icon={TrendingUp} label="Hasil Nyata" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]"
          >
            Angka yang bicara.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="text-neutral-400 text-lg leading-relaxed"
          >
            Bukan klaim kosong. Ini hasil nyata dari pengguna yang sudah beralih ke Pakarsheet.
          </motion.p>
        </motion.div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>

        {/* ── Social proof strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-4"
        >
          {/* Avatar stack */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {avatarColors.map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${c} border-2 border-[#030303] flex items-center justify-center text-[10px] font-bold text-white/80`}
                >
                  {["B", "S", "R", "A", "D"][i]}
                </div>
              ))}
            </div>
            <div className="h-8 w-px bg-white/8" />
            <div className="text-left">
              <p className="text-sm font-semibold text-white/70">850+ pengguna aktif</p>
              <p className="text-xs text-neutral-600">bergabung dan merasakan manfaatnya</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-white/8" />

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-white/70">4.9</span>
            <span className="text-xs text-neutral-600">rata-rata rating</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
