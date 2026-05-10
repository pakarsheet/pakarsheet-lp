"use client"

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Zap, RefreshCw, HeartHandshake } from "lucide-react";

const trustPoints = [
  {
    icon: ShieldCheck,
    label: "Pembayaran aman",
    sub: "via Lynk.id",
  },
  {
    icon: Zap,
    label: "Akses instan",
    sub: "setelah checkout",
  },
  {
    icon: RefreshCw,
    label: "Lifetime update",
    sub: "gratis selamanya",
  },
  {
    icon: HeartHandshake,
    label: "Support aktif",
    sub: "via WhatsApp",
  },
];

export function SocialProof() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="py-14 border-y border-white/5 bg-white/[0.01]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-xs font-medium tracking-[0.2em] uppercase text-white/20 mb-8"
        >
          Kenapa pilih Pakarsheet
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
          {trustPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/5 bg-white/[0.02]"
            >
              <point.icon size={15} className="text-white/30 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-white/60 tracking-tight">{point.label}</span>
                <span className="text-xs text-neutral-600 ml-1.5">{point.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
