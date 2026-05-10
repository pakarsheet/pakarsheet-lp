"use client";

import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Send, Check, AlertCircle, Lightbulb } from "lucide-react";
import { supabase } from "@/lib/supabase";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const EXAMPLES = [
  "Template manajemen stok toko retail",
  "Laporan keuangan bulanan otomatis",
  "Tracker KPI tim marketing",
  "Invoice & penagihan klien",
];

export function RequestForm() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const [form, setForm] = useState({ email: "", request: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.request.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    const entry = {
      id: crypto.randomUUID(),
      email: form.email.trim(),
      request: form.request.trim(),
      status: "pending",
      createdAt: Date.now(),
    };

    try {
      if (supabase) {
        const { error } = await supabase.from("user_requests").insert([entry]);
        if (error) throw error;
      } else {
        // Fallback: store locally so admin can see it when Supabase is configured
        const existing = JSON.parse(localStorage.getItem("pakarsheet_requests") || "[]");
        localStorage.setItem("pakarsheet_requests", JSON.stringify([entry, ...existing]));
      }
      setStatus("success");
      setForm({ email: "", request: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Gagal mengirim. Coba lagi atau hubungi kami via WhatsApp.");
    }
  };

  return (
    <section id="request" className="py-20 md:py-32 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.012] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          ref={headerRef}
          variants={stagger}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-14"
        >
          <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">
            Request Template
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]">
            Nggak nemu yang kamu cari?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-neutral-400 text-lg leading-relaxed">
            Ceritain kebutuhan bisnis kamu. Kami akan pertimbangkan untuk template berikutnya.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl mx-auto"
        >
          {/* Example chips */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setForm((f) => ({ ...f, request: ex }))}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/8 bg-white/[0.03] text-neutral-500 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
              >
                {ex}
              </button>
            ))}
          </div>

          {status === "success" ? (
            <div className="p-8 rounded-[32px] border border-white/8 bg-white/[0.02] flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Check size={22} className="text-green-400" />
              </div>
              <div>
                <p className="text-white/90 font-semibold mb-1">Request terkirim!</p>
                <p className="text-neutral-500 text-sm">Kami akan review dan kabarin kamu kalau template-nya jadi.</p>
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="text-xs text-neutral-500 hover:text-white transition-colors underline underline-offset-2"
              >
                Kirim request lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-7 rounded-[32px] border border-white/8 bg-white/[0.02] space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Email kamu
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nama@email.com"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Template yang kamu butuhkan
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.request}
                  onChange={(e) => setForm({ ...form, request: e.target.value })}
                  placeholder="Contoh: Template untuk tracking stok barang toko dengan laporan harian otomatis..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                  <AlertCircle size={12} className="flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading" || !form.email || !form.request}
                className="w-full bg-white text-black py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-100 transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                {status === "loading" ? (
                  <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Mengirim...</>
                ) : (
                  <><Send size={15} />Kirim Request</>
                )}
              </button>

              <p className="text-center text-xs text-neutral-600 flex items-center justify-center gap-1.5">
                <Lightbulb size={11} />
                Request populer akan diprioritaskan untuk dibuat
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
