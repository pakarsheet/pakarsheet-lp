"use client"

import { Check } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import { useData } from "@/hooks/useData";

const fallbackTestimonials = [
  {
    name: "Budi Santoso",
    role: "Pemilik Bisnis",
    content: "Awalnya skeptis, mikir 'ah paling template biasa'. Ternyata gila, UI-nya rapi banget dan rekap bulanan yang biasanya makan waktu 3 jam sekarang cuma hitungan detik. Worth it banget!",
    avatar: "B",
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    name: "Siska Amanda",
    role: "Digital Marketer",
    content: "Sebagai advertiser yang tiap hari mantengin data, Pakarsheet beneran ngebantu. Nggak perlu lagi pusing bikin rumus VLOOKUP atau Pivot yang sering error. Tinggal input, dashboard langsung update otomatis.",
    avatar: "S",
    color: "bg-purple-500/20 text-purple-400"
  },
  {
    name: "Rudi Heryanto",
    role: "Admin Operasional",
    content: "Bos seneng banget liat report sekarang, kelihatannya kayak pakai software mahal padahal ini cuma Google Sheets yang di-upgrade parah. Kerjaan harian jadi kerasa lebih enteng.",
    avatar: "R",
    color: "bg-green-500/20 text-green-400"
  }
];

const avatarColors = [
  "bg-blue-500/20 text-blue-400",
  "bg-purple-500/20 text-purple-400",
  "bg-green-500/20 text-green-400",
  "bg-orange-500/20 text-orange-400",
  "bg-red-500/20 text-red-400",
  "bg-yellow-500/20 text-yellow-400",
];

export function Testimonials() {
  const { testimonials: dbTestimonials, isLoading } = useData();

  // Use DB testimonials if available, otherwise fall back to hardcoded
  const testimonials = dbTestimonials.length > 0
    ? dbTestimonials.map((t, i) => ({
        name: t.name,
        role: t.role,
        content: t.content,
        avatar: t.name.charAt(0).toUpperCase(),
        color: avatarColors[i % avatarColors.length],
      }))
    : fallbackTestimonials;

  return (
    <section id="testimoni" className="py-20 md:py-32 border-t border-white/5 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">
            Testimoni
          </p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]">
            Wall of love.
          </h2>
          <p className="text-neutral-400 text-lg font-normal leading-relaxed">
            Nggak perlu dengerin kata kami, dengerin aja dari mereka yang udah ngerasain hemat waktu berjam-jam tiap harinya.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-[32px] border border-white/5 bg-[#0a0a0a] p-8 animate-pulse">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-white/5" />
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-white/10 rounded" />
                    <div className="h-2 w-16 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-3 w-5/6 bg-white/5 rounded" />
                  <div className="h-3 w-4/6 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <SpotlightCard key={i} className="rounded-[32px] border border-white/5 bg-[#0a0a0a]">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-semibold text-base border border-white/10`}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white/90 flex items-center gap-2 tracking-tight text-sm">
                        {t.name}
                        <Check size={12} className="text-white/20" />
                      </div>
                      <div className="text-[10px] text-neutral-600 tracking-[0.15em] font-medium uppercase">Verified Buyer</div>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed font-normal">
                    &quot;{t.content}&quot;
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
