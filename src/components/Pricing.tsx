"use client"

import { motion } from "framer-motion";
import { Check, ShieldCheck, RefreshCw, TrendingDown, Clock, Users, Zap, Infinity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SpotlightCard } from "./SpotlightCard";
import { Reveal } from "./Reveal";

export function Pricing() {
  return (
    <section id="beli" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6">
              Investasi pintar. <br/> Sekali seumur hidup.
            </h2>
            <p className="text-neutral-400 text-lg font-normal leading-relaxed">
              Hentikan iuran bulanan yang menguras kantong. <br className="hidden md:block" />
              Dapatkan otomasi kelas industri dengan harga sekali jajan.
            </p>
          </div>
        </Reveal>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: The "Pain" Points (Bento Style) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02] flex flex-col justify-between h-full opacity-60">
              <div>
                <Users className="text-neutral-500 mb-4" size={24} />
                <h4 className="text-white/80 font-medium mb-2 tracking-tight">Sewa agency</h4>
                <p className="text-sm text-neutral-500 font-normal leading-relaxed">Membayar jutaan tiap bulan untuk laporan yang sebenarnya bisa otomatis.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 text-red-500/50 font-mono text-sm tracking-tight">
                biaya: Rp 60jt+/tahun
              </div>
            </div>
            
            <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02] flex flex-col justify-between h-full opacity-60">
              <div>
                <Clock className="text-neutral-500 mb-4" size={24} />
                <h4 className="text-white/80 font-medium mb-2 tracking-tight">Manual input</h4>
                <p className="text-sm text-neutral-500 font-normal leading-relaxed">Menghabiskan 3 jam/hari hanya untuk copy-paste data yang membosankan.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 text-orange-500/50 font-mono text-sm tracking-tight">
                rugi: 1000+ jam/tahun
              </div>
            </div>
          </div>

          {/* Center/Right Column: The "Golden Ticket" (Main Offer) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* The Main Access Card */}
            <div className="md:col-span-2 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-[40px] blur-2xl opacity-30 transition-opacity group-hover:opacity-50" />
              <SpotlightCard className="relative rounded-[38px] border border-white/10 bg-[#070707] shadow-2xl overflow-hidden h-full">
                <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
                  <div className="flex-1 space-y-8 text-center md:text-left">
                    <div>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-500 text-[11px] font-medium tracking-tight mb-4">
                        <TrendingDown size={14} /> Solusi paling efisien
                      </span>
                      <h3 className="text-3xl md:text-4xl font-semibold text-white/90 mb-4 tracking-tight">Akses full template Pakarsheet</h3>
                      <p className="text-neutral-400 text-sm leading-relaxed max-w-sm font-normal">
                        Otomasi lengkap dengan Apps Script, dashboard visual, dan lifetime update tanpa biaya tambahan.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {["No monthly fees", "Custom UI", "Full support", "Lifetime updates"].map((t) => (
                        <div key={t} className="flex items-center gap-2 text-xs text-neutral-500 font-normal tracking-tight">
                          <Check size={14} className="text-green-500/40" /> {t}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-full md:w-auto p-10 rounded-[32px] bg-white text-black text-center flex flex-col justify-center min-w-[240px] shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                    <div className="text-[11px] font-medium tracking-widest mb-4 text-black/30">Hanya hari ini</div>
                    <div className="text-6xl font-semibold tracking-tight mb-2">99rb</div>
                    <div className="text-xs font-medium tracking-tight mb-8 text-black/60">Sekali bayar saja</div>
                    <Link 
                      href="/shop"
                      className="bg-black text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 tracking-tight"
                    >
                      Pilih Template <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </div>

            {/* Small Value Box 1 */}
            <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <Zap className="text-yellow-500/30 mb-4" size={24} />
              <h4 className="text-white/80 font-medium mb-2 tracking-tight">Instan aktif</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-normal">Setelah pembayaran, link copy template langsung dikirim ke email kamu detik itu juga.</p>
            </div>

            {/* Small Value Box 2 */}
            <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <Infinity className="text-blue-500/30 mb-4" size={24} />
              <h4 className="text-white/80 font-medium mb-2 tracking-tight">Pakai selamanya</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-normal">Template ini milik kamu 100%. Tidak ada batasan waktu penggunaan atau jumlah baris data.</p>
            </div>

          </div>
        </div>

        {/* Security & Support Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-30">
           <div className="flex items-center gap-2 text-[11px] font-medium text-white tracking-tight">
             <ShieldCheck size={16} /> 100% aman & terpercaya
           </div>
           <div className="flex items-center gap-2 text-[11px] font-medium text-white tracking-tight">
             <RefreshCw size={16} /> Bantuan teknis gratis
           </div>
        </div>
      </div>
    </section>
  );
}
