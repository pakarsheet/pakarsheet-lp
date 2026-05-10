"use client";

import { useState, useMemo } from "react";
import { ToolLayout, Field, ResultCard, Divider, inputCls, inputWrapCls } from "@/components/tools/ToolLayout";
import { Settings2, RotateCcw } from "lucide-react";

function fmt(n: number) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }

// ── Default platform presets ───────────────────────────────────────────────────
const DEFAULT_PLATFORMS = [
  { id: "shopee",    name: "Shopee",      serviceFee: 3.0, adminFee: 2.0 },
  { id: "tokopedia", name: "Tokopedia",   serviceFee: 1.8, adminFee: 1.0 },
  { id: "tiktok",    name: "TikTok Shop", serviceFee: 1.8, adminFee: 3.0 },
  { id: "lazada",    name: "Lazada",      serviceFee: 2.0, adminFee: 2.0 },
];

type Platform = typeof DEFAULT_PLATFORMS[number];

// ── Fee editor modal ───────────────────────────────────────────────────────────
function FeeEditor({
  platforms,
  onUpdate,
  onReset,
  onClose,
}: {
  platforms: Platform[];
  onUpdate: (id: string, key: "serviceFee" | "adminFee", val: number) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Kustomisasi Fee Platform</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Fee bisa berubah sewaktu-waktu. Sesuaikan dengan dashboard seller kamu.</p>
          </div>
          <button onClick={onReset} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors">
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        <div className="space-y-5">
          {platforms.map((p) => (
            <div key={p.id} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
              <p className="text-sm font-semibold text-white mb-3">{p.name}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Service Fee (%)</label>
                  <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-white/30 transition-colors">
                    <input
                      type="number" min="0" max="30" step="0.1"
                      value={p.serviceFee}
                      onChange={(e) => onUpdate(p.id, "serviceFee", parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                    />
                    <span className="text-neutral-600 text-xs">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Admin Fee (%)</label>
                  <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-white/30 transition-colors">
                    <input
                      type="number" min="0" max="30" step="0.1"
                      value={p.adminFee}
                      onChange={(e) => onUpdate(p.id, "adminFee", parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                    />
                    <span className="text-neutral-600 text-xs">%</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-neutral-600 mt-2">
                Total fee: <span className="text-neutral-400 font-medium">{(p.serviceFee + p.adminFee).toFixed(1)}%</span>
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-white text-black text-sm font-bold py-3.5 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          Simpan & Tutup
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function HargaJualCalculator() {
  const [modal, setModal] = useState("50000");
  const [targetMargin, setTargetMargin] = useState("20");
  const [ongkir, setOngkir] = useState("0");
  const [packaging, setPackaging] = useState("2000");
  const [platformId, setPlatformId] = useState("shopee");
  const [platforms, setPlatforms] = useState<Platform[]>(DEFAULT_PLATFORMS);
  const [showFeeEditor, setShowFeeEditor] = useState(false);

  const selectedPlatform = platforms.find((p) => p.id === platformId)!;

  const updateFee = (id: string, key: "serviceFee" | "adminFee", val: number) => {
    setPlatforms((prev) => prev.map((p) => p.id === id ? { ...p, [key]: val } : p));
  };

  const resetFees = () => setPlatforms(DEFAULT_PLATFORMS);

  const result = useMemo(() => {
    const m = parseFloat(modal) || 0;
    const margin = parseFloat(targetMargin) || 0;
    const ok = parseFloat(ongkir) || 0;
    const pkg = parseFloat(packaging) || 0;
    const totalFeeRate = (selectedPlatform.serviceFee + selectedPlatform.adminFee) / 100;

    const totalModal = m + ok + pkg;
    const divisor = 1 - totalFeeRate - margin / 100;
    const hargaJual = divisor > 0 ? totalModal / divisor : 0;
    const feePlatform = hargaJual * totalFeeRate;
    const profit = hargaJual - totalModal - feePlatform;
    const actualMargin = hargaJual > 0 ? (profit / hargaJual) * 100 : 0;
    const totalFeeRate100 = (selectedPlatform.serviceFee + selectedPlatform.adminFee);

    return { hargaJual, feePlatform, profit, actualMargin, totalModal, totalFeeRate100 };
  }, [modal, targetMargin, ongkir, packaging, selectedPlatform]);

  return (
    <ToolLayout
      title="Kalkulator Harga Jual Marketplace"
      description="Hitung harga jual minimum di marketplace Indonesia setelah fee platform, ongkir, dan packaging."
      relatedProduct={{ name: "Template Inventory & Sales Tracker", href: "/shop" }}
    >
      {/* Platform selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-neutral-400">Platform</label>
          <button
            onClick={() => setShowFeeEditor(true)}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-lg"
          >
            <Settings2 size={12} /> Kustomisasi Fee
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {platforms.map((p) => {
            const totalFee = p.serviceFee + p.adminFee;
            const isCustom = DEFAULT_PLATFORMS.find((d) => d.id === p.id)
              ? (DEFAULT_PLATFORMS.find((d) => d.id === p.id)!.serviceFee !== p.serviceFee ||
                 DEFAULT_PLATFORMS.find((d) => d.id === p.id)!.adminFee !== p.adminFee)
              : false;
            return (
              <button
                key={p.id}
                onClick={() => setPlatformId(p.id)}
                className={`py-3 px-3 rounded-2xl text-sm font-semibold border transition-all text-left ${
                  platformId === p.id
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.03] text-neutral-400 border-white/8 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className="block">{p.name}</span>
                <span className={`block text-xs font-normal mt-0.5 ${platformId === p.id ? "text-black/60" : "text-neutral-600"}`}>
                  Fee {totalFee.toFixed(1)}%{isCustom ? " ✎" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
        <Field label="Modal / HPP per Unit" hint="Biaya produksi atau harga beli">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" min="0" value={modal} onChange={(e) => setModal(e.target.value)} className={inputCls} placeholder="50.000" />
          </div>
        </Field>

        <Field label="Target Margin (%)" hint="Keuntungan bersih yang kamu inginkan">
          <div className={inputWrapCls}>
            <input type="number" min="0" max="90" value={targetMargin} onChange={(e) => setTargetMargin(e.target.value)} className={inputCls} placeholder="20" />
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">%</span>
          </div>
        </Field>

        <Field label="Subsidi Ongkir per Unit" hint="Isi 0 jika ongkir ditanggung pembeli">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" min="0" value={ongkir} onChange={(e) => setOngkir(e.target.value)} className={inputCls} placeholder="0" />
          </div>
        </Field>

        <Field label="Biaya Packaging per Unit" hint="Bubble wrap, kardus, dll">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" min="0" value={packaging} onChange={(e) => setPackaging(e.target.value)} className={inputCls} placeholder="2.000" />
          </div>
        </Field>
      </div>

      <Divider label="Hasil" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="sm:col-span-2">
          <ResultCard
            label={`Harga Jual Minimum di ${selectedPlatform.name}`}
            value={fmt(result.hargaJual)}
            sub={`Margin aktual: ${result.actualMargin.toFixed(1)}%`}
            color="blue"
            large
            highlight
          />
        </div>
        <ResultCard
          label={`Fee ${selectedPlatform.name}`}
          value={fmt(result.feePlatform)}
          sub={`${result.totalFeeRate100.toFixed(1)}% dari harga jual`}
          color="yellow"
        />
        <ResultCard
          label="Profit Bersih per Unit"
          value={fmt(result.profit)}
          sub="setelah semua biaya & fee"
          color={result.profit > 0 ? "green" : "red"}
        />
        <ResultCard
          label="Total Modal per Unit"
          value={fmt(result.totalModal)}
          sub="HPP + ongkir + packaging"
        />
      </div>

      {/* Fee breakdown */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
        <p className="text-sm font-semibold text-neutral-400 mb-3">Rincian Fee {selectedPlatform.name}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Service Fee</span>
          <span className="text-neutral-300 font-medium">{selectedPlatform.serviceFee.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Admin Fee</span>
          <span className="text-neutral-300 font-medium">{selectedPlatform.adminFee.toFixed(1)}%</span>
        </div>
        <div className="border-t border-white/5 pt-2 flex items-center justify-between text-sm">
          <span className="text-neutral-400 font-semibold">Total Fee</span>
          <span className="text-white font-bold">{result.totalFeeRate100.toFixed(1)}%</span>
        </div>
        <p className="text-xs text-neutral-600 pt-1">
          Fee dapat berubah sewaktu-waktu. Klik <button onClick={() => setShowFeeEditor(true)} className="text-neutral-400 underline underline-offset-2 hover:text-white transition-colors">Kustomisasi Fee</button> untuk menyesuaikan.
        </p>
      </div>

      <div className="mt-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-sm text-neutral-400 leading-relaxed">
          <span className="text-white/80 font-semibold">Tips: </span>
          Harga <span className="text-white/70">{fmt(result.hargaJual)}</span> adalah minimum. Kalau kompetitor jual lebih mahal, naikkan harga dan ambil margin lebih besar. Selalu cek harga kompetitor sebelum listing.
        </p>
      </div>

      {showFeeEditor && (
        <FeeEditor
          platforms={platforms}
          onUpdate={updateFee}
          onReset={resetFees}
          onClose={() => setShowFeeEditor(false)}
        />
      )}
    </ToolLayout>
  );
}
