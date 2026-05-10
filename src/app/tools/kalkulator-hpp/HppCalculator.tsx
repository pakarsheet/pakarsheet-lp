"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

function fmt(n: number) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }

function InputField({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 focus-within:border-white/30 transition-colors">
        <span className="text-neutral-600 text-sm flex-shrink-0">Rp</span>
        <input
          type="number" min="0" value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white focus:outline-none"
          placeholder="0"
        />
      </div>
      {hint && <p className="text-[11px] text-neutral-700 mt-1.5">{hint}</p>}
    </div>
  );
}

export default function HppCalculator() {
  const [bahan, setBahan] = useState("30000");
  const [tenagaKerja, setTenagaKerja] = useState("10000");
  const [overhead, setOverhead] = useState("5000");
  const [targetMargin, setTargetMargin] = useState("30");
  const [qty, setQty] = useState("1");

  const result = useMemo(() => {
    const b = parseFloat(bahan) || 0;
    const tk = parseFloat(tenagaKerja) || 0;
    const oh = parseFloat(overhead) || 0;
    const margin = parseFloat(targetMargin) || 0;
    const q = parseFloat(qty) || 1;

    const hpp = b + tk + oh;
    const hargaJualMin = margin < 100 ? hpp / (1 - margin / 100) : 0;
    const profitPerUnit = hargaJualMin - hpp;
    const totalHpp = hpp * q;

    const bPct = hpp > 0 ? (b / hpp) * 100 : 0;
    const tkPct = hpp > 0 ? (tk / hpp) * 100 : 0;
    const ohPct = hpp > 0 ? (oh / hpp) * 100 : 0;

    return { hpp, hargaJualMin, profitPerUnit, totalHpp, bPct, tkPct, ohPct };
  }, [bahan, tenagaKerja, overhead, targetMargin, qty]);

  return (
    <ToolLayout
      title="Kalkulator HPP"
      description="Hitung Harga Pokok Produksi dari komponen biaya dan tentukan harga jual minimum yang menguntungkan."
      relatedProduct={{ name: "Finance Tracker Pro — tracking HPP otomatis", href: "/shop" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <InputField label="Biaya Bahan Baku per Unit" value={bahan} onChange={setBahan} hint="Semua bahan yang dipakai untuk 1 unit produk" />
        <InputField label="Biaya Tenaga Kerja per Unit" value={tenagaKerja} onChange={setTenagaKerja} hint="Upah produksi yang dialokasikan per unit" />
        <InputField label="Biaya Overhead per Unit" value={overhead} onChange={setOverhead} hint="Listrik, sewa, penyusutan mesin, dll" />
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Target Margin (%)</label>
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 focus-within:border-white/30 transition-colors">
            <input
              type="number" min="0" max="99" value={targetMargin}
              onChange={(e) => setTargetMargin(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white focus:outline-none"
              placeholder="30"
            />
            <span className="text-neutral-600 text-sm">%</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 mb-8" />

      {/* HPP Breakdown */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-widest mb-3">Komposisi HPP</p>
        <div className="space-y-2">
          {[
            { label: "Bahan Baku", pct: result.bPct, color: "bg-blue-500" },
            { label: "Tenaga Kerja", pct: result.tkPct, color: "bg-green-500" },
            { label: "Overhead", pct: result.ohPct, color: "bg-orange-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs text-neutral-500 w-28 flex-shrink-0">{item.label}</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
              </div>
              <span className="text-xs text-neutral-500 w-10 text-right">{item.pct.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.02] col-span-2">
          <p className="text-xs text-neutral-500 mb-1">HPP per Unit</p>
          <p className="text-3xl font-bold text-white tracking-tight">{fmt(result.hpp)}</p>
        </div>
        <div className="p-5 rounded-2xl border border-green-500/20 bg-green-500/5">
          <p className="text-xs text-neutral-500 mb-1">Harga Jual Minimum</p>
          <p className="text-xl font-bold text-white tracking-tight">{fmt(result.hargaJualMin)}</p>
          <p className="text-[11px] text-neutral-600 mt-1">untuk margin {targetMargin}%</p>
        </div>
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
          <p className="text-xs text-neutral-500 mb-1">Profit per Unit</p>
          <p className="text-xl font-bold text-white tracking-tight">{fmt(result.profitPerUnit)}</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-xs text-neutral-500 leading-relaxed">
          <span className="text-white/70 font-semibold">Catatan: </span>
          HPP {fmt(result.hpp)} ini adalah biaya minimum. Harga jual di bawah angka ini berarti rugi. Tambahkan margin sesuai target profitabilitas dan kondisi pasar.
        </p>
      </div>
    </ToolLayout>
  );
}
