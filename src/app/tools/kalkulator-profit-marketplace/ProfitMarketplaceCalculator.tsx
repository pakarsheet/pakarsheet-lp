"use client";

import { useMemo, useState } from "react";
import { ToolLayout, Field, ResultCard, Divider, inputCls, inputWrapCls } from "@/components/tools/ToolLayout";

const PLATFORMS = [
  { id: "shopee", name: "Shopee", fee: 5 },
  { id: "tokopedia", name: "Tokopedia", fee: 3 },
  { id: "tiktok", name: "TikTok Shop", fee: 4.8 },
  { id: "lazada", name: "Lazada", fee: 4 },
  { id: "custom", name: "Custom", fee: 0 },
];

function money(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

function percent(n: number) {
  return n.toFixed(1) + "%";
}

function numberValue(value: string) {
  return Math.max(0, parseFloat(value) || 0);
}

type Health = {
  color: "green" | "yellow" | "red";
  label: string;
};

function getHealth(margin: number, profit: number): Health {
  if (profit <= 0) return { color: "red", label: "Rugi, cek harga atau biaya" };
  if (margin >= 20) return { color: "green", label: "Sehat" };
  if (margin >= 10) return { color: "yellow", label: "Tipis tapi masih jalan" };
  return { color: "red", label: "Terlalu tipis" };
}

export default function ProfitMarketplaceCalculator() {
  const [platformId, setPlatformId] = useState("shopee");
  const [customFee, setCustomFee] = useState("5");
  const [hargaJual, setHargaJual] = useState("120000");
  const [hpp, setHpp] = useState("65000");
  const [qty, setQty] = useState("25");
  const [packaging, setPackaging] = useState("2500");
  const [subsidiOngkir, setSubsidiOngkir] = useState("5000");
  const [voucherSeller, setVoucherSeller] = useState("10000");
  const [biayaIklan, setBiayaIklan] = useState("8000");
  const [biayaAdminTetap, setBiayaAdminTetap] = useState("1000");

  const selectedPlatform = PLATFORMS.find((platform) => platform.id === platformId) ?? PLATFORMS[0];
  const feeRate = platformId === "custom" ? numberValue(customFee) : selectedPlatform.fee;

  const result = useMemo(() => {
    const price = numberValue(hargaJual);
    const cost = numberValue(hpp);
    const units = Math.max(1, numberValue(qty));
    const pack = numberValue(packaging);
    const shipping = numberValue(subsidiOngkir);
    const voucher = numberValue(voucherSeller);
    const ads = numberValue(biayaIklan);
    const fixedAdmin = numberValue(biayaAdminTetap);
    const platformRate = Math.min(100, feeRate) / 100;

    const platformFee = price * platformRate;
    const operationalCost = pack + shipping + voucher + ads + fixedAdmin;
    const totalCostPerUnit = cost + platformFee + operationalCost;
    const profitPerUnit = price - totalCostPerUnit;
    const margin = price > 0 ? (profitPerUnit / price) * 100 : 0;
    const markup = totalCostPerUnit > 0 ? (profitPerUnit / totalCostPerUnit) * 100 : 0;
    const totalRevenue = price * units;
    const totalProfit = profitPerUnit * units;
    const totalPlatformFee = platformFee * units;
    const totalCost = totalCostPerUnit * units;
    const breakEvenPrice = platformRate < 1 ? (cost + operationalCost) / (1 - platformRate) : 0;
    const maxAdSpend = Math.max(0, price - cost - platformFee - pack - shipping - voucher - fixedAdmin);
    const health = getHealth(margin, profitPerUnit);

    return {
      price,
      cost,
      units,
      platformFee,
      operationalCost,
      totalCostPerUnit,
      profitPerUnit,
      margin,
      markup,
      totalRevenue,
      totalProfit,
      totalPlatformFee,
      totalCost,
      breakEvenPrice,
      maxAdSpend,
      health,
      pack,
      shipping,
      voucher,
      ads,
      fixedAdmin,
    };
  }, [
    hargaJual,
    hpp,
    qty,
    packaging,
    subsidiOngkir,
    voucherSeller,
    biayaIklan,
    biayaAdminTetap,
    feeRate,
  ]);

  return (
    <ToolLayout
      title="Kalkulator Profit Marketplace"
      description="Hitung profit bersih jualan marketplace setelah fee platform, HPP, promo seller, subsidi ongkir, packaging, dan biaya iklan."
      relatedProduct={{ name: "Template Marketplace Profit Tracker", href: "/shop" }}
    >
      <div className="mb-6">
        <label className="text-sm font-semibold text-neutral-400 block mb-3">Platform</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setPlatformId(platform.id)}
              className={`py-3 px-3 rounded-2xl text-sm font-semibold border transition-all text-left ${
                platformId === platform.id
                  ? "bg-white text-black border-white"
                  : "bg-white/[0.03] text-neutral-400 border-white/8 hover:border-white/20 hover:text-white"
              }`}
            >
              <span className="block">{platform.name}</span>
              <span className={`block text-xs font-normal mt-0.5 ${platformId === platform.id ? "text-black/60" : "text-neutral-600"}`}>
                {platform.id === "custom" ? "Atur fee" : `Fee ${platform.fee.toFixed(1)}%`}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
        <Field label="Harga Jual per Unit" hint="Harga yang dibayar pembeli sebelum ongkir">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" inputMode="numeric" min="0" value={hargaJual} onChange={(e) => setHargaJual(e.target.value)} className={inputCls} placeholder="120000" />
          </div>
        </Field>

        <Field label="HPP / Modal per Unit" hint="Harga beli atau biaya produksi barang">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" inputMode="numeric" min="0" value={hpp} onChange={(e) => setHpp(e.target.value)} className={inputCls} placeholder="65000" />
          </div>
        </Field>

        <Field label="Jumlah Terjual" hint="Untuk estimasi omzet dan profit total">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Qty</span>
            <input type="number" inputMode="numeric" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className={inputCls} placeholder="25" />
          </div>
        </Field>

        <Field label="Fee Marketplace (%)" hint={platformId === "custom" ? "Isi sesuai fee tokomu" : "Preset bisa diedit dengan pilih Custom"}>
          <div className={inputWrapCls}>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="0.1"
              value={platformId === "custom" ? customFee : feeRate}
              onChange={(e) => setCustomFee(e.target.value)}
              disabled={platformId !== "custom"}
              className={`${inputCls} disabled:text-neutral-500`}
              placeholder="5"
            />
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">%</span>
          </div>
        </Field>

        <Field label="Packaging per Unit" hint="Bubble wrap, kardus, stiker, kartu ucapan">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" inputMode="numeric" min="0" value={packaging} onChange={(e) => setPackaging(e.target.value)} className={inputCls} placeholder="2500" />
          </div>
        </Field>

        <Field label="Subsidi Ongkir per Unit" hint="Isi 0 kalau ongkir ditanggung pembeli">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" inputMode="numeric" min="0" value={subsidiOngkir} onChange={(e) => setSubsidiOngkir(e.target.value)} className={inputCls} placeholder="5000" />
          </div>
        </Field>

        <Field label="Voucher / Diskon Seller" hint="Potongan yang kamu tanggung per unit">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" inputMode="numeric" min="0" value={voucherSeller} onChange={(e) => setVoucherSeller(e.target.value)} className={inputCls} placeholder="10000" />
          </div>
        </Field>

        <Field label="Biaya Iklan per Order" hint="Rata-rata ads spend untuk mendapatkan 1 order">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input type="number" inputMode="numeric" min="0" value={biayaIklan} onChange={(e) => setBiayaIklan(e.target.value)} className={inputCls} placeholder="8000" />
          </div>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Biaya Admin Tetap per Order" hint="Biaya transaksi, asuransi, handling, atau biaya lain yang tetap">
            <div className={inputWrapCls}>
              <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
              <input type="number" inputMode="numeric" min="0" value={biayaAdminTetap} onChange={(e) => setBiayaAdminTetap(e.target.value)} className={inputCls} placeholder="1000" />
            </div>
          </Field>
        </div>
      </div>

      <Divider label="Hasil" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="sm:col-span-2">
          <ResultCard
            label="Profit Bersih per Unit"
            value={money(result.profitPerUnit)}
            sub={`${result.health.label} / margin ${percent(result.margin)}`}
            color={result.health.color}
            large
            highlight
          />
        </div>
        <ResultCard
          label="Total Profit"
          value={money(result.totalProfit)}
          sub={`dari ${result.units} unit terjual`}
          color={result.totalProfit > 0 ? "green" : "red"}
        />
        <ResultCard
          label="Margin Bersih"
          value={percent(result.margin)}
          sub={`Markup ${percent(result.markup)}`}
          color={result.health.color}
        />
        <ResultCard
          label="Harga Break-Even"
          value={money(result.breakEvenPrice)}
          sub="harga minimum agar tidak rugi"
          color="yellow"
        />
        <ResultCard
          label="Batas Biaya Iklan per Order"
          value={money(result.maxAdSpend)}
          sub="agar profit tidak minus"
          color={result.maxAdSpend > result.ads ? "green" : "red"}
        />
      </div>

      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
        <p className="text-sm font-semibold text-neutral-400">Rincian per Unit</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">Harga jual</span>
            <span className="text-neutral-300 font-medium tabular-nums">{money(result.price)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">HPP / modal</span>
            <span className="text-neutral-300 tabular-nums">-{money(result.cost)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">Fee {selectedPlatform.name}</span>
            <span className="text-neutral-300 tabular-nums">-{money(result.platformFee)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">Packaging</span>
            <span className="text-neutral-300 tabular-nums">-{money(result.pack)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">Subsidi ongkir</span>
            <span className="text-neutral-300 tabular-nums">-{money(result.shipping)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">Voucher seller</span>
            <span className="text-neutral-300 tabular-nums">-{money(result.voucher)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">Biaya iklan</span>
            <span className="text-neutral-300 tabular-nums">-{money(result.ads)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-500">Biaya admin tetap</span>
            <span className="text-neutral-300 tabular-nums">-{money(result.fixedAdmin)}</span>
          </div>
          <div className="border-t border-white/5 pt-3 flex justify-between gap-4">
            <span className="text-neutral-400 font-semibold">Profit bersih</span>
            <span className={`font-bold tabular-nums ${result.profitPerUnit > 0 ? "text-green-400" : "text-red-400"}`}>
              {money(result.profitPerUnit)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <p className="text-xs text-neutral-600 mb-1">Omzet Total</p>
          <p className="text-lg font-bold text-white tabular-nums">{money(result.totalRevenue)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <p className="text-xs text-neutral-600 mb-1">Total Fee Platform</p>
          <p className="text-lg font-bold text-white tabular-nums">{money(result.totalPlatformFee)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <p className="text-xs text-neutral-600 mb-1">Total Biaya</p>
          <p className="text-lg font-bold text-white tabular-nums">{money(result.totalCost)}</p>
        </div>
      </div>

      <div className="mt-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-sm text-neutral-400 leading-relaxed">
          <span className="text-white/80 font-semibold">Tips: </span>
          Kalau profit tipis, cek tiga sumber kebocoran paling sering: voucher seller, subsidi ongkir, dan biaya iklan per order.
          Naikkan harga, kurangi promo, atau targetkan iklan dengan CPA lebih rendah.
        </p>
      </div>
    </ToolLayout>
  );
}
