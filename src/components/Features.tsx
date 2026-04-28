"use client"

import { motion } from "framer-motion";
import { LayoutTemplate, BarChart3, ShieldCheck, Zap } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import { Reveal } from "./Reveal";

export function Features() {
  return (
    <section id="fitur" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]">
              Fitur yang bikin <br/> saingan kamu iri.
            </h2>
            <p className="text-neutral-400 text-lg font-normal leading-relaxed">
              Bukan sekadar spreadsheet. Ini adalah sistem operasi mini untuk bisnis kamu yang haus akan efisiensi.
            </p>
          </div>
        </Reveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          
          {/* Card 1: Bukan Template Bawaan (Spans 2 columns on md) */}
          <SpotlightCard className="md:col-span-2 rounded-[32px] border border-white/10 bg-[#0a0a0a] overflow-hidden group hover:border-white/20 transition-all">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-48 bg-gradient-to-br from-neutral-900 to-black relative p-6 border-b border-white/5 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
                {/* Abstract UI representation */}
                <div className="w-full max-w-xs space-y-3 relative z-10 group-hover:scale-105 transition-transform duration-500">
                  <div className="h-8 w-full rounded-md bg-white/10 border border-white/10 flex items-center px-3 gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-16 h-2 rounded bg-white/20" />
                  </div>
                  <div className="flex gap-3">
                    <div className="h-16 flex-1 rounded-md bg-white/5 border border-white/5" />
                    <div className="h-16 flex-1 rounded-md bg-white/5 border border-white/5" />
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-6">
                  <LayoutTemplate className="text-white/60" size={20} />
                </div>
                <h3 className="text-2xl font-semibold text-white/90 mb-3 tracking-tight">Bukan template bawaan</h3>
                <p className="text-neutral-400 text-sm font-normal leading-relaxed">
                  Lupakan tampilan spreadsheet kaku yang bikin sakit mata. UI kami di-design khusus biar kamu merasa lagi pakai aplikasi SaaS premium, bukan sekadar ngisi kolom excel.
                </p>
              </div>
            </motion.div>
          </SpotlightCard>

          {/* Card 2: Otomasi & Analitik */}
          <SpotlightCard className="rounded-[32px] border border-white/10 bg-[#0a0a0a] overflow-hidden group hover:border-white/20 transition-all">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="h-48 bg-gradient-to-b from-neutral-900 to-black p-6 border-b border-white/5 flex items-end justify-center">
                 <div className="flex items-end gap-2 w-full h-full pt-8 group-hover:gap-3 transition-all opacity-50">
                   <div className="w-full bg-white/10 rounded-t-sm h-[30%]" />
                   <div className="w-full bg-white/20 rounded-t-sm h-[50%]" />
                   <div className="w-full bg-white/40 rounded-t-sm h-[80%]" />
                   <div className="w-full bg-white rounded-t-sm h-[100%]" />
                 </div>
              </div>
              <div className="p-8">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-6">
                  <BarChart3 className="text-white/60" size={20} />
                </div>
                <h3 className="text-2xl font-semibold text-white/90 mb-3 tracking-tight">Otomasi & analitik</h3>
                <p className="text-neutral-400 text-sm font-normal leading-relaxed">
                  Tinggal klik 1 tombol, biarkan script kami yang mikir. Report langsung jadi tanpa perlu tarik rumus manual tiap bulan.
                </p>
              </div>
            </motion.div>
          </SpotlightCard>

          {/* Card 3: Sistem Anti-Ribet */}
          <SpotlightCard className="rounded-[32px] border border-white/10 bg-[#0a0a0a] overflow-hidden group hover:border-white/20 transition-all">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-48 bg-neutral-950 p-6 border-b border-white/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="text-white/40" size={28} />
                </div>
              </div>
              <div className="p-8">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-6">
                  <Zap className="text-white/60" size={20} />
                </div>
                <h3 className="text-2xl font-semibold text-white/90 mb-3 tracking-tight">Sistem anti-ribet</h3>
                <p className="text-neutral-400 text-sm font-normal leading-relaxed">
                  Semua kerumitan kode Apps Script kita sembunyiin di belakang. Tugas kamu cuma satu: masukin data dengan tenang.
                </p>
              </div>
            </motion.div>
          </SpotlightCard>

          {/* Card 4: Lisensi Resmi */}
          <SpotlightCard className="md:col-span-2 rounded-[32px] border border-white/10 bg-[#0a0a0a] overflow-hidden group hover:border-white/20 transition-all">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="h-48 bg-gradient-to-tr from-neutral-900 to-black p-6 border-b border-white/5 flex items-center justify-center relative">
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-xl backdrop-blur-sm relative z-10 opacity-40">
                  <ShieldCheck className="text-green-400" size={32} />
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-white">Lisensi Valid</div>
                    <div className="text-xs text-neutral-400 font-mono">PKR-8F9A-2X4C-9M1L</div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-6">
                  <ShieldCheck className="text-white/60" size={20} />
                </div>
                <h3 className="text-2xl font-semibold text-white/90 mb-3 tracking-tight">Lisensi resmi & aman</h3>
                <p className="text-neutral-400 text-sm font-normal max-w-lg leading-relaxed">
                  Dilengkapi sistem lisensi bawaan untuk proteksi maksimal. File kamu tetap aman, terkendali, dan terhindar dari pembajakan yang nggak diinginkan.
                </p>
              </div>
            </motion.div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
}
