"use client"

import { Reveal } from "@/components/Reveal";
import { CheckCircle2, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-32 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Reveal>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-8 mx-auto border border-green-500/30"
        >
          <CheckCircle2 className="text-green-400" size={48} />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-medium mb-6 text-white">Pembayaran Berhasil!</h1>
        <p className="text-neutral-400 text-lg max-w-xl mx-auto mb-12 font-normal">
          Terima kasih telah mempercayakan sistem operasional bisnismu pada Pakarsheet. Akses template telah dikirimkan ke email kamu.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          <div className="p-6 rounded-[24px] border border-white/5 bg-white/[0.02] flex items-start gap-4 text-left">
            <Mail className="text-blue-500/50 mt-1" size={24} />
            <div>
              <h3 className="font-medium text-white mb-1">Cek Inbox / Spam</h3>
              <p className="text-neutral-500 text-sm font-normal">Link akses Google Sheets kami kirim otomatis dalam 1-5 menit.</p>
            </div>
          </div>
          <div className="p-6 rounded-[24px] border border-white/5 bg-white/[0.02] flex items-start gap-4 text-left">
            <CheckCircle2 className="text-green-500/50 mt-1" size={24} />
            <div>
              <h3 className="font-medium text-white mb-1">Panduan Penggunaan</h3>
              <p className="text-neutral-500 text-sm font-normal">Sudah termasuk video tutorial singkat di dalam file template.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
          >
            Kembali ke Beranda
          </Link>
          <Link 
            href="#" 
            className="bg-white/5 text-white border border-white/10 px-8 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            Hubungi Support <ArrowRight size={18} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
