"use client"

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Zap, RefreshCcw, FileText, Lock } from "lucide-react";
import { SectionEyebrow } from "./SectionEyebrow";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const detailedFeatures = [
  {
    title: "Auto-Sync Data Iklan",
    desc: "Hubungkan Google Ads, FB Ads, atau TikTok Ads kamu. Script kami akan menarik data belanja iklan setiap jam secara otomatis.",
    icon: RefreshCcw,
  },
  {
    title: "Sistem Notifikasi Telegram",
    desc: "Dapatkan notifikasi langsung ke Telegram kalau ada kampanye yang performanya drop atau budget mau habis.",
    icon: Zap,
  },
  {
    title: "One-Click PDF Reporting",
    desc: "Nggak perlu screenshot satu-satu. Klik tombol 'Export', laporan PDF profesional siap dikirim ke client dalam hitungan detik.",
    icon: FileText,
  },
  {
    title: "User Access Control",
    desc: "Atur siapa saja tim kamu yang bisa edit atau cuma lihat data. Semua terkontrol lewat dashboard admin yang aman.",
    icon: Lock,
  },
];

export function DetailedFeatures() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section className="py-32 md:py-40 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-10 lg:px-12 xl:px-16">

        <motion.div
          ref={headerRef}
          variants={stagger}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-20 md:mb-28"
        >
          <motion.div variants={fadeUp} className="mb-5">
            <SectionEyebrow icon={Zap} label="Kemampuan" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.05]">
            Bekerja lebih cerdas
          </motion.h2>
          <motion.p variants={fadeUp} className="text-neutral-400 text-xl font-normal leading-relaxed">
            Kami menyisipkan puluhan jam kerja teknis ke dalam setiap baris kode Apps Script, supaya kamu tidak perlu melakukan hal yang sama berulang kali.
          </motion.p>
        </motion.div>

        <motion.div
          ref={gridRef}
          variants={stagger}
          initial="hidden"
          animate={gridInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto"
        >
          {detailedFeatures.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-10 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/8 flex items-center justify-center mb-7">
                <f.icon size={20} className="text-white/40" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-semibold text-white/90 mb-4 tracking-tight">{f.title}</h3>
              <p className="text-neutral-500 text-base leading-relaxed font-normal">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
