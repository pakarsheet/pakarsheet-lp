"use client";

import { useState, useMemo } from "react";
import { ToolLayout, Field, ResultCard, Divider, inputCls, inputWrapCls } from "@/components/tools/ToolLayout";
import { TrendingUp, TrendingDown } from "lucide-react";

function fmt(n: number) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }
function pct(n: number) { return n.toFixed(1) + "%"; }

export default function MarginCalculator() {
  const [buyPrice, setBuyPrice] = useState("50000");
  const [sellPrice, setSellPrice] = useState("80000");
  const [opCost, setOpCost] = useState("5000");
  const [units, setUnits] = useState("100");

  const result = useMemo(() => {
    const buy = parseFloat(buyPrice) || 0;
    const sell = parseFloat(sellPrice) || 0;
    const op = parseFloat(opCost) || 0;
    const qty = parseFloat(units) || 1;

    const totalCost = buy + op;
    const profitPerUnit = sell - totalCost;
    const marginPct = sell > 0 ? (profitPerUnit / sell) * 100 : 0;
    const markupPct = totalCost > 0 ? (profitPerUnit / totalCost) * 100 : 0;
    const totalProfit = profitPerUnit * qty;
    const bep = profitPerUnit > 0 ? Math.ceil(totalCost / profitPerUnit) : 0;

    const marginColor: "green" | "yellow" | "red" =
      marginPct >= 20 ? "green" : marginPct >= 10 ? "yellow" : "red";

    const marginLabel =
      marginPct >= 30 ? "Sangat sehat ✓" :
      marginPct >= 20 ? "Sehat ✓" :
      marginPct >= 10 ? "Cukup, bisa ditingkatkan" :
      marginPct > 0 ? "Tipis, perlu evaluasi" : "Rugi";

    return { profitPerUnit, marginPct, markupPct, totalProfit, bep, marginColor, marginLabel, totalCost };
  }, [buyPrice, sellPrice, opCost, units]);

  return (
    <ToolLayout
      title="Kalkulator Margin Keuntungan"
      description="Hitung margin, profit per unit, dan break-even point bisnis kamu secara instan. Hasil berubah real-time saat kamu input."
      relatedProduct={{ name: "Finance Tracker Pro — tracking otomatis setiap bulan", href: "/shop" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
        <Field label="Harga Beli / Modal per Unit" hint="Harga beli dari supplier atau biaya produksi">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" min="0" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className={inputCls} placeholder="50.000" />
          </div>
        </Field>

        <Field label="Harga Jual per Unit" hint="Harga yang kamu jual ke pelanggan">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" min="0" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className={inputCls} placeholder="80.000" />
          </div>
        </Field>

        <Field label="Biaya Operasional per Unit" hint="Ongkir, packaging, fee marketplace, dll">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" min="0" value={opCost} onChange={(e) => setOpCost(e.target.value)} className={inputCls} placeholder="5.000" />
          </div>
        </Field>

        <Field label="Jumlah Unit" hint="Untuk menghitung total profit">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Qty</span>
            <input type="number" min="1" value={units} onChange={(e) => setUnits(e.target.value)} className={inputCls} placeholder="100" />
          </div>
        </Field>
      </div>

      <Divider label="Hasil" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <ResultCard
          label="Profit per Unit"
          value={fmt(result.profitPerUnit)}
          color={result.profitPerUnit > 0 ? "green" : "red"}
          large
        />
        <ResultCard
          label="Margin"
          value={pct(result.marginPct)}
          sub={result.marginLabel}
          color={result.marginColor}
          large
        />
        <ResultCard
          label="Total Profit"
          value={fmt(result.totalProfit)}
          sub={`dari ${units} unit`}
          color={result.totalProfit > 0 ? "green" : "red"}
        />
        <ResultCard
          label="Markup"
          value={pct(result.markupPct)}
          sub="dari total modal"
        />
        <ResultCard
          label="Total Modal per Unit"
          value={fmt(result.totalCost)}
        />
        <ResultCard
          label="Break-Even Point"
          value={result.bep > 0 ? `${result.bep} unit` : "—"}
          sub="unit minimum untuk balik modal"
        />
      </div>

      {/* Profit indicator bar */}
      {parseFloat(sellPrice) > 0 && (
        <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
          <p className="text-sm font-semibold text-neutral-400">Komposisi Harga Jual</p>
          <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
            <div
              className="bg-neutral-600 transition-all duration-500"
              style={{ width: `${Math.max(0, (parseFloat(buyPrice) || 0) / (parseFloat(sellPrice) || 1) * 100)}%` }}
              title="Modal"
            />
            <div
              className="bg-orange-500/70 transition-all duration-500"
              style={{ width: `${Math.max(0, (parseFloat(opCost) || 0) / (parseFloat(sellPrice) || 1) * 100)}%` }}
              title="Biaya Operasional"
            />
            <div
              className="bg-green-500/70 flex-1 transition-all duration-500"
              title="Profit"
            />
          </div>
          <div className="flex items-center gap-5 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-neutral-600 inline-block" />Modal</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500/70 inline-block" />Biaya Ops</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-500/70 inline-block" />Profit</span>
          </div>
        </div>
      )}

      <div className="mt-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-sm text-neutral-400 leading-relaxed">
          <span className="text-white/80 font-semibold">Interpretasi: </span>
          Margin{" "}
          <span className={result.marginColor === "green" ? "text-green-400" : result.marginColor === "yellow" ? "text-yellow-400" : "text-red-400"}>
            {pct(result.marginPct)}
          </span>{" "}
          tergolong <span className="text-white/70">{result.marginLabel.toLowerCase()}</span>.
          Standar industri retail Indonesia umumnya 15–30%. Untuk kuliner/F&B, margin 60–70% adalah normal.
        </p>
      </div>
    </ToolLayout>
  );
}
