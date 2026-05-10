"use client";

import { useMemo, useState } from "react";
import { ToolLayout, Field, ResultCard, Divider, inputCls, inputWrapCls } from "@/components/tools/ToolLayout";

function money(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

function pct(n: number) {
  return n.toFixed(1) + "%";
}

function toNumber(value: string) {
  return Math.max(0, parseFloat(value) || 0);
}

export default function DiskonBertingkatCalculator() {
  const [hargaAwal, setHargaAwal] = useState("250000");
  const [diskonPertama, setDiskonPertama] = useState("20");
  const [diskonKedua, setDiskonKedua] = useState("10");
  const [diskonKetiga, setDiskonKetiga] = useState("0");
  const [voucher, setVoucher] = useState("15000");
  const [cashback, setCashback] = useState("5");
  const [ongkir, setOngkir] = useState("12000");
  const [biayaLayanan, setBiayaLayanan] = useState("2000");

  const result = useMemo(() => {
    const awal = toNumber(hargaAwal);
    const discounts = [diskonPertama, diskonKedua, diskonKetiga].map((value) =>
      Math.min(100, toNumber(value))
    );
    const voucherNominal = toNumber(voucher);
    const cashbackRate = Math.min(100, toNumber(cashback));
    const shipping = toNumber(ongkir);
    const serviceFee = toNumber(biayaLayanan);

    const steps = discounts.map((rate, index) => {
      const before = index === 0 ? awal : 0;
      return { rate, before, discount: 0, after: 0 };
    });

    let subtotal = awal;
    const appliedSteps = steps.map((step) => {
      const before = subtotal;
      const discount = before * (step.rate / 100);
      subtotal = Math.max(0, before - discount);
      return { ...step, before, discount, after: subtotal };
    });

    const totalDiskonPersen = awal - subtotal;
    const voucherTerpakai = Math.min(voucherNominal, subtotal);
    const subtotalSetelahVoucher = Math.max(0, subtotal - voucherTerpakai);
    const bayarCheckout = subtotalSetelahVoucher + shipping + serviceFee;
    const cashbackNominal = subtotalSetelahVoucher * (cashbackRate / 100);
    const biayaEfektif = Math.max(0, bayarCheckout - cashbackNominal);
    const hematSebelumCashback = totalDiskonPersen + voucherTerpakai;
    const hematEfektif = hematSebelumCashback + cashbackNominal;
    const diskonEfektif = awal > 0 ? (hematEfektif / awal) * 100 : 0;
    const diskonBertingkatEfektif = awal > 0 ? (totalDiskonPersen / awal) * 100 : 0;

    return {
      awal,
      appliedSteps,
      subtotal,
      totalDiskonPersen,
      voucherTerpakai,
      subtotalSetelahVoucher,
      bayarCheckout,
      cashbackNominal,
      biayaEfektif,
      hematEfektif,
      diskonEfektif,
      diskonBertingkatEfektif,
      shipping,
      serviceFee,
    };
  }, [hargaAwal, diskonPertama, diskonKedua, diskonKetiga, voucher, cashback, ongkir, biayaLayanan]);

  const isFreeAfterVoucher = result.awal > 0 && result.subtotalSetelahVoucher === 0;
  const hasAnyDiscount = result.totalDiskonPersen > 0 || result.voucherTerpakai > 0 || result.cashbackNominal > 0;

  return (
    <ToolLayout
      title="Kalkulator Diskon Bertingkat"
      description="Hitung harga akhir setelah diskon 20% + 10%, voucher, cashback, ongkir, dan biaya layanan. Hasil berubah real-time saat kamu input."
      relatedProduct={{ name: "Template Sales & Promo Tracker - pantau promo dan margin", href: "/shop" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
        <Field label="Harga Awal Barang" hint="Harga sebelum semua promo">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={hargaAwal}
              onChange={(e) => setHargaAwal(e.target.value)}
              className={inputCls}
              placeholder="250000"
            />
          </div>
        </Field>

        <Field label="Voucher Potongan" hint="Potongan nominal setelah diskon persen">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              className={inputCls}
              placeholder="15000"
            />
          </div>
        </Field>

        <Field label="Diskon Pertama" hint="Contoh: promo toko 20%">
          <div className={inputWrapCls}>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              value={diskonPertama}
              onChange={(e) => setDiskonPertama(e.target.value)}
              className={inputCls}
              placeholder="20"
            />
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">%</span>
          </div>
        </Field>

        <Field label="Diskon Kedua" hint="Contoh: voucher platform 10%">
          <div className={inputWrapCls}>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              value={diskonKedua}
              onChange={(e) => setDiskonKedua(e.target.value)}
              className={inputCls}
              placeholder="10"
            />
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">%</span>
          </div>
        </Field>

        <Field label="Diskon Ketiga" hint="Opsional, isi 0 kalau tidak ada">
          <div className={inputWrapCls}>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              value={diskonKetiga}
              onChange={(e) => setDiskonKetiga(e.target.value)}
              className={inputCls}
              placeholder="0"
            />
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">%</span>
          </div>
        </Field>

        <Field label="Cashback" hint="Dihitung dari subtotal setelah voucher">
          <div className={inputWrapCls}>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              value={cashback}
              onChange={(e) => setCashback(e.target.value)}
              className={inputCls}
              placeholder="5"
            />
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">%</span>
          </div>
        </Field>

        <Field label="Ongkir" hint="Isi 0 jika gratis ongkir">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={ongkir}
              onChange={(e) => setOngkir(e.target.value)}
              className={inputCls}
              placeholder="12000"
            />
          </div>
        </Field>

        <Field label="Biaya Layanan" hint="Admin platform, asuransi, handling, dll">
          <div className={inputWrapCls}>
            <span className="text-neutral-500 text-base flex-shrink-0 font-medium">Rp</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={biayaLayanan}
              onChange={(e) => setBiayaLayanan(e.target.value)}
              className={inputCls}
              placeholder="2000"
            />
          </div>
        </Field>
      </div>

      <Divider label="Hasil" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="sm:col-span-2">
          <ResultCard
            label="Biaya Efektif Setelah Cashback"
            value={money(result.biayaEfektif)}
            sub={`Bayar checkout: ${money(result.bayarCheckout)} / cashback: ${money(result.cashbackNominal)}`}
            color={hasAnyDiscount ? "green" : "neutral"}
            large
            highlight
          />
        </div>
        <ResultCard
          label="Subtotal Setelah Diskon"
          value={money(result.subtotal)}
          sub={`Diskon bertingkat efektif: ${pct(result.diskonBertingkatEfektif)}`}
          color="blue"
        />
        <ResultCard
          label="Voucher Terpakai"
          value={money(result.voucherTerpakai)}
          sub={isFreeAfterVoucher ? "Voucher menutup subtotal barang" : "dipotong setelah diskon persen"}
          color="yellow"
        />
        <ResultCard
          label="Total Hemat Efektif"
          value={money(result.hematEfektif)}
          sub={`Setara ${pct(result.diskonEfektif)} dari harga awal`}
          color={hasAnyDiscount ? "green" : "neutral"}
        />
        <ResultCard
          label="Ongkir + Biaya Layanan"
          value={money(result.shipping + result.serviceFee)}
          sub={`${money(result.shipping)} ongkir / ${money(result.serviceFee)} biaya layanan`}
        />
      </div>

      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
        <p className="text-sm font-semibold text-neutral-400">Urutan Perhitungan</p>
        <div className="space-y-2">
          {result.appliedSteps.map((step, index) => (
            <div key={index} className="flex items-start justify-between gap-4 text-sm">
              <span className="text-neutral-500">
                Diskon {index + 1} ({pct(step.rate)})
              </span>
              <span className="text-right text-neutral-300 tabular-nums">
                -{money(step.discount)}
                <span className="block text-xs text-neutral-600">sisa {money(step.after)}</span>
              </span>
            </div>
          ))}
          <div className="border-t border-white/5 pt-3 flex items-start justify-between gap-4 text-sm">
            <span className="text-neutral-500">Voucher nominal</span>
            <span className="text-right text-neutral-300 tabular-nums">
              -{money(result.voucherTerpakai)}
              <span className="block text-xs text-neutral-600">subtotal {money(result.subtotalSetelahVoucher)}</span>
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-neutral-500">Ongkir + biaya layanan</span>
            <span className="text-right text-neutral-300 tabular-nums">+{money(result.shipping + result.serviceFee)}</span>
          </div>
          <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-neutral-500">Cashback diterima</span>
            <span className="text-right text-green-400 tabular-nums">-{money(result.cashbackNominal)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-sm text-neutral-400 leading-relaxed">
          <span className="text-white/80 font-semibold">Catatan: </span>
          Diskon bertingkat dihitung berurutan. Jadi diskon 20% + 10% dari {money(result.awal)} menjadi{" "}
          <span className="text-white/70">{pct(result.diskonBertingkatEfektif)}</span>, bukan langsung 30%.
          Cashback dianggap mengurangi biaya efektif, tetapi biasanya tetap dibayar penuh dulu saat checkout.
        </p>
      </div>
    </ToolLayout>
  );
}
