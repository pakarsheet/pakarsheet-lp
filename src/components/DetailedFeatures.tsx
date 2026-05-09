"use client"

import { motion } from "framer-motion";
import { Zap, RefreshCcw, FileText, Lock } from "lucide-react";

const detailedFeatures = [
  {
    title: "Auto-Sync Data Iklan",
    desc: "Hubungkan Google Ads, FB Ads, atau TikTok Ads kamu. Script kami akan menarik data belanja iklan setiap jam secara otomatis.",
    icon: RefreshCcw,
    color: "text-blue-400"
  },
  {
    title: "Sistem Notifikasi Telegram",
    desc: "Dapatkan notifikasi langsung ke Telegram kalau ada kampanye yang performanya drop atau budget mau habis.",
    icon: Zap,
    color: "text-yellow-400"
  },
  {
    title: "One-Click PDF Reporting",
    desc: "Nggak perlu screenshot satu-satu. Klik tombol 'Export', laporan PDF profesional siap dikirim ke client dalam hitungan detik.",
    icon: FileText,
    color: "text-red-400"
  },
  {
    title: "User Access Control",
    desc: "Atur siapa saja tim kamu yang bisa edit atau cuma lihat data. Semua terkontrol lewat dashboard admin yang aman.",
    icon: Lock,
    color: "text-green-400"
  }
];

export function DetailedFeatures() {
  return (
    <section className="py-32 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-tight">
            Bekerja lebih cerdas
          </h2>
          <p className="text-neutral-400 text-lg font-normal leading-relaxed">
            Kami menyisipkan puluhan jam kerja teknis ke dalam setiap baris kode Apps Script, supaya Anda tidak perlu lagi melakukan hal yang sama berulang kali.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {detailedFeatures.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 transition-transform ${f.color}`}>
                <f.icon size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-white/90 mb-4 tracking-tight">{f.title}</h3>
              <p className="text-neutral-400 text-base leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
