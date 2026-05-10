"use client"

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Users, Database, Clock, Star } from "lucide-react";

/* ─── Animated number counter ──────────────────────────────────────────────── */
function Counter({
  value,
  decimals = 0,
}: {
  value: number;
  decimals?: number;
}) {
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
        duration: 2.4,
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
    color: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    glowColor: "rgba(96,165,250,0.18)",
    barColor: "from-blue-500 to-blue-400",
    bar: 85,
  },
  {
    icon: Database,
    value: 125000,
    suffix: "+",
    label: "Data Terproses",
    sublabel: "baris data dikelola otomatis",
    color: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    glowColor: "rgba(167,139,250,0.18)",
    barColor: "from-violet-500 to-violet-400",
    bar: 92,
  },
  {
    icon: Clock,
    value: 1200,
    suffix: " jam",
    label: "Jam Dihemat",
    sublabel: "total waktu kerja yang kembali",
    color: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    glowColor: "rgba(251,191,36,0.15)",
    barColor: "from-amber-500 to-amber-400",
    bar: 78,
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "",
    decimals: 1,
    label: "Rating Kepuasan",
    sublabel: "dari 5 bintang rata-rata review",
    color: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    glowColor: "rgba(52,211,153,0.15)",
    barColor: "from-emerald-500 to-emerald-400",
    bar: 98,
  },
];

/* ─── Single stat card ──────────────────────────────────────────────────────── */
function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7 overflow-hidden hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-500"
    >
      {/* Ambient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${stat.glowColor}, transparent 65%)`,
        }}
      />

      {/* Top accent line */}
      <div
        className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${stat.barColor} opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
      />

      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-6 ${stat.iconBg} ${stat.color} transition-transform duration-300 group-hover:scale-110`}
      >
        <stat.icon size={19} strokeWidth={1.8} />
      </div>

      {/* Number */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-[2.6rem] font-bold tracking-tight text-white leading-none">
          <Counter value={stat.value} decimals={(stat as { decimals?: number }).decimals ?? 0} />
        </span>
        {stat.suffix && (
          <span className={`text-2xl font-bold ${stat.color} leading-none`}>{stat.suffix}</span>
        )}
        {(stat as { decimals?: number }).decimals && (
          <span className="text-sm text-white/25 ml-1 font-medium">/5</span>
        )}
      </div>

      {/* Label */}
      <div className="text-sm font-semibold text-white/75 mb-1">{stat.label}</div>
      <div className="text-xs text-white/30 leading-relaxed mb-6">{stat.sublabel}</div>

      {/* Progress bar */}
      <div className="h-[3px] w-full bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${stat.barColor}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${stat.bar}%` } : {}}
          transition={{ duration: 1.6, delay: index * 0.12 + 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Percentage label */}
      <div className="flex justify-end mt-2">
        <span className={`text-[10px] font-medium ${stat.color} opacity-60`}>{stat.bar}%</span>
      </div>
    </motion.div>
  );
}

/* ─── Main section ──────────────────────────────────────────────────────────── */
export function StatsCounter() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      {/* Background radial */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(120,80,255,0.04),transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">

        {/* ── Header — centered ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/40">
              Hasil Nyata
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.1] mb-5">
            <span className="text-white">Angka yang </span>
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              bicara.
            </span>
          </h2>

          <p className="text-white/40 text-base md:text-lg leading-relaxed">
            Bukan klaim kosong. Ini hasil nyata dari pengguna yang sudah beralih ke{" "}
            <span className="text-white/60 font-medium">Pakarsheet</span>.
          </p>
        </motion.div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>

        {/* ── Bottom social proof — centered ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          {/* Avatar stack */}
          <div className="flex -space-x-2.5">
            {[
              { bg: "bg-blue-500", delay: 0 },
              { bg: "bg-violet-500", delay: 0.05 },
              { bg: "bg-amber-500", delay: 0.1 },
              { bg: "bg-emerald-500", delay: 0.15 },
              { bg: "bg-pink-500", delay: 0.2 },
            ].map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={headerInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + a.delay }}
                className={`w-8 h-8 rounded-full ${a.bg} border-2 border-[#080808] opacity-80`}
              />
            ))}
          </div>

          <p className="text-xs text-white/30 text-center">
            Bergabung bersama{" "}
            <span className="text-white/55 font-semibold">850+ pengguna aktif</span>{" "}
            yang sudah merasakan manfaatnya.
          </p>

          {/* Divider dots */}
          <div className="flex items-center gap-1.5 mt-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-white/10" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
