"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Check, ArrowRight, Zap, Star, Building2,
  Clock, RefreshCw, MessageCircle, Send,
  ChevronRight, AlertCircle, Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/hooks/useSettings";

// ─── Types ────────────────────────────────────────────────────────────────────

type Package = "basic" | "pro" | "enterprise";

const PACKAGES = [
  {
    id: "basic" as Package,
    name: "Basic",
    price: "Rp 299.000",
    priceNum: 299000,
    tagline: "Untuk freelancer & solopreneur",
    color: "border-white/10",
    highlight: false,
    deliver: "3 hari kerja",
    revisi: "1x revisi",
    features: [
      "1 sheet utama + 1 dashboard",
      "Maks. 5 kolom otomatis",
      "Apps Script dasar",
      "Support WA 3 hari",
      "1x revisi",
    ],
  },
  {
    id: "pro" as Package,
    name: "Pro",
    price: "Rp 599.000",
    priceNum: 599000,
    tagline: "Untuk UMKM & tim kecil",
    color: "border-white/30",
    highlight: true,
    deliver: "5 hari kerja",
    revisi: "3x revisi",
    features: [
      "Multi-sheet (sampai 5 sheet)",
      "Dashboard visual + chart otomatis",
      "Apps Script lanjutan",
      "Email/WA notifikasi otomatis",
      "Support WA 7 hari",
      "3x revisi",
    ],
  },
  {
    id: "enterprise" as Package,
    name: "Enterprise",
    price: "Custom",
    priceNum: 0,
    tagline: "Untuk perusahaan & tim besar",
    color: "border-white/10",
    highlight: false,
    deliver: "Sesuai scope",
    revisi: "Unlimited revisi",
    features: [
      "Tidak ada batasan sheet/fitur",
      "Integrasi API eksternal",
      "Training 1 jam via Zoom",
      "Unlimited revisi 30 hari",
      "Dedicated support 1 bulan",
    ],
  },
];

const TEAM_SIZES = ["Hanya saya", "2–5 orang", "6–20 orang", "20+ orang"];

const PROCESS_STEPS = [
  { icon: Send, title: "Submit Brief", desc: "Isi form detail kebutuhan kamu. Makin detail makin bagus." },
  { icon: MessageCircle, title: "Review & Konfirmasi", desc: "Kami review dalam 1×24 jam dan konfirmasi scope via WA." },
  { icon: Zap, title: "Build", desc: "Tim kami mulai bangun template sesuai spesifikasi yang disepakati." },
  { icon: Check, title: "Deliver & Revisi", desc: "Template dikirim, kamu bisa request revisi sesuai paket." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomOrderClient() {
  const { waUrl } = useSettings();
  const [selectedPackage, setSelectedPackage] = useState<Package>("pro");
  const [teamSize, setTeamSize] = useState(TEAM_SIZES[0]);
  const [hasMigration, setHasMigration] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    description: "",
    deadline: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastWaHref, setLastWaHref] = useState("");

  const selectedPkg = PACKAGES.find((p) => p.id === selectedPackage)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.description.trim().length < 30) {
      setStatus("error");
      setErrorMsg("Deskripsi terlalu singkat. Ceritakan lebih detail kebutuhan kamu (min. 30 karakter).");
      return;
    }
    const entry = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim(),
      business: form.business.trim(),
      package: selectedPackage,
      teamSize,
      hasMigration,
      description: form.description.trim(),
      deadline: form.deadline,
      status: "new",
      createdAt: Date.now(),
    };

    const waText = encodeURIComponent(
      `Halo Pakarsheet! Saya ingin order template custom.\n\n` +
      `*Nama:* ${entry.name}\n` +
      `*Email:* ${entry.email}\n` +
      `*Bisnis:* ${entry.business}\n` +
      `*Paket:* ${selectedPkg.name} (${selectedPkg.price})\n` +
      `*Tim:* ${teamSize}\n` +
      `*Migrasi data:* ${hasMigration ? "Ya" : "Tidak"}\n` +
      `*Deadline:* ${entry.deadline || "Fleksibel"}\n\n` +
      `*Kebutuhan:*\n${entry.description}`
    );
    const waHref = `${waUrl}?text=${waText}`;
    const waWindow = window.open("about:blank", "_blank");

    setStatus("loading");
    setErrorMsg("");
    setLastWaHref(waHref);

    try {
      if (supabase) {
        const { error } = await supabase.from("custom_orders").insert([entry]);
        if (error) {
          console.warn("Custom order was not saved to Supabase:", error.message);
        }
      }
      setStatus("success");
      if (waWindow) {
        waWindow.location.href = waHref;
      } else {
        window.location.href = waHref;
      }
    } catch (error) {
      console.warn("Custom order submit failed before redirect:", error);
      setStatus("success");
      if (waWindow) {
        waWindow.location.href = waHref;
      } else {
        window.location.href = waHref;
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">

        {/* ── Hero ── */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-neutral-300 mb-6"
          >
            <Sparkles size={14} className="text-yellow-400" />
            Dibuat khusus untuk bisnis kamu
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 leading-[1.1] mb-5"
          >
            Template custom, <br className="hidden md:block" />
            persis kebutuhan kamu.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg leading-relaxed"
          >
            Tidak ada template yang cocok di toko? Kami bangun dari nol sesuai alur kerja bisnis kamu — mulai dari Rp 299rb, deliver dalam hitungan hari.
          </motion.p>
        </div>

        {/* ── Pricing Packages ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {PACKAGES.map((pkg, i) => (
            <motion.button
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative text-left p-7 rounded-[28px] border transition-all duration-200 ${
                selectedPackage === pkg.id
                  ? "border-white bg-white/[0.06] shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                  : `${pkg.color} bg-white/[0.02] hover:bg-white/[0.04]`
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-wider">
                  Paling Populer
                </div>
              )}
              {selectedPackage === pkg.id && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                  <Check size={11} className="text-black" />
                </div>
              )}
              <div className="mb-4">
                {pkg.id === "basic" && <Zap size={20} className="text-yellow-400/60 mb-3" />}
                {pkg.id === "pro" && <Star size={20} className="text-blue-400/60 mb-3" />}
                {pkg.id === "enterprise" && <Building2 size={20} className="text-purple-400/60 mb-3" />}
                <div className="text-2xl font-bold text-white tracking-tight">{pkg.price}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{pkg.tagline}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-600 mb-5 pb-5 border-b border-white/5">
                <span className="flex items-center gap-1"><Clock size={11} /> {pkg.deliver}</span>
                <span className="flex items-center gap-1"><RefreshCw size={11} /> {pkg.revisi}</span>
              </div>
              <ul className="space-y-2.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-neutral-400">
                    <Check size={12} className="text-white/30 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.button>
          ))}
        </div>

        {/* ── Process Steps ── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-3">Proses Kerja</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white/90 tracking-tight">Dari brief ke template dalam 4 langkah</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="relative p-6 rounded-[24px] border border-white/5 bg-white/[0.02]">
                <div className="absolute top-5 right-5 text-[10px] font-bold text-neutral-700">0{i + 1}</div>
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/8 flex items-center justify-center mb-4">
                  <step.icon size={16} className="text-white/40" />
                </div>
                <h4 className="text-sm font-semibold text-white/90 mb-1.5 tracking-tight">{step.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Brief Form ── */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-3">Submit Brief</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white/90 tracking-tight mb-2">
              Ceritakan kebutuhan kamu
            </h2>
            <p className="text-neutral-500 text-sm">Makin detail brief kamu, makin akurat template yang kami buat.</p>
          </div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 rounded-[32px] border border-white/10 bg-white/[0.02] text-center"
            >
              <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                <Check size={24} className="text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white/90 mb-2 tracking-tight">Brief terkirim!</h3>
              <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
                WhatsApp kami akan terbuka sebentar lagi. Kalau tidak otomatis terbuka,{" "}
                <button
                  onClick={() => {
                    if (lastWaHref) window.open(lastWaHref, "_blank");
                    else setStatus("idle");
                  }}
                  className="text-white/60 underline underline-offset-2 hover:text-white transition-colors"
                >
                  klik di sini untuk kirim ulang
                </button>
                .
              </p>
              <p className="text-xs text-neutral-600">Kami akan review dan konfirmasi dalam 1×24 jam.</p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-[32px] border border-white/8 bg-white/[0.02] space-y-5"
            >
              {/* Package selector (recap) */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/8">
                <div>
                  <p className="text-xs text-neutral-600 mb-0.5">Paket dipilih</p>
                  <p className="text-sm font-semibold text-white">{selectedPkg.name} — {selectedPkg.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  Ganti <ChevronRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Nama</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="Budi Santoso"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="budi@bisnis.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Nama Bisnis / Industri</label>
                <input
                  required
                  type="text"
                  value={form.business}
                  onChange={(e) => setForm({ ...form, business: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="Toko Baju Online / Distributor FMCG / dll"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Ukuran Tim</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEAM_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setTeamSize(size)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                          teamSize === size
                            ? "bg-white text-black border-white"
                            : "bg-white/[0.03] text-neutral-400 border-white/8 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors [color-scheme:dark]"
                  />
                  <p className="text-[10px] text-neutral-700 mt-1.5">Kosongkan jika fleksibel</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Deskripsi Kebutuhan <span className="text-neutral-700 normal-case font-normal">(min. 30 karakter)</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  placeholder="Contoh: Saya butuh template untuk tracking stok 3 gudang, laporan otomatis tiap Senin ke email manager, dan dashboard yang bisa dilihat owner tanpa bisa edit data. Saat ini masih pakai Excel manual dan sering error..."
                />
                <p className="text-[10px] text-neutral-700 mt-1.5">{form.description.length} karakter</p>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/8">
                <button
                  type="button"
                  onClick={() => setHasMigration(!hasMigration)}
                  className={`w-10 h-6 rounded-full transition-all flex-shrink-0 relative ${hasMigration ? "bg-white" : "bg-white/10"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${hasMigration ? "left-5" : "left-1"}`} />
                </button>
                <div>
                  <p className="text-sm text-white/80 font-medium">Ada template lama yang mau dimigrasi</p>
                  <p className="text-xs text-neutral-600">Kami bisa migrate data dari Excel/Sheets lama kamu</p>
                </div>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                  <AlertCircle size={12} className="flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-100 transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                {status === "loading" ? (
                  <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Mengirim...</>
                ) : (
                  <><MessageCircle size={15} />Kirim Brief & Lanjut ke WhatsApp</>
                )}
              </button>

              <p className="text-center text-xs text-neutral-600">
                Tidak ada pembayaran di sini. Kami konfirmasi scope dulu via WA sebelum mulai.
              </p>
            </form>
          )}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-20 text-center border-t border-white/5 pt-16">
          <p className="text-neutral-600 text-sm mb-4">Lebih suka lihat template jadi dulu?</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Lihat koleksi template siap pakai <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
