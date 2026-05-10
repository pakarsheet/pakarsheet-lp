"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

function fmt(n: number) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }

const PLATFORMS = [
  { id: "shopee", name: "Shopee", fee: 3.0, adminFee: 2.0 },
  { id: "tokopedia", name: "Tokopedia", fee: 1.8, adminFee: 1.0 },
  { id: "tiktok", name: "TikTok Shop", fee: 1.8, adminFee: 3.0 },
  { id: "lazada", name: "Lazada", fee: 2.0, adminFee: 2.0 },
];

export default function HargaJualCalculator() {
  const [modal, setModal] = useState("50000");
  const [targetMargin, setTargetMargin] = useState("20");
  const [ongkir, setOngkir] = useState("0");
  const [packaging, setPackaging] = useState("2000");
  const [platform, setPlatform] = useState("shopee");

  const selectedPlatform = PLATFORMS.find((p) => p.id === platform)!;

  const result = useMemo(() => {
    const m = parseFloat(modal) || 0;
    const margin = parseFloat(targetMargin) || 0;
    const ok = parseFloat(ongkir) || 0;
    const pkg = parseFloat(packaging) || 0;
    const totalFeeRate = (selectedPlatform.fee + selectedPlatform.adminFee) / 100;

    const totalModal = m + ok + pkg;
    // Harga jual = (modal + biaya lain) / (1 - fee platform - margin target)
    const divisor = 1 - totalFeeRate - margin / 100;
    const hargaJual = divisor > 0 ? totalModal / divisor : 0;
    const feePlatform = hargaJual * totalFeeRate;
    const profit = hargaJual - totalModal - feePlatform;
    const actualMargin = hargaJual > 0 ? (profit / hargaJual) * 100 : 0;

    return { hargaJual, feePlatform, profit, actualMargin, totalModal };
  }, [modal, targetMargin, ongkir, packaging, selectedPlatform]);

  return (
    <ToolLayout
      title="Kalkulator Harga Jual Marketplace"
      description="Hitung harga jual minimum di marketplace Indonesia setelah fee platform, ongkir, dan packaging."
      relatedProduct={{ name: "Template Inventory & Sales Tracker", href: "/shop" }}
    >
      {/* Platform selector */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Platform</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                platform === p.id
                  ? "bg-white text-black border-white"
                  : "bg-white/[0.03] text-neutral-400 border-white/8 hover:border-white/20 hover:text-white"
              }`}
            >
              {p.name}
              <span className="block text-[10px] font-normal opacity-60 mt-0.5">
                Fee {p.fee + p.adminFee}%
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { label: "Modal / HPP per Unit", value: modal, onChange: setModal, hint: "Biaya produksi atau harga beli" },
          { label: "Target Margin (%)", value: targetMargin, onChange: setTargetMargin, hint: "Keuntungan yang kamu inginkan", suffix: "%" },
          { label: "Subsidi Ongkir per Unit", value: ongkir, onChange: setOngkir, hint: "Isi 0 jika ongkir ditanggung pembeli" },
          { label: "Biaya Packaging per Unit", value: packaging, onChange: setPackaging, hint: "Bubble wrap, kardus, dll" },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">{field.label}</label>
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 focus-within:border-white/30 transition-colors">
              {!field.suffix && <span className="text-neutral-600 text-sm flex-shrink-0">Rp</span>}
              <input
                type="number" min="0" value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                placeholder="0"
              />
              {field.suffix && <span className="text-neutral-600 text-sm">{field.suffix}</span>}
            </div>
            {field.hint && <p className="text-[11px] text-neutral-700 mt-1.5">{field.hint}</p>}
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 mb-8" />

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="col-span-2 p-6 rounded-2xl border border-white/15 bg-white/[0.04]">
          <p className="text-xs text-neutral-500 mb-1">Harga Jual Minimum di {selectedPlatform.name}</p>
          <p className="text-4xl font-bold text-white tracking-tight">{fmt(result.hargaJual)}</p>
          <p className="text-xs text-neutral-600 mt-1">Margin aktual: {result.actualMargin.toFixed(1)}%</p>
        </div>
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
          <p className="text-xs text-neutral-500 mb-1">Fee {selectedPlatform.name}</p>
          <p className="text-lg font-bold text-white">{fmt(result.feePlatform)}</p>
          <p className="text-[11px] text-neutral-600 mt-0.5">{selectedPlatform.fee + selectedPlatform.adminFee}% dari harga jual</p>
        </div>
        <div className="p-5 rounded-2xl border border-green-500/20 bg-green-500/5">
          <p className="text-xs text-neutral-500 mb-1">Profit Bersih</p>
          <p className="text-lg font-bold text-white">{fmt(result.profit)}</p>
          <p className="text-[11px] text-neutral-600 mt-0.5">per unit terjual</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-xs text-neutral-500 leading-relaxed">
          <span className="text-white/70 font-semibold">Tips: </span>
          Harga {fmt(result.hargaJual)} adalah minimum. Kalau kompetitor jual lebih mahal, kamu bisa naikkan harga dan ambil margin lebih besar. Selalu cek harga kompetitor sebelum listing.
        </p>
        <p className="text-xs text-neutral-600 mt-2">
          * Fee platform bersifat estimasi dan dapat berubah. Cek kebijakan terbaru di dashboard seller masing-masing platform.
        </p>
      </div>
    </ToolLayout>
  );
}
