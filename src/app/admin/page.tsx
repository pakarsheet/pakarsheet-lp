"use client";

import { useState, useRef, useEffect } from "react";
import { useData } from "@/hooks/useData";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Lock, Edit3, Package, X,
  MousePointerClick, MessageSquare, BookOpen,
  Settings as SettingsIcon, Mail, LayoutDashboard,
  Globe, Star, Check, AlertCircle, Save,
  ExternalLink, Video, ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Keuangan", "Marketing", "Inventory", "HR & Admin", "Lainnya"];
type Tab = "dashboard" | "products" | "testimonials" | "academy" | "requests" | "settings";
const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",    label: "Dashboard",  icon: LayoutDashboard },
  { id: "products",     label: "Produk",     icon: Package },
  { id: "testimonials", label: "Testimoni",  icon: MessageSquare },
  { id: "academy",      label: "Academy",    icon: BookOpen },
  { id: "requests",     label: "Requests",   icon: Mail },
  { id: "settings",     label: "Settings",   icon: SettingsIcon },
];

// ─── Shared Primitives ────────────────────────────────────────────────────────
const inputCls = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors";
const labelCls = "block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className={labelCls}>{label}</label>{children}</div>;
}

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-8 gap-4">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function AddButton({ onClick, label = "Tambah" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors flex-shrink-0">
      <Plus size={15} /> {label}
    </button>
  );
}

function StatCard({ title, value, icon: Icon, sub }: { title: string; value: string | number; icon: React.ElementType; sub?: string }) {
  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{title}</span>
        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-neutral-500">
          <Icon size={14} />
        </div>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      {sub && <p className="text-xs text-neutral-600 mt-1">{sub}</p>}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/8 rounded-2xl">
      <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center mb-3">
        <Package size={18} className="text-neutral-700" />
      </div>
      <p className="text-neutral-600 text-sm">{message}</p>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-white/[0.02] animate-pulse" />)}
    </div>
  );
}

function SubmitBtn({ loading, success, label }: { loading: boolean; success: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="w-full bg-white text-black text-sm font-bold py-3.5 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
      {loading ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Menyimpan...</>
        : success ? <><Check size={15} />Tersimpan!</>
        : label}
    </button>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 z-50" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 280 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/8 z-[60] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
              <h2 className="text-sm font-semibold text-white">{title}</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors">
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      if (res.ok) onLogin(); else setErr("Password salah.");
    } catch { setErr("Gagal terhubung."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black font-black">P</div>
          <span className="font-bold text-white">Pakarsheet Admin</span>
        </div>
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-7">
          <h2 className="text-base font-bold text-white mb-1">Masuk ke Dashboard</h2>
          <p className="text-sm text-neutral-500 mb-6">Masukkan password admin untuk melanjutkan.</p>
          <form onSubmit={submit} className="space-y-4">
            <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} autoFocus />
            {err && <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5"><AlertCircle size={12} />{err}</div>}
            <button type="submit" disabled={loading || !pw} className="w-full bg-white text-black text-sm font-bold py-3.5 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Memverifikasi...</> : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { products, testimonials, tutorials, userRequests, settings, isLoading, saveToSupabase, deleteFromSupabase, fetchData } = useData();

  useEffect(() => {
    fetch("/api/admin/auth", { method: "GET" })
      .then((r) => { if (r.ok) setAuthed(true); })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  const logout = async () => { await fetch("/api/admin/auth", { method: "DELETE" }); setAuthed(false); };

  if (!checked) return null;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const pending = userRequests.filter((r) => r.status === "pending").length;

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "flex flex-col h-full" : "flex flex-col h-full"}>
      <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-black text-sm flex-shrink-0">P</div>
          <div><div className="text-sm font-bold text-white leading-tight">Pakarsheet</div><div className="text-[10px] text-neutral-600">Admin Panel</div></div>
        </Link>
        {mobile && <button onClick={() => setMobileOpen(false)} className="text-neutral-500 hover:text-white"><X size={18} /></button>}
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = tab === item.id;
          return (
            <button key={item.id} onClick={() => { setTab(item.id); if (mobile) setMobileOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? "bg-white/10 text-white font-medium" : "text-neutral-500 hover:text-white hover:bg-white/5"}`}>
              <div className="flex items-center gap-3">
                <item.icon size={15} className={active ? "text-white" : "text-neutral-600"} />
                {item.label}
              </div>
              <div className="flex items-center gap-1.5">
                {item.id === "requests" && pending > 0 && (
                  <span className="text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/25 px-1.5 py-0.5 rounded-full">{pending}</span>
                )}
                {active && <ChevronRight size={13} className="text-neutral-600" />}
              </div>
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-3 border-t border-white/8 space-y-0.5">
        <Link href="/" target="_blank" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-500 hover:text-white hover:bg-white/5 transition-colors">
          <Globe size={15} className="text-neutral-600" />Lihat Website
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-500 hover:text-red-400 hover:bg-red-500/5 transition-colors">
          <Lock size={15} className="text-neutral-600" />Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      {/* Desktop Sidebar */}
      <aside className="w-56 border-r border-white/8 bg-[#0a0a0a] fixed h-full z-40 hidden md:block">
        <Sidebar />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a] border-b border-white/8 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black font-black text-xs">P</div>
          <span className="text-sm font-bold text-white">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white transition-colors">
          <LayoutDashboard size={17} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="md:hidden fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 28, stiffness: 280 }} className="md:hidden fixed top-0 left-0 h-full w-60 bg-[#0a0a0a] border-r border-white/8 z-[60]">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 md:ml-56 pt-14 md:pt-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-8">
          <AnimatePresence mode="wait">
            {tab === "dashboard"    && <DashboardTab    key="d" products={products} userRequests={userRequests} testimonials={testimonials} />}
            {tab === "products"     && <ProductsTab     key="p" products={products} isLoading={isLoading} saveToSupabase={saveToSupabase} deleteFromSupabase={deleteFromSupabase} fetchData={fetchData} />}
            {tab === "testimonials" && <TestimonialsTab key="t" testimonials={testimonials} isLoading={isLoading} saveToSupabase={saveToSupabase} deleteFromSupabase={deleteFromSupabase} />}
            {tab === "academy"      && <AcademyTab      key="a" tutorials={tutorials} isLoading={isLoading} saveToSupabase={saveToSupabase} deleteFromSupabase={deleteFromSupabase} />}
            {tab === "requests"     && <RequestsTab     key="r" userRequests={userRequests} isLoading={isLoading} saveToSupabase={saveToSupabase} deleteFromSupabase={deleteFromSupabase} />}
            {tab === "settings"     && <SettingsTab     key="s" settings={settings} saveToSupabase={saveToSupabase} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab({ products, userRequests, testimonials }: { products: any[]; userRequests: any[]; testimonials: any[] }) {
  const totalClicks = products.reduce((acc: number, p: any) => acc + (p.clicks || 0), 0);
  const pending = userRequests.filter((r: any) => r.status === "pending").length;
  const chartData = products.slice(0, 7).map((p: any) => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + "…" : p.name,
    clicks: p.clicks || 0,
  }));

  return (
    <motion.div key="dashboard" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Dashboard" subtitle="Ringkasan performa toko" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Produk"    value={products.length} icon={Package}          sub="Produk aktif di toko" />
        <StatCard title="Total Klik"      value={totalClicks}     icon={MousePointerClick} sub="Akumulasi semua produk" />
        <StatCard title="Pending Request" value={pending}         icon={Mail}             sub="Menunggu ditinjau" />
      </div>

      {chartData.length > 0 && (
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">Klik per Produk</h2>
            <span className="text-xs text-neutral-600">{products.length} produk</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="#444" tick={{ fontSize: 11, fill: "#555" }} />
              <YAxis stroke="#444" tick={{ fontSize: 11, fill: "#555" }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 12 }} />
              <Area type="monotone" dataKey="clicks" stroke="#3b82f6" fill="url(#cg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Produk Terpopuler</h2>
          {products.length === 0 ? <p className="text-neutral-600 text-sm">Belum ada produk.</p> : (
            <div className="space-y-3">
              {[...products].sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-300 truncate">{p.name}</span>
                  <span className="text-xs font-semibold text-blue-400 flex-shrink-0">{p.clicks || 0} klik</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Testimoni Terbaru</h2>
          {testimonials.length === 0 ? <p className="text-neutral-600 text-sm">Belum ada testimoni.</p> : (
            <div className="space-y-3">
              {testimonials.slice(0, 3).map((t: any) => (
                <div key={t.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0">{t.name.charAt(0)}</div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{t.name}</p>
                    <p className="text-xs text-neutral-500 line-clamp-1">{t.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Image Slot Type ──────────────────────────────────────────────────────────
type ImageSlot = { type: "existing"; url: string } | { type: "new"; preview: string; file: File };

// ─── Products Tab ─────────────────────────────────────────────────────────────
function ProductsTab({ products, isLoading, saveToSupabase, deleteFromSupabase, fetchData }: any) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
  const [slots, setSlots] = useState<ImageSlot[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => { setOpen(false); setEditing(null); setForm({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" }); setSlots([]); setUploadErr(null); };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: p.price.toString(), lynkUrl: p.lynkUrl || "", category: p.category });
    const urls: string[] = p.images || (p.image ? [p.image] : []);
    setSlots(urls.map((url) => ({ type: "existing" as const, url })));
    setUploadErr(null); setOpen(true);
  };

  const addFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setSlots((prev) => [...prev, { type: "new" as const, preview: reader.result as string, file }]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slots.length === 0) return alert("Pilih minimal satu gambar.");
    setSubmitting(true); setUploadErr(null);
    const urls: string[] = [];
    for (const slot of slots) {
      if (slot.type === "existing") { urls.push(slot.url); continue; }
      if (!supabase) { urls.push(slot.preview); continue; }
      const ext = slot.file.name.split(".").pop() || "jpg";
      const path = `product-images/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error: se } = await supabase.storage.from("products").upload(path, slot.file, { upsert: false });
      if (se) { setUploadErr(`Gagal upload: ${se.message}`); setSubmitting(false); return; }
      const { data: ud } = supabase.storage.from("products").getPublicUrl(path);
      urls.push(ud.publicUrl);
    }
    const data = { id: editing?.id || crypto.randomUUID(), name: form.name, description: form.description, price: parseInt(form.price || "0", 10), images: urls, lynkUrl: form.lynkUrl, category: form.category, createdAt: editing?.createdAt || Date.now(), clicks: editing?.clicks || 0 };
    const result = await saveToSupabase("products", data);
    await fetchData();
    setSubmitting(false);
    if (result?.ok === false) { setUploadErr(`Gagal simpan: ${result.error}`); return; }
    setOk(true); setTimeout(() => { setOk(false); reset(); }, 1200);
  };

  return (
    <motion.div key="products" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Produk" subtitle={`${products.length} produk tersedia`} action={<AddButton onClick={() => { setEditing(null); setOpen(true); }} />} />
      {isLoading ? <LoadingRows /> : products.length === 0 ? <EmptyState message="Belum ada produk. Tambah produk pertama kamu." /> : (
        <div className="space-y-2">
          {products.map((p: any) => (
            <div key={p.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-4 flex items-center gap-4 group hover:border-white/15 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-neutral-900 relative overflow-hidden flex-shrink-0 border border-white/8">
                {(p.images?.[0] || p.image) && <Image src={p.images?.[0] || p.image} alt={p.name} fill className="object-cover" unoptimized />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{p.category} · Rp {p.price.toLocaleString("id-ID")} · {p.clicks || 0} klik</p>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"><Edit3 size={14} /></button>
                <button onClick={() => window.confirm("Hapus produk ini?") && deleteFromSupabase("products", p.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Drawer open={open} onClose={reset} title={editing ? "Edit Produk" : "Tambah Produk"}>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Field label={`Foto Produk (${slots.length})`}>
            {uploadErr && <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mb-3"><AlertCircle size={12} />{uploadErr}</div>}
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-900 border border-white/8 group/img">
                  <Image src={slot.type === "existing" ? slot.url : slot.preview} alt="" fill className="object-cover" unoptimized />
                  <span className={`absolute top-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white ${slot.type === "existing" ? "bg-blue-500/80" : "bg-green-500/80"}`}>{slot.type === "existing" ? "SAVED" : "NEW"}</span>
                  <button type="button" onClick={() => setSlots((prev) => prev.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"><X size={10} /></button>
                </div>
              ))}
              <button type="button" onClick={() => fileRef.current?.click()} className="aspect-square rounded-lg border-2 border-dashed border-white/10 hover:border-white/25 bg-white/[0.02] flex flex-col items-center justify-center text-neutral-600 hover:text-neutral-400 transition-colors">
                <Plus size={18} /><span className="text-[9px] mt-1 font-semibold uppercase tracking-wider">Foto</span>
              </button>
            </div>
            <input ref={fileRef} type="file" className="hidden" accept="image/*" multiple onChange={(e) => e.target.files && addFiles(e.target.files)} />
          </Field>
          <Field label="Nama Produk"><input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Finance Tracker Pro" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kategori">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls + " appearance-none"}>
                {CATEGORIES.map((c) => <option key={c} value={c} className="bg-black">{c}</option>)}
              </select>
            </Field>
            <Field label="Harga (Rp)"><input required type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, "") })} className={inputCls} placeholder="250000" /></Field>
          </div>
          <Field label="Link Lynk.id"><input required type="url" value={form.lynkUrl} onChange={(e) => setForm({ ...form, lynkUrl: e.target.value })} className={inputCls} placeholder="https://lynk.id/..." /></Field>
          <Field label="Deskripsi"><textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls + " resize-none"} placeholder="Deskripsi singkat produk..." /></Field>
          <div className="pt-1"><SubmitBtn loading={submitting} success={ok} label={editing ? "Update Produk" : "Simpan Produk"} /></div>
        </form>
      </Drawer>
    </motion.div>
  );
}

// ─── Testimonials Tab ─────────────────────────────────────────────────────────
function TestimonialsTab({ testimonials, isLoading, saveToSupabase, deleteFromSupabase }: any) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", content: "", rating: "5" });

  const reset = () => { setOpen(false); setEditing(null); setForm({ name: "", role: "", content: "", rating: "5" }); };
  const openEdit = (t: any) => { setEditing(t); setForm({ name: t.name, role: t.role, content: t.content, rating: String(t.rating || 5) }); setOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await saveToSupabase("testimonials", { id: editing?.id || crypto.randomUUID(), name: form.name, role: form.role, content: form.content, rating: parseInt(form.rating, 10), createdAt: editing?.createdAt || Date.now() });
    setSubmitting(false); setOk(true); setTimeout(() => { setOk(false); reset(); }, 1200);
  };

  return (
    <motion.div key="testimonials" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Testimoni" subtitle={`${testimonials.length} testimoni`} action={<AddButton onClick={() => { setEditing(null); setOpen(true); }} />} />
      {isLoading ? <LoadingRows /> : testimonials.length === 0 ? <EmptyState message="Belum ada testimoni." /> : (
        <div className="space-y-2">
          {testimonials.map((t: any) => (
            <div key={t.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-4 flex items-start gap-4 group hover:border-white/15 transition-colors">
              <div className="w-10 h-10 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold text-sm flex-shrink-0">{t.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <span className="text-xs text-neutral-600">· {t.role}</span>
                  <div className="flex items-center gap-0.5 ml-auto">{Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} size={11} className="text-yellow-400 fill-yellow-400" />)}</div>
                </div>
                <p className="text-xs text-neutral-500 line-clamp-2">{t.content}</p>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => openEdit(t)} className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"><Edit3 size={14} /></button>
                <button onClick={() => window.confirm("Hapus?") && deleteFromSupabase("testimonials", t.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Drawer open={open} onClose={reset} title={editing ? "Edit Testimoni" : "Tambah Testimoni"}>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Field label="Nama"><input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Budi Santoso" /></Field>
          <Field label="Jabatan / Role"><input required type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls} placeholder="Digital Marketer" /></Field>
          <Field label="Rating">
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className={inputCls + " appearance-none"}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r} className="bg-black">{r} Bintang</option>)}
            </select>
          </Field>
          <Field label="Isi Testimoni"><textarea required rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputCls + " resize-none"} placeholder="Cerita pengalaman pengguna..." /></Field>
          <div className="pt-1"><SubmitBtn loading={submitting} success={ok} label={editing ? "Update" : "Simpan"} /></div>
        </form>
      </Drawer>
    </motion.div>
  );
}

// ─── Academy Tab ──────────────────────────────────────────────────────────────
function AcademyTab({ tutorials, isLoading, saveToSupabase, deleteFromSupabase }: any) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", videoUrl: "", category: "Keuangan" });

  const reset = () => { setOpen(false); setEditing(null); setForm({ title: "", content: "", videoUrl: "", category: "Keuangan" }); };
  const openEdit = (t: any) => { setEditing(t); setForm({ title: t.title, content: t.content, videoUrl: t.videoUrl || "", category: t.category }); setOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await saveToSupabase("tutorials", { id: editing?.id || crypto.randomUUID(), title: form.title, content: form.content, videoUrl: form.videoUrl || null, category: form.category, createdAt: editing?.createdAt || Date.now() });
    setSubmitting(false); setOk(true); setTimeout(() => { setOk(false); reset(); }, 1200);
  };

  return (
    <motion.div key="academy" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Academy" subtitle={`${tutorials.length} tutorial`} action={<AddButton onClick={() => { setEditing(null); setOpen(true); }} label="Tambah Tutorial" />} />
      {isLoading ? <LoadingRows /> : tutorials.length === 0 ? <EmptyState message="Belum ada tutorial." /> : (
        <div className="space-y-2">
          {tutorials.map((t: any) => (
            <div key={t.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-4 flex items-start gap-4 group hover:border-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                {t.videoUrl ? <Video size={16} /> : <BookOpen size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{t.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{t.category}</p>
                {t.videoUrl && <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 flex items-center gap-1 mt-1 hover:underline"><ExternalLink size={10} />Lihat Video</a>}
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => openEdit(t)} className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"><Edit3 size={14} /></button>
                <button onClick={() => window.confirm("Hapus?") && deleteFromSupabase("tutorials", t.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Drawer open={open} onClose={reset} title={editing ? "Edit Tutorial" : "Tambah Tutorial"}>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Field label="Judul Tutorial"><input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Cara Pakai Finance Tracker" /></Field>
          <Field label="Kategori">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls + " appearance-none"}>
              {CATEGORIES.map((c) => <option key={c} value={c} className="bg-black">{c}</option>)}
            </select>
          </Field>
          <Field label="Link Video (opsional)"><input type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className={inputCls} placeholder="https://youtube.com/..." /></Field>
          <Field label="Konten (Markdown)"><textarea required rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputCls + " resize-none font-mono text-xs"} placeholder="## Cara Penggunaan..." /></Field>
          <div className="pt-1"><SubmitBtn loading={submitting} success={ok} label={editing ? "Update Tutorial" : "Simpan Tutorial"} /></div>
        </form>
      </Drawer>
    </motion.div>
  );
}

// ─── Requests Tab ─────────────────────────────────────────────────────────────
function RequestsTab({ userRequests, isLoading, saveToSupabase, deleteFromSupabase }: any) {
  const statusStyle: Record<string, string> = {
    pending:   "bg-orange-500/10 text-orange-400 border-orange-500/20",
    reviewed:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <motion.div key="requests" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="User Requests" subtitle={`${userRequests.filter((r: any) => r.status === "pending").length} pending`} />
      {isLoading ? <LoadingRows /> : userRequests.length === 0 ? <EmptyState message="Belum ada request masuk." /> : (
        <div className="space-y-3">
          {userRequests.map((req: any) => (
            <div key={req.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 group hover:border-white/15 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">{req.email}</p>
                  <p className="text-xs text-neutral-600 mt-0.5">{new Date(req.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${statusStyle[req.status] || statusStyle.pending}`}>{req.status}</span>
              </div>
              <p className="text-sm text-neutral-400 mb-4 leading-relaxed">{req.request}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {["pending", "reviewed", "completed"].map((s) => (
                  <button key={s} onClick={() => saveToSupabase("user_requests", { ...req, status: s })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${req.status === s ? statusStyle[s] : "bg-white/5 text-neutral-500 border-white/8 hover:bg-white/10 hover:text-white"}`}>
                    {s}
                  </button>
                ))}
                <button onClick={() => window.confirm("Hapus request ini?") && deleteFromSupabase("user_requests", req.id)} className="ml-auto p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ settings, saveToSupabase }: any) {
  const [form, setForm] = useState({ metaTitle: "", metaDescription: "", metaKeywords: "", whatsappNumber: "", mainLynkUrl: "" });
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (settings) setForm({ metaTitle: settings.metaTitle || "", metaDescription: settings.metaDescription || "", metaKeywords: settings.metaKeywords || "", whatsappNumber: settings.whatsappNumber || "", mainLynkUrl: settings.mainLynkUrl || "" });
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    await saveToSupabase("site_settings", { id: settings?.id || "main", ...form });
    setSaving(false); setOk(true); setTimeout(() => setOk(false), 2000);
  };

  return (
    <motion.div key="settings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Settings" subtitle="Konfigurasi website dan kontak" />
      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-white">SEO & Meta</h2>
          <Field label="Meta Title"><input type="text" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className={inputCls} placeholder="Pakarsheet - Template Google Sheets..." /></Field>
          <Field label="Meta Description"><textarea rows={3} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className={inputCls + " resize-none"} placeholder="Deskripsi singkat untuk mesin pencari..." /></Field>
          <Field label="Keywords (pisah koma)"><input type="text" value={form.metaKeywords} onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })} className={inputCls} placeholder="google sheets, template, otomasi..." /></Field>
        </div>
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-white">Kontak & Link</h2>
          <Field label="Nomor WhatsApp">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 font-mono flex-shrink-0">+62</span>
              <input type="text" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value.replace(/\D/g, "") })} className={inputCls + " font-mono"} placeholder="81234567890" />
            </div>
            <p className="text-xs text-neutral-600 mt-1.5">Tanpa tanda + atau 0 di depan.</p>
          </Field>
          <Field label="Main Lynk.id URL"><input type="url" value={form.mainLynkUrl} onChange={(e) => setForm({ ...form, mainLynkUrl: e.target.value })} className={inputCls} placeholder="https://lynk.id/pakarsheet" /></Field>
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-white text-black text-sm font-bold px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50">
          {saving ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Menyimpan...</>
            : ok ? <><Check size={15} />Tersimpan!</>
            : <><Save size={15} />Simpan Pengaturan</>}
        </button>
      </form>
    </motion.div>
  );
}
