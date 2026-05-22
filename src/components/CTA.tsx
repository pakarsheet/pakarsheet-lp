"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { SectionEyebrow } from "./SectionEyebrow";

export function CTA() {
  return (
    <section className="bg-background relative overflow-hidden py-32 md:py-40 border-t border-white/5">
      {/* Glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[300px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-10 lg:px-12 xl:px-16">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <SectionEyebrow icon={Rocket} label="Mulai Sekarang" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-white/90 leading-[1.05]"
          >
            Ubah cara kerjamu hari ini.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-neutral-400 text-xl mb-12 font-normal leading-relaxed"
          >
            Mulai dari harga satu kali ngopi, dapetin sistem yang bisa nyelamatin ratusan jam kerja tim kamu tiap bulannya.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              href="/shop" 
              className="flex items-center justify-center gap-2 bg-white text-black px-10 py-5 rounded-xl font-semibold text-xl hover:bg-neutral-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95 tracking-tight"
            >
              Pilih Template <ArrowRight size={22} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
