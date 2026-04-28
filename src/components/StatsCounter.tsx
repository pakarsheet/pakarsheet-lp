"use client"

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString('id-ID'));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, count, value]);

  return <span ref={ref}>{prefix}<motion.span>{rounded}</motion.span>{suffix}</span>;
}

const stats = [
  { label: "Pengguna Aktif", value: 850, suffix: "+" },
  { label: "Data Terproses", value: 125000, suffix: "+" },
  { label: "Jam Dihemat", value: 1200, suffix: " jam" },
  { label: "Rating Kepuasan", value: 4.9, suffix: "/5" }
];

import { SpotlightCard } from "./SpotlightCard";

export function StatsCounter() {
  return (
    <section className="py-32 border-y border-white/5 bg-black/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, i) => (
            <SpotlightCard key={i} className="p-8 rounded-[32px] border border-white/5 bg-white/[0.02] flex flex-col items-center text-center">
              <div className="text-4xl md:text-5xl font-semibold text-white/90 mb-3 tracking-tight">
                {stat.label === "Rating Kepuasan" ? (
                   <span>4.9<span className="text-lg text-neutral-500 ml-1">/5</span></span>
                ) : (
                   <Counter value={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div className="text-[11px] font-medium text-neutral-500 tracking-tight">
                {stat.label}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
