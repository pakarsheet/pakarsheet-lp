"use client"

import { Reveal } from "@/components/Reveal";
import { Heart, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ThankYouPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-32 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Reveal>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-8 mx-auto border border-green-500/30"
        >
          <Heart className="text-green-400" size={48} fill="currentColor" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-medium mb-6 text-white tracking-tight">Terima kasih!</h1>
        <p className="text-neutral-400 text-lg max-w-xl mx-auto mb-12 font-normal">
          Akses template kamu sudah diproses. Cek email kamu untuk link template Google Sheets-nya. Kalau ada kendala, langsung hubungi kami ya.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          <div className="p-6 rounded-[24px] border border-white/5 bg-white/[0.02] flex items-start gap-4 text-left">
            <MessageCircle className="text-green-500/50 mt-1 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-medium text-white mb-1">Butuh Bantuan?</h3>
              <p className="text-neutral-500 text-sm font-normal">
                Chat kami langsung via WhatsApp untuk panduan setup template.
              </p>
            </div>
          </div>
          <div className="p-6 rounded-[24px] border border-white/5 bg-white/[0.02] flex items-start gap-4 text-left">
            <Heart className="text-red-500/50 mt-1 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-medium text-white mb-1">Rekomendasikan ke Teman</h3>
              <p className="text-neutral-500 text-sm font-normal">
                Kalau Pakarsheet membantu, share ke rekan yang butuh otomasi juga!
              </p>
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
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500/10 text-green-400 border border-green-500/20 px-8 py-3 rounded-xl font-medium hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} /> Hubungi Support
          </a>
          <Link
            href="/shop"
            className="bg-white/5 text-white border border-white/10 px-8 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            Lihat Template Lain <ArrowRight size={18} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
