"use client"

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { LayoutTemplate, BarChart3, ShieldCheck, Zap, Layers } from "lucide-react";
import { SectionEyebrow } from "./SectionEyebrow";

/* ─── Shared fade-in variants ──────────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/* ─── Visual: App UI mockup ────────────────────────────────────────────────── */
function UIPreview() {
  return (
    <div className="relative w-full select-none">
      {/* Glow */}
      <div className="absolute -inset-10 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d0d10] overflow-hidden shadow-2xl">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
          <span className="w-3 h-3 rounded-full bg-green-500/40" />
          <div className="ml-3 flex-1 h-5 rounded-md bg-white/5 flex items-center px-3 gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400/60" />
            <div className="w-24 h-1.5 rounded bg-white/10" />
          </div>
        </div>

        {/* Sidebar + content */}
        <div className="flex h-56">
          {/* Sidebar */}
          <div className="w-14 border-r border-white/5 bg-black/30 flex flex-col items-center py-4 gap-3">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center ${i === 1 ? "bg-white/10 border border-white/10" : ""}`}>
                <div className={`rounded ${i === 1 ? "w-4 h-4 bg-white/40" : "w-3.5 h-3.5 bg-white/10"}`} />
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 space-y-3 overflow-hidden">
            {/* Top stat row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Klien", val: "128", color: "text-white/80" },
                { label: "Pendapatan", val: "Rp 42M", color: "text-green-400" },
                { label: "Konversi", val: "68%", color: "text-indigo-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/[0.04] border border-white/5 p-3">
                  <div className="text-[9px] text-neutral-500 mb-1">{s.label}</div>
                  <div className={`text-sm font-semibold ${s.color}`}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Table rows */}
            <div className="rounded-xl border border-white/5 overflow-hidden">
              <div className="grid grid-cols-4 bg-white/[0.03] px-3 py-1.5">
                {["Nama", "Status", "Nilai", "Progress"].map((h) => (
                  <div key={h} className="text-[9px] text-neutral-600 font-medium">{h}</div>
                ))}
              </div>
              {[
                { status: "ACTIVE", color: "bg-green-500/10 text-green-400 border-green-500/20", val: "Rp 4.5M", pct: 72 },
                { status: "PENDING", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", val: "Rp 2.1M", pct: 38 },
                { status: "DONE", color: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20", val: "Rp 7.8M", pct: 100 },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-4 px-3 py-2 border-t border-white/5 items-center">
                  <div className="w-16 h-1.5 rounded bg-white/10" />
                  <div className={`w-fit text-[8px] px-2 py-0.5 rounded-full border ${row.color}`}>{row.status}</div>
                  <div className="text-[9px] text-neutral-400">{row.val}</div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/30 rounded-full" style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Visual: Animated bar chart ───────────────────────────────────────────── */
function ChartPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const bars = [
    { h: 40, label: "Sen" },
    { h: 65, label: "Sel" },
    { h: 50, label: "Rab" },
    { h: 80, label: "Kam" },
    { h: 55, label: "Jum" },
    { h: 90, label: "Sab" },
    { h: 100, label: "Min" },
  ];

  return (
    <div ref={ref} className="relative w-full select-none">
      <div className="absolute -inset-10 bg-violet-500/8 blur-3xl rounded-full pointer-events-none" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d0d10] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-neutral-500 mb-1">Pendapatan Mingguan</div>
            <div className="text-2xl font-semibold text-white/90">Rp 42.5M</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
            <span>↑</span> 18.4%
          </div>
        </div>

        {/* Bars */}
        <div className="flex items-end gap-2 h-32">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                className="w-full rounded-t-md"
                style={{
                  background: i === bars.length - 1
                    ? "rgba(255,255,255,0.6)"
                    : `rgba(255,255,255,${0.06 + i * 0.04})`,
                }}
                initial={{ height: 0 }}
                animate={inView ? { height: `${b.h}%` } : { height: 0 }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="text-[9px] text-neutral-600">{b.label}</span>
            </div>
          ))}
        </div>

        {/* Trend line hint */}
        <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
          {["Minggu ini", "Minggu lalu"].map((l, i) => (
            <div key={l} className="flex items-center gap-1.5 text-[10px] text-neutral-500">
              <div className={`w-3 h-0.5 rounded ${i === 0 ? "bg-white/50" : "bg-white/15"}`} />
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Visual: One-click automation ─────────────────────────────────────────── */
function AutoPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    { label: "Buka template", done: true },
    { label: "Klik tombol 'Jalankan'", done: true },
    { label: "Script berjalan otomatis", done: true },
    { label: "Laporan siap diunduh", done: false },
  ];

  return (
    <div ref={ref} className="relative w-full select-none">
      <div className="absolute -inset-10 bg-yellow-500/6 blur-3xl rounded-full pointer-events-none" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d0d10] p-6 shadow-2xl space-y-3">
        <div className="text-xs text-neutral-500 mb-4 tracking-widest uppercase">Proses Otomasi</div>

        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: i * 0.18 + 0.1, type: "spring", stiffness: 300, damping: 20 }}
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border ${
                s.done
                  ? "bg-green-500/15 border-green-500/30"
                  : "bg-white/5 border-white/10 animate-pulse"
              }`}
            >
              {s.done
                ? <span className="text-green-400 text-[10px]">✓</span>
                : <span className="w-2 h-2 rounded-full bg-white/20" />
              }
            </motion.div>
            <span className={`text-sm ${s.done ? "text-white/70" : "text-neutral-500"}`}>{s.label}</span>
            {i < steps.length - 1 && (
              <div className="ml-auto w-12 h-px bg-white/5" />
            )}
          </motion.div>
        ))}

        {/* CTA button mock */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="w-full h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center gap-2">
            <Zap size={14} className="text-yellow-400/70" />
            <span className="text-sm text-white/50 font-medium">Jalankan Sekarang</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Visual: License system ───────────────────────────────────────────────── */
function LicensePreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="relative w-full select-none">
      <div className="absolute -inset-10 bg-green-500/6 blur-3xl rounded-full pointer-events-none" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d0d10] p-6 shadow-2xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/15 mb-4"
        >
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="text-green-400" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white/80 mb-0.5">Lisensi Aktif</div>
            <div className="text-[11px] text-neutral-500 font-mono truncate">PKR-8F9A-2X4C-9M1L</div>
          </div>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.5)] flex-shrink-0"
          />
        </motion.div>

        {/* Protection features */}
        <div className="space-y-2">
          {[
            { label: "Enkripsi end-to-end", icon: "🔒" },
            { label: "Proteksi anti-bajak aktif", icon: "🛡️" },
            { label: "Auto-revoke jika disalahgunakan", icon: "⚡" },
            { label: "Terikat ke akun Google kamu", icon: "🔗" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5"
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs text-neutral-400">{item.label}</span>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400/50" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Feature row ───────────────────────────────────────────────────────────── */
interface FeatureRowProps {
  eyebrow: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  visual: React.ReactNode;
  reverse?: boolean;
}

function FeatureRow({ eyebrow, title, desc, icon: Icon, visual, reverse }: FeatureRowProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      {/* Text side */}
      <motion.div variants={fadeUp} className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center">
            <Icon size={17} className="text-white/50" />
          </div>
          <span className="text-xs font-medium tracking-[0.18em] uppercase text-white/30">{eyebrow}</span>
        </div>
        <h3 className="text-3xl md:text-4xl font-semibold text-white/90 tracking-tight leading-[1.15]">
          {title}
        </h3>
        <p className="text-neutral-400 text-base leading-relaxed">{desc}</p>
      </motion.div>

      {/* Visual side */}
      <motion.div variants={fadeUp}>
        {visual}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main section ──────────────────────────────────────────────────────────── */
export function Features() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const features = [
    {
      eyebrow: "Desain Premium",
      title: "Bukan template bawaan Google.",
      desc: "Lupakan tampilan spreadsheet kaku yang bikin sakit mata. UI kami di-design khusus biar kamu merasa lagi pakai aplikasi SaaS premium, bukan sekadar ngisi kolom excel.",
      icon: LayoutTemplate,
      visual: <UIPreview />,
      reverse: false,
    },
    {
      eyebrow: "Analitik Real-time",
      title: "Otomasi & analitik dalam satu klik.",
      desc: "Tinggal klik 1 tombol, biarkan script kami yang mikir. Report langsung jadi tanpa perlu tarik rumus manual tiap bulan.",
      icon: BarChart3,
      visual: <ChartPreview />,
      reverse: true,
    },
    {
      eyebrow: "Tanpa Kode",
      title: "Sistem anti-ribet untuk semua orang.",
      desc: "Semua kerumitan kode Apps Script kita sembunyiin di belakang. Tugas kamu cuma satu: masukin data dengan tenang.",
      icon: Zap,
      visual: <AutoPreview />,
      reverse: false,
    },
    {
      eyebrow: "Keamanan",
      title: "Lisensi resmi & perlindungan penuh.",
      desc: "Dilengkapi sistem lisensi bawaan untuk proteksi maksimal. File kamu tetap aman, terkendali, dan terhindar dari pembajakan yang nggak diinginkan.",
      icon: ShieldCheck,
      visual: <LicensePreview />,
      reverse: true,
    },
  ];

  return (
    <section id="fitur" className="py-20 md:py-32 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <motion.div
          ref={headerRef}
          variants={stagger}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-24 md:mb-32"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionEyebrow icon={Layers} label="Fitur Unggulan" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]">
            Fitur yang bikin <br /> saingan kamu iri.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-neutral-400 text-lg leading-relaxed">
            Bukan sekadar spreadsheet. Ini adalah sistem operasi mini untuk bisnis kamu yang haus akan efisiensi.
          </motion.p>
        </motion.div>

        {/* Feature rows */}
        <div className="space-y-20 md:space-y-40 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <FeatureRow key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
