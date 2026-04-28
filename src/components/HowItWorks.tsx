"use client"

import { motion } from "framer-motion";
import { Download, Edit3, CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "Download Template",
    description: "Setelah pembayaran, kamu akan langsung dapat akses ke file Google Sheets eksklusif kami.",
    icon: Download,
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    title: "Input Data Kamu",
    description: "Masukkan data harian atau hubungkan dengan sumber data iklan kamu dengan mudah.",
    icon: Edit3,
    color: "bg-purple-500/20 text-purple-400"
  },
  {
    title: "Terima Beres",
    description: "Sistem otomasi akan mengolah semuanya. Laporan cantik siap dikirim ke klien atau bos.",
    icon: CheckCircle2,
    color: "bg-green-500/20 text-green-400"
  }
];

import { SpotlightCard } from "./SpotlightCard";

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-32 bg-white/[0.01]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
            3 Langkah Gampang
          </h2>
          <p className="text-neutral-400 text-lg">
            Nggak perlu jadi ahli excel. Cukup ikuti alur kerja simpel ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto relative">
          {steps.map((step, i) => (
            <SpotlightCard key={i} className="p-8 rounded-[32px] border border-white/5 bg-[#0a0a0a] flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 border border-white/5`}>
                  <step.icon size={28} />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
