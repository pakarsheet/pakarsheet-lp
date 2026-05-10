"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function fmt(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

function pct(n: number) {
  return n.toFixed(1) + "%";
}

function InputField({
  label, value, onChange, prefix = "Rp", hint,
}: {
  label: string; value: string; onChange: (v: string) => void; prefix?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 focus-within:border-white/30 transition-colors">
        <span className="text-neutral-600 text-sm flex-shrink-0">{prefix}</span>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white focus:outline-none"
          placeholder="0"
        />
      </div>
      {hint && <p className="text-[11px] text-neutral-700 mt-1.5">{hint}</p>}
    </div>
  );
}

function ResultCard({
  label, value, sub, status,
}: {
  label: string; value: string; sub?: string; status?: "good" | "warn" | "bad" | "neutral";
}) {
  const colors = {
    good: "border-green-500/20 bg-green-500/5",
    warn: "border-yellow-500/20 bg-yellow-500/5",
    bad: "border-red-500/20 bg-red-500/5",
    neutral: "border-white/8 bg-white/[0.02]",
  };
  const Icon = status === "good" ? TrendingUp : status === "bad" ? TrendingDown : Minus;
  const iconColor = status === "good" ? "text-green-400" : status === "bad" ? "text-red-400" : "text-neutral-600";

  return (
    <div className={`p-5 rounded-2xl border ${colors[status ?? "neutral"]}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-xs text-neutral-500 font-medium">{label}</p>
        <Icon size={14} className={iconColor} />
      </div>
      <p className="text-xl font-bold text-white tracking-tight">{value}</p>
      {sub && <p className="text-[11px] text-neutral-600 mt-1">{sub}</p>}
    </div>
  );
}

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

    const marginStatus: "good" | "warn" | "bad" =
      marginPct >= 20 ? "good" : marginPct >= 10 ? "warn" : "bad";

    const marginLabel =
      marginPct >= 30 ? "Sangat sehat ✓" :
      marginPct >= 20 ? "Sehat ✓" :
      marginPct >= 10 ? "Cukup, bisa ditingkatkan" :
      marginPct > 0 ? "Tipis, perlu evaluasi" : "Rugi";

    return { profitPerUnit, marginPct, markupPct, totalProfit, bep, marginStatus, marginLabel, totalCost };
  }, [buyPrice, sellPrice, opCost, units]);

  return (
    <ToolLayout
      title="Kalkulator Margin Keuntungan"
      description="Hitung margin, profit per unit, dan break-even point bisnis kamu secara instan. Hasil berubah real-time saat kamu input."
      relatedProduct={{ name: "Finance Tracker Pro — tracking otomatis setiap bulan", href: "/shop" }}
    >
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <InputField
          label="Harga Beli / Modal per Unit"
          value={buyPrice}
          onChange={setBuyPrice}
          hint="Harga beli dari supplier atau biaya produksi"
        />
        <InputField
          label="Harga Jual per Unit"
          value={sellPrice}
          onChange={setSellPrice}
          hint="Harga yang kamu jual ke pelanggan"
        />
        <InputField
          label="Biaya Operasional per Unit"
          value={opCost}
          onChange={setOpCost}
          hint="Ongkir, packaging, fee marketplace, dll"
        />
        <InputField
          label="Jumlah Unit"
          value={units}
          onChange={setUnits}
          prefix="Qty"
          hint="Untuk hitung total profit"
        />
      </div>

      {/* Divider */}
      <div className="border-t border-white/5 mb-8" />

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <ResultCard
          label="Profit per Unit"
          value={fmt(result.profitPerUnit)}
          status={result.profitPerUnit > 0 ? "good" : "bad"}
        />
        <ResultCard
          label="Margin"
          value={pct(result.marginPct)}
          sub={result.marginLabel}
          status={result.marginStatus}
        />
        <ResultCard
          label="Markup"
          value={pct(result.markupPct)}
          sub="dari total modal"
          status="neutral"
        />
        <ResultCard
          label="Total Profit"
          value={fmt(result.totalProfit)}
          sub={`dari ${units} unit`}
          status={result.totalProfit > 0 ? "good" : "bad"}
        />
        <ResultCard
          label="Total Modal per Unit"
          value={fmt(result.totalCost)}
          status="neutral"
        />
        <ResultCard
          label="Break-Even Point"
          value={result.bep > 0 ? `${result.bep} unit` : "—"}
          sub="unit minimum untuk balik modal"
          status="neutral"
        />
      </div>

      {/* Interpretation */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-xs text-neutral-500 leading-relaxed">
          <span className="text-white/70 font-semibold">Interpretasi: </span>
          Margin {pct(result.marginPct)} ini tergolong{" "}
          <span className={
            result.marginPct >= 20 ? "text-green-400" :
            result.marginPct >= 10 ? "text-yellow-400" : "text-red-400"
          }>
            {result.marginLabel.toLowerCase()}
          </span>
          . Standar industri retail Indonesia umumnya 15–30%. Untuk kuliner/F&B, margin 60–70% adalah normal karena biaya produksi rendah.
        </p>
      </div>
    </ToolLayout>
  );
}
