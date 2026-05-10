"use client"

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Check, X, GitCompare } from "lucide-react";
import { SectionEyebrow } from "./SectionEyebrow";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const comparisons = [
  { feature: "Tampilan & UI", pakarsheet: true, manual: false, desc: "Pakarsheet pakai Custom UI yang bersih, bukan kotak-kotak kaku." },
  { feature: "Otomasi Apps Script", pakarsheet: true, manual: false, desc: "Data ditarik otomatis, nggak perlu copy-paste tiap hari." },
  { feature: "Sistem Lisensi", pakarsheet: true, manual: false, desc: "File aman & terkunci, nggak gampang dibajak orang lain." },
  { feature: "Rekap 1-Klik", pakarsheet: true, manual: false, desc: "Laporan bulanan jadi dalam hitungan detik." },
  { feature: "Kecepatan Setup", pakarsheet: true, manual: true, desc: "Dua-duanya cepat, tapi Pakarsheet jauh lebih stabil." },
];

export function Comparison() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const tableRef = useRef(null);
  const tableInView = useInView(tableRef, { once: true, margin: "-60px" });

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">

        <motion.div
          ref={headerRef}
          variants={stagger}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          transition={{ staggerChildren: 0.1 }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }} className="mb-4">
            <SectionEyebrow icon={GitCompare} label="Perbandingan" />
          </motion.div>
          <motion.h2 variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }} className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]">
            Beda kelas, beda hasil.
          </motion.h2>
          <motion.p variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }} className="text-neutral-400 text-lg font-normal leading-relaxed">
            Kenapa harus bayar kalau bisa bikin sendiri? Karena waktu kamu lebih mahal dari harga template ini.
          </motion.p>
        </motion.div>

        <motion.div
          ref={tableRef}
          initial={{ opacity: 0, y: 28 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto overflow-hidden rounded-[32px] border border-white/5 bg-[#0a0a0a] shadow-2xl"
        >
          <div className="grid grid-cols-3 border-b border-white/5 bg-white/[0.02] text-[10px] md:text-sm font-medium tracking-widest opacity-40">
            <div className="p-3 md:p-6 text-neutral-500">Fitur</div>
            <div className="p-3 md:p-6 text-center text-white relative">
              Pakarsheet
              <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="p-3 md:p-6 text-center text-neutral-600">Manual</div>
          </div>

          {comparisons.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={tableInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="grid grid-cols-3 border-b border-white/5 last:border-b-0 items-center group"
            >
              <div className="p-3 md:p-6 text-neutral-300 font-medium text-xs md:text-sm tracking-tight">
                {item.feature}
                <p className="text-[10px] md:text-xs text-neutral-600 font-normal mt-1 hidden md:block">
                  {item.desc}
                </p>
              </div>
              <div className="p-3 md:p-6 flex justify-center bg-white/[0.015] group-hover:bg-white/[0.03] transition-colors">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/50">
                  <Check size={12} />
                </div>
              </div>
              <div className="p-3 md:p-6 flex justify-center opacity-30">
                {item.manual ? (
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/40">
                    <Check size={12} />
                  </div>
                ) : (
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20">
                    <X size={12} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
