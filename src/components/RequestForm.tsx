"use client";

import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Send, Check, AlertCircle, Mail, MessageSquare, MessageSquarePlus,
  Package, BarChart3, Users, FileText, ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SectionEyebrow } from "./SectionEyebrow";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const EXAMPLES = [
  { icon: Package,    text: "Template manajemen stok toko retail" },
  { icon: BarChart3,  text: "Laporan keuangan bulanan otomatis" },
  { icon: Users,      text: "Tracker KPI tim marketing" },
  { icon: FileText,   text: "Invoice & penagihan klien" },
];

export function RequestForm() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  const [form, setForm] = useState({ email: "", request: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = form.email.trim();
    const requestTrimmed = form.request.trim();
    if (!emailTrimmed || !requestTrimmed) return;
    if (requestTrimmed.length < 20) {
      setStatus("error");
      setErrorMsg("Deskripsi terlalu singkat. Ceritakan lebih detail kebutuhan kamu (min. 20 karakter).");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const entry = {
      id: crypto.randomUUID(),
      email: emailTrimmed,
      request: requestTrimmed,
      status: "pending",
      createdAt: Date.now(),
    };

    try {
      if (supabase) {
        const { error } = await supabase.from("user_requests").insert([entry]);
        if (error) throw error;
      } else {
        const existing = JSON.parse(localStorage.getItem("pakarsheet_requests") || "[]");
        localStorage.setItem("pakarsheet_requests", JSON.stringify([entry, ...existing]));
      }
      setStatus("success");
      setForm({ email: "", request: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Gagal mengirim. Coba lagi beberapa saat atau hubungi kami via email.");
    }
  };

  const remaining = Math.max(0, 20 - form.request.trim().length);

  return (
    <section
      id="request"
      ref={sectionRef}
      className="py-20 md:py-32 border-t border-white/5 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <motion.div variants={fadeUp} className="mb-5">
            <SectionEyebrow icon={MessageSquarePlus} label="Request Template" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-[32px] sm:text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-4 md:mb-6 leading-[1.1]"
          >
            Nggak nemu yang kamu cari?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-neutral-400 text-base sm:text-lg leading-relaxed"
          >
            Ceritain kebutuhan bisnis kamu. Template yang sering di-request akan kami buat duluan.
          </motion.p>
        </motion.div>

        {/* Main grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 sm:gap-5"
        >
          {/* ── Left: inspiration pane ── */}
          <div className="relative rounded-[28px] border border-white/8 bg-gradient-to-b from-white/[0.035] to-white/[0.01] p-6 sm:p-8 overflow-hidden">
            {/* corner glow */}
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative">
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.18em] mb-3">
                Contoh request
              </p>
              <p className="text-white/75 text-[15px] leading-relaxed mb-6">
                Klik salah satu di bawah untuk isi otomatis, atau tulis kebutuhanmu sendiri di form sebelah.
              </p>

              <div className="flex flex-col gap-2">
                {EXAMPLES.map((ex) => {
                  const isActive = form.request === ex.text;
                  return (
                    <button
                      key={ex.text}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, request: isActive ? "" : ex.text }))
                      }
                      className={`group flex items-center gap-3 text-left px-3.5 py-3 rounded-xl border transition-all ${
                        isActive
                          ? "bg-white/10 border-white/25 text-white"
                          : "bg-white/[0.02] border-white/8 text-neutral-400 hover:bg-white/[0.05] hover:border-white/15 hover:text-white/90"
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors ${
                          isActive
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-white/[0.03] border-white/8 text-neutral-500 group-hover:text-white/80"
                        }`}
                      >
                        <ex.icon size={14} />
                      </span>
                      <span className="text-sm font-medium flex-1 truncate">{ex.text}</span>
                      <ArrowRight
                        size={13}
                        className={`flex-shrink-0 transition-all ${
                          isActive ? "text-white translate-x-0" : "text-neutral-700 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2.5 text-xs text-neutral-500">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500/80 border-2 border-[#060606]" />
                  <div className="w-5 h-5 rounded-full bg-violet-500/80 border-2 border-[#060606]" />
                  <div className="w-5 h-5 rounded-full bg-amber-500/80 border-2 border-[#060606]" />
                </div>
                <span>Request populer diprioritaskan untuk dibuat</span>
              </div>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="relative rounded-[28px] border border-white/8 bg-[#0a0a0a] p-6 sm:p-8">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-full min-h-[360px] flex flex-col items-center justify-center text-center gap-5 py-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/25 flex items-center justify-center">
                  <Check size={26} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg mb-1.5">Request terkirim</p>
                  <p className="text-neutral-400 text-sm max-w-xs leading-relaxed">
                    Kami review tiap minggu dan kabarin kamu via email kalau template-nya jadi.
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 text-xs font-semibold text-white/60 hover:text-white transition-colors inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 hover:border-white/20"
                >
                  Kirim request lain <ArrowRight size={11} />
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col h-full gap-5">
                {/* Email */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="req-email" className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.18em]">
                      Email
                    </label>
                    <span className="text-[10px] text-neutral-600">Untuk konfirmasi</span>
                  </div>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none"
                    />
                    <input
                      id="req-email"
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="nama@email.com"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-[15px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                {/* Request */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="req-body" className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.18em]">
                      Template yang dibutuhkan
                    </label>
                    <span
                      className={`text-[10px] font-medium tabular-nums transition-colors ${
                        remaining > 0 ? "text-neutral-600" : "text-green-500/70"
                      }`}
                    >
                      {remaining > 0 ? `Min. ${remaining} karakter lagi` : "Siap dikirim"}
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <MessageSquare
                      size={15}
                      className="absolute left-4 top-4 text-neutral-600 pointer-events-none"
                    />
                    <textarea
                      id="req-body"
                      required
                      rows={5}
                      value={form.request}
                      onChange={(e) => setForm({ ...form, request: e.target.value })}
                      placeholder="Contoh: Template untuk tracking stok barang toko dengan laporan harian otomatis..."
                      className="w-full h-full min-h-[140px] bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 pt-3.5 pb-3 text-[15px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Error */}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 text-red-400 text-[13px] bg-red-500/8 border border-red-500/20 rounded-xl px-3.5 py-2.5 leading-relaxed"
                  >
                    <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                {/* Submit */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={status === "loading" || !form.email || form.request.trim().length < 20}
                    className="group relative w-full bg-white text-black py-4 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-neutral-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] overflow-hidden"
                  >
                    {status === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send size={15} className="transition-transform group-hover:-rotate-12 group-hover:translate-x-0.5" />
                        Kirim Request
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-neutral-600 mt-3">
                    Gratis. Tanpa spam. Kami balas via email dalam 1–3 hari.
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
