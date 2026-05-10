"use client";

import { useState, useMemo } from "react";
import { ToolLayout, Field, ResultCard, Divider, inputCls, inputWrapCls } from "@/components/tools/ToolLayout";
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
    const cpa = ord > 0 ? spend / ord : 0;
    const aov = ord > 0 ? rev / ord : 0;
    const grossProfit = rev - (cost * ord);
    const netProfit = grossProfit - spend;
    const profitable = netProfit > 0;

    const roasColor: "green" | "yellow" | "red" =
      roas >= 3 ? "green" : roas >= 2 ? "yellow" : "red";

    const roasLabel =
      roas >= 4 ? "Sangat profitable ✓" :
      roas >= 3 ? "Profitable ✓" :
      roas >= 2 ? "Break-even, perlu optimasi" :
      roas >= 1 ? "Rugi, segera evaluasi" : "Rugi besar";

    return { roas, cpa, aov, grossProfit, netProfit, profitable, roasColor, roasLabel };
  }, [adSpend, revenue, hpp, orders]);

  return (
    <ToolLayout
      title="Kalkulator ROAS Iklan"
      description="Hitung Return on Ad Spend dan apakah iklan Meta Ads, TikTok Ads, atau Google Ads kamu benar-benar profitable."
      relatedProduct={{ name: "Marketing Dashboard Template", href: "/shop" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Budget Iklan" hint="Total yang dikeluarkan untuk iklan">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" min="0" value={adSpend} onChange={(e) => setAdSpend(e.target.value)} className={inputCls} placeholder="500.000" />
          </div>
        </Field>

        <Field label="Revenue dari Iklan" hint="Total penjualan yang berasal dari iklan">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" min="0" value={revenue} onChange={(e) => setRevenue(e.target.value)} className={inputCls} placeholder="2.000.000" />
          </div>
        </Field>

        <Field label="HPP / Modal per Produk" hint="Biaya produksi atau harga beli per unit">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" min="0" value={hpp} onChange={(e) => setHpp(e.target.value)} className={inputCls} placeholder="300.000" />
          </div>
        </Field>

        <Field label="Jumlah Order" hint="Total transaksi dari iklan ini">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Qty</span>
            <input type="number" min="1" value={orders} onChange={(e) => setOrders(e.target.value)} className={inputCls} placeholder="10" />
          </div>
        </Field>
      </div>

      <Divider label="Hasil" />

      {/* ROAS Hero */}
      <div className={`p-7 rounded-2xl border mb-5 flex items-center justify-between ${
        result.roasColor === "green" ? "border-green-500/25 bg-green-500/[0.06]" :
        result.roasColor === "yellow" ? "border-yellow-500/25 bg-yellow-500/[0.06]" :
        "border-red-500/25 bg-red-500/[0.06]"
      }`}>
        <div>
          <p className="text-sm text-neutral-500 mb-2 font-medium">ROAS (Return on Ad Spend)</p>
          <p className="text-5xl font-bold text-white tracking-tight">{result.roas.toFixed(2)}x</p>
          <p className={`text-sm mt-2 font-medium ${
            result.roasColor === "green" ? "text-green-400" :
            result.roasColor === "yellow" ? "text-yellow-400" : "text-red-400"
          }`}>{result.roasLabel}</p>
        </div>
        {result.profitable
          ? <TrendingUp size={48} className="text-green-400/30" />
          : <TrendingDown size={48} className="text-red-400/30" />
        }
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <ResultCard label="Cost per Order" value={fmt(result.cpa)} sub="biaya dapat 1 pembeli" />
        <ResultCard label="Avg. Order Value" value={fmt(result.aov)} sub="rata-rata per transaksi" />
        <ResultCard
          label="Gross Profit"
          value={fmt(result.grossProfit)}
          sub="sebelum biaya iklan"
          color={result.grossProfit > 0 ? "green" : "red"}
        />
        <ResultCard
          label="Net Profit"
          value={fmt(result.netProfit)}
          sub="setelah biaya iklan"
          color={result.netProfit > 0 ? "green" : "red"}
        />
      </div>

      {/* ROAS scale visual */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 mb-4">
        <p className="text-sm font-semibold text-neutral-400 mb-3">Skala ROAS</p>
        <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-red-500/40 via-yellow-500/40 to-green-500/40">
          <div
            className="absolute top-0 h-full w-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-500"
            style={{ left: `${Math.min(95, (result.roas / 5) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-600 mt-2">
          <span>0x</span>
          <span>1x</span>
          <span className="text-yellow-600">2x</span>
          <span className="text-green-600">3x</span>
          <span className="text-green-500">5x+</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-sm text-neutral-400 leading-relaxed">
          <span className="text-white/80 font-semibold">Benchmark: </span>
          ROAS 3x+ umumnya dianggap profitable untuk e-commerce Indonesia. ROAS 2x berarti hampir break-even setelah HPP. Di bawah 2x, evaluasi targeting, creative, atau harga produk.
        </p>
      </div>
    </ToolLayout>
  );
}
