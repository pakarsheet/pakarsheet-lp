"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { TrendingUp, TrendingDown } from "lucide-react";

function fmt(n: number) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }

export default function RoasCalculator() {
  const [adSpend, setAdSpend] = useState("500000");
  const [revenue, setRevenue] = useState("2000000");
  const [hpp, setHpp] = useState("300000");
  const [orders, setOrders] = useState("10");

  const result = useMemo(() => {
    const spend = parseFloat(adSpend) || 0;
    const rev = parseFloat(revenue) || 0;
    const cost = parseFloat(hpp) || 0;
    const ord = parseFloat(orders) || 1;

    const roas = spend > 0 ? rev / spend : 0;
    const cpa = ord > 0 ? spend / ord : 0; // cost per acquisition
    const aov = ord > 0 ? rev / ord : 0;   // average order value
    const grossProfit = rev - (cost * ord);
    const netProfit = grossProfit - spend;
    const netRoas = spend > 0 ? netProfit / spend : 0;
    const profitable = netProfit > 0;

    const roasStatus: "good" | "warn" | "bad" =
      roas >= 3 ? "good" : roas >= 2 ? "warn" : "bad";

    const roasLabel =
      roas >= 4 ? "Sangat profitable ✓" :
      roas >= 3 ? "Profitable ✓" :
      roas >= 2 ? "Break-even, perlu optimasi" :
      roas >= 1 ? "Rugi, segera evaluasi" : "Rugi besar";

    return { roas, cpa, aov, grossProfit, netProfit, netRoas, profitable, roasStatus, roasLabel };
  }, [adSpend, revenue, hpp, orders]);

  return (
    <ToolLayout
      title="Kalkulator ROAS Iklan"
      description="Hitung Return on Ad Spend dan apakah iklan Meta Ads, TikTok Ads, atau Google Ads kamu benar-benar profitable."
      relatedProduct={{ name: "Marketing Dashboard Template", href: "/shop" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { label: "Budget Iklan", value: adSpend, onChange: setAdSpend, hint: "Total yang dikeluarkan untuk iklan" },
          { label: "Revenue dari Iklan", value: revenue, onChange: setRevenue, hint: "Total penjualan yang berasal dari iklan" },
          { label: "HPP / Modal per Produk", value: hpp, onChange: setHpp, hint: "Biaya produksi atau harga beli per unit" },
          { label: "Jumlah Order", value: orders, onChange: setOrders, hint: "Total transaksi dari iklan ini", prefix: "Qty" },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">{field.label}</label>
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 focus-within:border-white/30 transition-colors">
              <span className="text-neutral-600 text-sm flex-shrink-0">{field.prefix ?? "Rp"}</span>
              <input
                type="number" min="0" value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                placeholder="0"
              />
            </div>
            {field.hint && <p className="text-[11px] text-neutral-700 mt-1.5">{field.hint}</p>}
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 mb-8" />

      {/* ROAS Hero */}
      <div className={`p-6 rounded-2xl border mb-4 flex items-center justify-between ${
        result.roasStatus === "good" ? "border-green-500/20 bg-green-500/5" :
        result.roasStatus === "warn" ? "border-yellow-500/20 bg-yellow-500/5" :
        "border-red-500/20 bg-red-500/5"
      }`}>
        <div>
          <p className="text-xs text-neutral-500 mb-1">ROAS (Return on Ad Spend)</p>
          <p className="text-4xl font-bold text-white tracking-tight">{result.roas.toFixed(2)}x</p>
          <p className={`text-xs mt-1 ${
            result.roasStatus === "good" ? "text-green-400" :
            result.roasStatus === "warn" ? "text-yellow-400" : "text-red-400"
          }`}>{result.roasLabel}</p>
        </div>
        {result.profitable
          ? <TrendingUp size={32} className="text-green-400/40" />
          : <TrendingDown size={32} className="text-red-400/40" />
        }
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Cost per Order", value: fmt(result.cpa), sub: "biaya dapat 1 pembeli" },
          { label: "Avg. Order Value", value: fmt(result.aov), sub: "rata-rata per transaksi" },
          { label: "Gross Profit", value: fmt(result.grossProfit), sub: "sebelum biaya iklan" },
          { label: "Net Profit", value: fmt(result.netProfit), sub: "setelah biaya iklan" },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-2xl border border-white/8 bg-white/[0.02]">
            <p className="text-[10px] text-neutral-600 mb-1">{item.label}</p>
            <p className={`text-base font-bold tracking-tight ${
              item.label === "Net Profit" && result.netProfit < 0 ? "text-red-400" : "text-white"
            }`}>{item.value}</p>
            <p className="text-[10px] text-neutral-700 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-xs text-neutral-500 leading-relaxed">
          <span className="text-white/70 font-semibold">Benchmark: </span>
          ROAS 3x+ umumnya dianggap profitable untuk e-commerce Indonesia. ROAS 2x berarti kamu hampir break-even setelah HPP. Di bawah 2x, evaluasi targeting, creative, atau harga produk.
        </p>
      </div>
    </ToolLayout>
  );
}
