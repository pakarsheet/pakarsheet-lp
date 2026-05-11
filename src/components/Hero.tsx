"use client"

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import Link from "next/link";

import { CodeBackground } from "./CodeBackground";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <CodeBackground />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/[0.03] blur-[80px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-10 lg:px-12 xl:px-16 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-neutral-300 mb-6 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Siap dipakai tanpa setup ribet
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-white/90 leading-[1.1]"
          >
            Stop buang waktu untuk <br className="hidden md:block" />
            input data manual.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl font-normal leading-relaxed"
          >
            Template Google Sheets custom dengan UI bersih dan otomasi Apps Script di belakang layar. Dibuat langsung berdasarkan request para praktisi biar kerjamu lebih cepet beres.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-xs sm:max-w-none mx-auto"
          >
            <Link 
              href="/shop" 
              className="flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-semibold hover:bg-neutral-200 transition-all active:scale-95 shadow-xl group"
            >
              <Sparkles size={16} className="text-black/50 group-hover:text-black transition-colors" />
              Lihat template <ArrowRight size={18} />
            </Link>
            <Link 
              href="#cara-kerja" 
              className="flex items-center justify-center gap-2 bg-transparent text-white border border-white/20 px-8 py-3.5 rounded-xl font-medium hover:bg-white/5 transition-all active:scale-95"
            >
              <PlayCircle size={18} /> Cara kerjanya
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Mockup Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 relative mx-auto max-w-6xl"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="rounded-[32px] border border-white/10 bg-white/[0.02] p-2 md:p-3 shadow-2xl overflow-hidden relative">
            {/* Top bar of mock browser/window */}
            <div className="flex items-center gap-2 mb-3 px-4 py-2 opacity-80">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
              <div className="ml-4 h-4 w-32 bg-white/5 rounded text-[10px] flex items-center px-2 text-neutral-500 font-mono">pakarsheet_v2.xlsx</div>
            </div>
            
            {/* Inner Spreadsheet UI Mock */}
            <div className="rounded-[24px] border border-white/5 bg-[#0a0a0a] aspect-video flex flex-col overflow-hidden relative">
              
              {/* Spreadsheet Header / Menu */}
              <div className="h-10 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-4 overflow-hidden">
                <div className="h-4 w-4 bg-green-500/20 rounded-sm"></div>
                <div className="flex gap-3">
                  <div className="h-2 w-10 bg-white/10 rounded"></div>
                  <div className="h-2 w-8 bg-white/5 rounded"></div>
                  <div className="h-2 w-12 bg-white/5 rounded"></div>
                </div>
                <div className="ml-auto flex gap-2">
                  <div className="h-6 w-16 bg-green-600/20 border border-green-500/30 rounded flex items-center justify-center text-[10px] text-green-400 font-medium">SHARE</div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="h-8 border-b border-white/5 bg-white/[0.01] flex items-center px-4 gap-4">
                <div className="flex gap-2">
                   {Array.from({length: 4}).map((_, i) => (
                     <div key={i} className="h-4 w-4 rounded-sm bg-white/5"></div>
                   ))}
                </div>
              </div>

              {/* Main Grid Area */}
              <div className="flex-1 flex flex-col overflow-hidden font-mono text-[10px]">
                {/* Column Headers */}
                <div className="flex border-b border-white/5 bg-white/[0.02]">
                  <div className="w-10 h-6 border-r border-white/5 flex items-center justify-center text-neutral-600"></div>
                  {['A', 'B', 'C', 'D'].map((col) => (
                    <div key={col} className="flex-1 h-6 border-r border-white/5 flex items-center justify-center text-neutral-600 bg-black/20">{col}</div>
                  ))}
                </div>

                {/* Rows */}
                {Array.from({length: 8}).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                    <div className="w-10 h-10 border-r border-white/5 flex items-center justify-center text-neutral-800 bg-black/20">{rowIndex + 1}</div>
                    
                    {/* Cells */}
                    <div className="flex-1 h-10 border-r border-white/5 p-3 flex items-center">
                      <div className={`h-2 rounded ${rowIndex === 0 ? 'w-2/3 bg-white/10' : 'w-1/2 bg-white/5'}`} />
                    </div>
                    <div className="flex-1 h-10 border-r border-white/5 p-3 flex items-center">
                      <div className={`h-4 rounded-full px-3 flex items-center justify-center text-[8px] font-medium ${
                        rowIndex % 3 === 0 ? 'bg-green-500/10 text-green-400/70 border border-green-500/20' : 
                        rowIndex % 3 === 1 ? 'bg-blue-500/10 text-blue-400/70 border border-blue-500/20' :
                        'bg-neutral-500/10 text-neutral-400/70 border border-neutral-500/20'
                      }`}>
                        {rowIndex % 3 === 0 ? 'ACTIVE' : rowIndex % 3 === 1 ? 'PENDING' : 'DONE'}
                      </div>
                    </div>
                    <div className="flex-1 h-10 border-r border-white/5 p-3 flex items-center justify-end text-neutral-600">
                      Rp {((rowIndex + 1) * 125000).toLocaleString('id-ID')}
                    </div>
                    <div className="flex-1 h-10 p-3 flex items-center">
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(rowIndex * 7 + 30) % 100}%` }}
                          transition={{ delay: 0.8, duration: 1.0 }}
                          className="h-full bg-neutral-600"
                          style={{ willChange: "width" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dashboard Overlays */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute top-1/4 right-8 w-40 bg-black/60 border border-white/5 rounded-2xl p-4 shadow-2xl z-20"
              >
                <div className="text-[9px] text-neutral-500 mb-2 tracking-widest font-medium">Analytics</div>
                <div className="text-lg font-semibold text-white mb-2 flex items-baseline gap-1">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    42.5
                  </motion.span>
                  <span className="text-xs text-neutral-500">M</span>
                </div>
                <div className="h-8 flex items-end gap-1">
                   {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                     <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1.5 + (i * 0.06), duration: 0.4 }}
                        className="flex-1 bg-white/10 rounded-t-[1px]"
                        style={{ willChange: "height" }}
                     />
                   ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
