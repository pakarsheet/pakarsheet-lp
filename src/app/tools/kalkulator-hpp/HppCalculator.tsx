"use client";

import { useState, useMemo } from "react";
import { ToolLayout, Field, ResultCard, Divider, inputCls, inputWrapCls } from "@/components/tools/ToolLayout";

function fmt(n: number) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }

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
      description="Hitung Harga Pokok Produksi dari bahan baku, tenaga kerja, dan overhead. Tentukan harga jual minimum yang menguntungkan."
      relatedProduct={{ name: "Finance Tracker Pro — tracking HPP otomatis", href: "/shop" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Biaya Bahan Baku per Unit" hint="Semua bahan yang dipakai untuk 1 unit produk">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" inputMode="numeric" min="0" value={bahan} onChange={(e) => setBahan(e.target.value)} className={inputCls} placeholder="30.000" />
          </div>
        </Field>

        <Field label="Biaya Tenaga Kerja per Unit" hint="Upah produksi yang dialokasikan per unit">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" inputMode="numeric" min="0" value={tenagaKerja} onChange={(e) => setTenagaKerja(e.target.value)} className={inputCls} placeholder="10.000" />
          </div>
        </Field>

        <Field label="Biaya Overhead per Unit" hint="Listrik, sewa, penyusutan mesin, dll">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" inputMode="numeric" min="0" value={overhead} onChange={(e) => setOverhead(e.target.value)} className={inputCls} placeholder="5.000" />
          </div>
        </Field>

        <Field label="Target Margin (%)" hint="Keuntungan yang ingin kamu capai">
          <div className={inputWrapCls}>
            <input type="number" inputMode="decimal" min="0" max="99" value={targetMargin} onChange={(e) => setTargetMargin(e.target.value)} className={inputCls} placeholder="30" />
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">%</span>
          </div>
        </Field>
      </div>

      <Divider label="Hasil" />

      {/* HPP Breakdown bar */}
      <div className="mb-6 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-sm font-semibold text-neutral-400 mb-4">Komposisi HPP</p>
        <div className="space-y-4">
          {[
            { label: "Bahan Baku", pct: result.bPct, color: "bg-blue-500" },
            { label: "Tenaga Kerja", pct: result.tkPct, color: "bg-green-500" },
            { label: "Overhead", pct: result.ohPct, color: "bg-orange-500" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-neutral-400">{item.label}</span>
                <span className="text-sm text-neutral-400 font-medium tabular-nums">{item.pct.toFixed(0)}%</span>
              </div>
              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <ResultCard label="HPP per Unit" value={fmt(result.hpp)} large highlight />
        <ResultCard label="Harga Jual Minimum" value={fmt(result.hargaJualMin)} sub={`untuk margin ${targetMargin}%`} color="green" large />
        <ResultCard label="Profit per Unit" value={fmt(result.profitPerUnit)} color={result.profitPerUnit > 0 ? "green" : "red"} />
        <Field label="Jumlah Unit Produksi">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Qty</span>
            <input type="number" inputMode="numeric" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className={inputCls} placeholder="1" />
          </div>
        </Field>
      </div>

      {parseFloat(qty) > 1 && (
        <ResultCard label="Total HPP Produksi" value={fmt(result.totalHpp)} sub={`untuk ${qty} unit`} color="blue" />
      )}

      <div className="mt-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-sm text-neutral-400 leading-relaxed">
          <span className="text-white/80 font-semibold">Catatan: </span>
          HPP <span className="text-white/70">{fmt(result.hpp)}</span> adalah biaya minimum. Harga jual di bawah angka ini berarti rugi. Tambahkan margin sesuai target profitabilitas dan kondisi pasar.
        </p>
      </div>
    </ToolLayout>
  );
}
