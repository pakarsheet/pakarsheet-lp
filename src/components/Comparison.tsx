"use client"

import { Check, X } from "lucide-react";

const comparisons = [
  { feature: "Tampilan & UI", pakarsheet: true, manual: false, desc: "Pakarsheet pakai Custom UI yang bersih, bukan kotak-kotak kaku." },
  { feature: "Otomasi Apps Script", pakarsheet: true, manual: false, desc: "Data ditarik otomatis, nggak perlu copy-paste tiap hari." },
  { feature: "Sistem Lisensi", pakarsheet: true, manual: false, desc: "File aman & terkunci, nggak gampang dibajak orang lain." },
  { feature: "Rekap 1-Klik", pakarsheet: true, manual: false, desc: "Laporan bulanan jadi dalam hitungan detik." },
  { feature: "Kecepatan Setup", pakarsheet: true, manual: true, desc: "Dua-duanya cepat, tapi Pakarsheet jauh lebih stabil." },
];

export function Comparison() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-white/90">
            Beda kelas, beda hasil.
          </h2>
          <p className="text-neutral-400 text-lg font-normal leading-relaxed">
            Kenapa harus bayar kalau bisa bikin sendiri? Karena waktu kamu lebih mahal dari harga template ini.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-hidden rounded-[32px] border border-white/5 bg-[#0a0a0a] shadow-2xl">
          <div className="grid grid-cols-3 border-b border-white/5 bg-white/[0.02] text-xs md:text-sm font-medium tracking-widest opacity-40">
            <div className="p-4 md:p-6 text-neutral-500">Kapasitas</div>
            <div className="p-4 md:p-6 text-center text-white relative">
              Pakarsheet
              <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="p-4 md:p-6 text-center text-neutral-600">Cara Manual</div>
          </div>

          {comparisons.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-3 border-b border-white/5 last:border-b-0 items-center group"
            >
              <div className="p-4 md:p-6 text-neutral-300 font-medium">
                {item.feature}
                <p className="text-[10px] md:text-xs text-neutral-500 font-normal mt-1 hidden md:block">
                  {item.desc}
                </p>
              </div>
              <div className="p-4 md:p-6 flex justify-center bg-white/[0.015] group-hover:bg-white/[0.03] transition-colors">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/30">
                  <Check size={16} />
                </div>
              </div>
              <div className="p-4 md:p-6 flex justify-center opacity-40">
                {item.manual ? (
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 border border-white/10">
                    <Check size={16} />
                  </div>
                ) : (
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                    <X size={16} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
