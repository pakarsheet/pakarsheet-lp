"use client";

import { useEffect, useState } from "react";
import { Clock, Flame } from "lucide-react";

interface PriceTimerProps {
  productId: string;
  price: number;
  salePrice?: number | null;
  salePriceUntil?: number | null; // timestamp ms
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fmt(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

/**
 * Persistent per-user timer stored in localStorage.
 * If salePriceUntil is set (admin-controlled), use that.
 * Otherwise fall back to a 48h window from first visit.
 */
function getExpiry(productId: string, salePriceUntil?: number | null): number {
  if (salePriceUntil && salePriceUntil > Date.now()) return salePriceUntil;

  const key = `ps_promo_${productId}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    const ts = parseInt(stored, 10);
    if (!isNaN(ts) && ts > Date.now()) return ts;
  }
  // First visit — set 48h window
  const expiry = Date.now() + 48 * 60 * 60 * 1000;
  localStorage.setItem(key, String(expiry));
  return expiry;
}

export function PriceTimer({ productId, price, salePrice, salePriceUntil }: PriceTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [expired, setExpired] = useState(false);

  const hasDiscount = salePrice != null && salePrice < price;

  useEffect(() => {
    if (!hasDiscount) return;

    const expiry = getExpiry(productId, salePriceUntil);

    const tick = () => {
      const diff = expiry - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft(null);
        return;
      }
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft({ d, h, m, s });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [productId, hasDiscount, salePriceUntil]);

  const displayPrice = hasDiscount && !expired ? salePrice! : price;
  const showOriginal = hasDiscount && !expired;
  const discount = showOriginal ? Math.round(((price - salePrice!) / price) * 100) : 0;

  return (
    <div>
      {/* Price display */}
      <div className="flex items-baseline gap-2.5 flex-wrap mb-3">
        <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
          {fmt(displayPrice)}
        </span>
        {showOriginal && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-600 line-through text-sm">{fmt(price)}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-[11px] font-bold text-green-400">
              -{discount}%
            </span>
          </div>
        )}
      </div>

      {/* Timer */}
      {showOriginal && timeLeft && (
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-orange-500/5 border border-orange-500/15 mb-1">
          <Flame size={14} className="text-orange-400 flex-shrink-0" />
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-500">Harga ini berakhir dalam</span>
            <div className="flex items-center gap-1 font-mono font-bold text-white">
              {timeLeft.d > 0 && <><span className="bg-white/10 px-1.5 py-0.5 rounded">{pad(timeLeft.d)}</span><span className="text-neutral-600">h</span></>}
              <span className="bg-white/10 px-1.5 py-0.5 rounded">{pad(timeLeft.h)}</span>
              <span className="text-neutral-600">:</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded">{pad(timeLeft.m)}</span>
              <span className="text-neutral-600">:</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded">{pad(timeLeft.s)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Expired state */}
      {expired && hasDiscount && (
        <div className="flex items-center gap-2 text-xs text-neutral-600 mb-1">
          <Clock size={11} /> Promo telah berakhir
        </div>
      )}
    </div>
  );
}
