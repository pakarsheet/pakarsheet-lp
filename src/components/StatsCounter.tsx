"use client"

import { motion, useMotionValue, useTransform, animate, useInView, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { Users, Database, Clock, Star } from "lucide-react";

/* ─── Shared animation variants — matches Features/Pricing pattern ─────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/* ─── Animated number counter ──────────────────────────────────────────────── */
function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const count = useMotionValue(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const display = useTransform(count, (latest) =>
    decimals > 0
      ? latest.toFixed(decimals)
      : Math.round(latest).toLocaleString("id-ID")
  );

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2.2,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [isInView, count, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

/* ─── Stats data ────────────────────────────────────────────────────────────── */
const stats = [
  {
    icon: Users,
    value: 850,
    suffix: "+",
    label: "Pengguna Aktif",
    sublabel: "dan terus bertambah tiap bulan",
    accent: "text-blue-400/70",
    bar: 85,
    barColor: "bg-blue-400/40",
  },
  {
    icon: Database,
    value: 125000,
    suffix: "+",
    label: "Data Terproses",
    sublabel: "baris data dikelola otomatis",
    accent: "text-violet-400/70",
    bar: 92,
    barColor: "bg-violet-400/40",
  },
  {
    icon: Clock,
    value: 1200,
    suffix: " jam",
    label: "Jam Dihemat",
    sublabel: "total waktu kerja yang kembali",
    accent: "text-amber-400/70",
    bar: 78,
    barColor: "bg-amber-400/40",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "",
    decimals: 1,
    label: "Rating Kepuasan",
    sublabel: "dari 5 bintang rata-rata review",
    accent: "text-green-400/70",
    bar: 98,
    barColor: "bg-green-400/40",
  },
];

/* ─── Single stat card ──────────────────────────────────────────────────────── */
function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative p-8 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-colors duration-300 flex flex-col gap-5"
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/8 flex items-center justify-center">
        <stat.icon size={17} className="text-white/40" />
      </div>

      {/* Number */}
      <div>
        <div className="flex items-baseline gap-1 mb-1.5">
          <span className="text-[2.75rem] font-semibold tracking-tight text-white/90 leading-none">
            <Counter value={stat.value} decimals={(stat as { decimals?: number }).decimals ?? 0} />
          </span>
          {stat.suffix && (
            <span className={`text-xl font-semibold leading-none ${stat.accent}`}>
              {stat.suffix}
            </span>
          )}
          {(stat as { decimals?: number }).decimals && (
            <span className="text-sm text-white/20 font-medium ml-0.5">/5</span>
          )}
        </div>
        <div className="text-sm font-medium text-white/60 tracking-tight">{stat.label}</div>
      </div>

      {/* Sublabel */}
      <p className="text-xs text-neutral-600 leading-relaxed -mt-2">{stat.sublabel}</p>

      {/* Progress bar */}
      <div className="mt-auto">
        <div className="h-px w-full bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${stat.barColor}`}
            initial={{ width: 0 }}
            animate={inView ? { width: `${stat.bar}%` } : {}}
            transition={{ duration: 1.5, delay: index * 0.1 + 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main section ──────────────────────────────────────────────────────────── */
export function StatsCounter() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Subtle background blob — same pattern as Features/Hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">

        {/* ── Header — matches Features & Pricing pattern exactly ── */}
        <motion.div
          ref={headerRef}
          variants={stagger}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">
            Hasil Nyata
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]">
            Angka yang bicara.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-neutral-400 text-lg leading-relaxed">
            Bukan klaim kosong. Ini hasil nyata dari pengguna yang sudah beralih ke Pakarsheet.
          </motion.p>
        </motion.div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>

        {/* ── Bottom social proof — centered ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <div className="flex -space-x-2">
            {["bg-blue-500/70", "bg-violet-500/70", "bg-amber-500/70", "bg-green-500/70"].map((c, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full ${c} border-2 border-[#030303]`}
              />
            ))}
          </div>
          <p className="text-xs text-neutral-500 text-center">
            Bergabung bersama{" "}
            <span className="text-white/50 font-medium">850+ pengguna aktif</span>{" "}
            yang sudah merasakan manfaatnya.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
