"use client";

import { useEffect, useState } from "react";
import { Users, Eye, Clock } from "lucide-react";

interface SocialProofBadgeProps {
  clicks?: number;
  socialProofCount?: number | null;
  compact?: boolean;
}

/** Believable random between min and max, seeded by hour so it doesn't jump on every render */
function pseudoRandom(min: number, max: number): number {
  const seed = Math.floor(Date.now() / (1000 * 60 * 30)); // changes every 30 min
  const x = Math.sin(seed) * 10000;
  const frac = x - Math.floor(x);
  return Math.floor(frac * (max - min + 1)) + min;
}

function timeAgo(): string {
  const options = ["2 menit lalu", "5 menit lalu", "12 menit lalu", "23 menit lalu", "1 jam lalu", "2 jam lalu"];
  const seed = Math.floor(Date.now() / (1000 * 60 * 15)); // changes every 15 min
  return options[seed % options.length];
}

export function SocialProofBadge({ clicks = 0, socialProofCount, compact = false }: SocialProofBadgeProps) {
  const [viewers, setViewers] = useState(0);
  const [lastBought, setLastBought] = useState("");

  // Estimate buyer count: use socialProofCount if set, else estimate from clicks
  // Don't show anything if clicks is 0 and no manual count set
  const buyerCount = socialProofCount != null
    ? socialProofCount
    : clicks > 0 ? Math.max(1, Math.floor(clicks * 0.15)) : null;

  useEffect(() => {
    setViewers(pseudoRandom(8, 24));
    setLastBought(timeAgo());

    // Refresh viewers count every 30 seconds for realism
    const id = setInterval(() => {
      setViewers(pseudoRandom(8, 24));
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-xs text-neutral-600">
        {buyerCount != null && (
          <span className="flex items-center gap-1">
            <Users size={11} className="text-neutral-700" />
            {buyerCount.toLocaleString("id-ID")} bisnis
          </span>
        )}
        {viewers > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {viewers} melihat
          </span>
        )}
      </div>
    );
  }

  // If no data at all, render nothing
  if (buyerCount == null && viewers === 0 && !lastBought) return null;

  return (
    <div className="grid grid-cols-1 gap-2">
      {/* Buyer count */}
      {buyerCount != null && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <Users size={14} className="text-white/30 flex-shrink-0" />
          <p className="text-xs text-neutral-400">
            <span className="text-white font-semibold">{buyerCount.toLocaleString("id-ID")} bisnis</span>{" "}
            sudah pakai template ini
          </p>
        </div>
      )}

      {/* Live viewers */}
      {viewers > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <Eye size={14} className="text-white/30 flex-shrink-0" />
          <p className="text-xs text-neutral-400">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white font-semibold">{viewers} orang</span>
            </span>{" "}
            sedang melihat template ini
          </p>
        </div>
      )}

      {/* Last purchased */}
      {lastBought && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <Clock size={14} className="text-white/30 flex-shrink-0" />
          <p className="text-xs text-neutral-400">
            Terakhir dibeli{" "}
            <span className="text-white font-semibold">{lastBought}</span>
          </p>
        </div>
      )}
    </div>
  );
}
