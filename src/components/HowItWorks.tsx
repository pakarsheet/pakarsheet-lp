"use client"

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Download, Edit3, CheckCircle2, Workflow } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import { SectionEyebrow } from "./SectionEyebrow";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const steps = [
  {
    title: "Download Template",
    description: "Setelah pembayaran, kamu akan langsung dapat akses ke file Google Sheets eksklusif kami.",
    icon: Download,
    step: "01",
  },
  {
    title: "Input Data Kamu",
    description: "Masukkan data harian atau hubungkan dengan sumber data iklan kamu dengan mudah.",
    icon: Edit3,
    step: "02",
  },
  {
    title: "Terima Beres",
    description: "Sistem otomasi akan mengolah semuanya. Laporan cantik siap dikirim ke klien atau bos.",
    icon: CheckCircle2,
    step: "03",
  },
];

export function HowItWorks() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section id="cara-kerja" className="py-20 md:py-32 bg-white/[0.01]">
      <div className="container mx-auto px-4 md:px-10 lg:px-12 xl:px-16">

        <motion.div
          ref={headerRef}
          variants={stagger}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionEyebrow icon={Workflow} label="Cara Kerja" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]">
            3 Langkah Gampang
          </motion.h2>
          <motion.p variants={fadeUp} className="text-neutral-400 text-lg font-normal leading-relaxed">
            Nggak perlu jadi ahli excel. Cukup ikuti alur kerja simpel ini.
          </motion.p>
        </motion.div>

        <motion.div
          ref={gridRef}
          variants={stagger}
          initial="hidden"
          animate={gridInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto"
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp}>
              <SpotlightCard className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 flex flex-col items-center text-center h-full">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/8 flex items-center justify-center mb-5">
                  <step.icon size={17} className="text-white/40" />
                </div>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/20 mb-3">{step.step}</span>
                <h3 className="text-lg font-semibold text-white/90 mb-3 tracking-tight">{step.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed font-normal">{step.description}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
