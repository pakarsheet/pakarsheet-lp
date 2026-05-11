"use client"

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { SpotlightCard } from "./SpotlightCard";
import { SectionEyebrow } from "./SectionEyebrow";

const faqs = [
  {
    q: "Apakah data saya aman?",
    a: "100% Aman. Pakarsheet hanyalah perantara logika Apps Script. Seluruh data tetap tersimpan di Google Drive pribadi kamu. Kami tidak punya akses sama sekali ke data tersebut."
  },
  {
    q: "Perlu bayar langganan bulanan?",
    a: "Nggak perlu. Sekali bayar, template jadi milik kamu selamanya. Update fitur di masa depan juga bisa kamu nikmati secara gratis."
  },
  {
    q: "Saya awam excel, apakah bisa pakai?",
    a: "Sangat bisa! Pakarsheet didesain untuk user yang nggak mau ribet rumus. Kamu cukup input data, otomasi kami yang urus sisanya."
  },
  {
    q: "Bisa kustom sesuai kebutuhan saya?",
    a: "Bisa banget. Struktur template kami sangat fleksibel. Kalau kamu butuh bantuan kustomisasi lebih dalam, tim kami siap bantu via WhatsApp."
  },
  {
    q: "Gimana kalau script-nya error?",
    a: "Jangan panik. Kamu dapet garansi support. Kalau ada error di script bawaan, tim kami bakal benerin sampai lancar tanpa biaya tambahan."
  }
];

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-10 lg:px-12 xl:px-16">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="mb-4 flex justify-center">
            <SectionEyebrow icon={HelpCircle} label="FAQ" />
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]">
            Tanya jawab santai.
          </h2>
          <p className="text-neutral-400 text-lg font-normal leading-relaxed">
            Masih ada yang ganjel? Mungkin jawaban yang kamu cari ada di bawah sini.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <SpotlightCard key={i} className="rounded-[24px] border border-white/5 bg-[#0a0a0a]">
              <button
                type="button"
                aria-expanded={activeIndex === i}
                className="w-full p-6 flex items-center justify-between gap-4 text-left"
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              >
                <h3 className="text-lg font-semibold text-white/90 tracking-tight">{faq.q}</h3>
                <motion.div
                  animate={{ rotate: activeIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-neutral-500 flex-shrink-0"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              <AnimatePresence mode="wait">
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
