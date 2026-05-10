"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useData } from "@/hooks/useData";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus, Trash2, Lock, Edit3, Package, X,
  MousePointerClick, MessageSquare, BookOpen,
  Settings as SettingsIcon, Mail, LayoutDashboard,
  Globe, Star, Check, AlertCircle, Save,
  ExternalLink, Video, ChevronRight, FileText,
  Eye, Tag, Image as ImageIcon, AlignLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Keuangan", "Marketing", "Inventory", "HR & Admin", "Lainnya"];
const BLOG_CATEGORIES = ["Tutorial", "Tips & Trik", "Use Case", "Update", "Lainnya"];
type Tab = "dashboard" | "products" | "testimonials" | "academy" | "requests" | "settings" | "blog" | "custom_orders";
const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",     label: "Dashboard",      icon: LayoutDashboard },
  { id: "products",      label: "Produk",         icon: Package },
  { id: "testimonials",  label: "Testimoni",      icon: MessageSquare },
  { id: "academy",       label: "Academy",        icon: BookOpen },
  { id: "blog",          label: "Blog",           icon: FileText },
  { id: "custom_orders", label: "Custom Orders",  icon: Star },
  { id: "requests",      label: "Requests",       icon: Mail },
  { id: "settings",      label: "Settings",       icon: SettingsIcon },
];

// ─── Shared Primitives ────────────────────────────────────────────────────────
const inputCls = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors";
const labelCls = "block text-[13px] font-semibold text-neutral-500 uppercase tracking-wider mb-2.5";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className={labelCls}>{label}</label>{children}</div>;
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmModal({ open, message, onConfirm, onCancel }: {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} className="fixed inset-0 bg-black/70 z-[70]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-7 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">Konfirmasi Hapus</h3>
            <p className="text-[13px] text-neutral-500 mb-6">{message}</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[14px] text-neutral-400 hover:text-white hover:bg-white/10 transition-colors">Batal</button>
              <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500/15 border border-red-500/25 text-[14px] text-red-400 hover:bg-red-500/25 transition-colors font-semibold">Hapus</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-10 gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-[15px] text-neutral-500 mt-1.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function AddButton({ onClick, label = "Tambah" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 bg-white text-black text-[15px] font-semibold px-5 py-3 rounded-xl hover:bg-neutral-100 transition-colors flex-shrink-0">
      <Plus size={17} /> {label}
    </button>
  );
}

function StatCard({ title, value, icon: Icon, sub }: { title: string; value: string | number; icon: React.ElementType; sub?: string }) {
  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400">
          <Icon size={17} />
        </div>
      </div>
      <div className="text-4xl font-bold text-white tracking-tight">{value}</div>
      {sub && <p className="text-[13px] text-neutral-600 mt-1.5">{sub}</p>}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/8 rounded-2xl">
      <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mb-4">
        <Package size={22} className="text-neutral-700" />
      </div>
      <p className="text-neutral-500 text-[15px]">{message}</p>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-white/[0.02] animate-pulse" />)}
    </div>
  );
}

function SubmitBtn({ loading, success, label }: { loading: boolean; success: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="w-full bg-white text-black text-[15px] font-bold py-4 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
      {loading ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Menyimpan...</>
        : success ? <><Check size={17} />Tersimpan!</>
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
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 280 }} className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0a0a0a] border-l border-white/8 z-[60] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-7 py-5 border-b border-white/8 flex-shrink-0">
              <h2 className="text-base font-semibold text-white">{title}</h2>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors">
                <X size={17} />
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
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-black font-black text-lg">P</div>
          <span className="font-bold text-white text-lg">Pakarsheet Admin</span>
        </div>
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-1.5">Masuk ke Dashboard</h2>
          <p className="text-[14px] text-neutral-500 mb-6">Masukkan password admin untuk melanjutkan.</p>
          <form onSubmit={submit} className="space-y-4">
            <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} autoFocus />
            {err && <div className="flex items-center gap-2 text-red-400 text-[13px] bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-3"><AlertCircle size={14} />{err}</div>}
            <button type="submit" disabled={loading || !pw} className="w-full bg-white text-black text-[15px] font-bold py-4 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Memverifikasi...</> : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
function AdminPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = searchParams?.get("tab") as Tab | null;
    return t && NAV_ITEMS.some((n) => n.id === t) ? t : "dashboard";
  });
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { products, testimonials, tutorials, userRequests, settings, blogPosts, isLoading, saveToSupabase, deleteFromSupabase, fetchData } = useData();

  // Sync tab from URL query param (e.g. when returning from editor pages)
  useEffect(() => {
    const t = searchParams?.get("tab") as Tab | null;
    if (t && NAV_ITEMS.some((n) => n.id === t)) setTab(t);
  }, [searchParams]);

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
      <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black font-black text-base flex-shrink-0">P</div>
          <div><div className="text-[15px] font-bold text-white leading-tight">Pakarsheet</div><div className="text-[11px] text-neutral-600 mt-0.5">Admin Panel</div></div>
        </Link>
        {mobile && <button onClick={() => setMobileOpen(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = tab === item.id;
          return (
            <button key={item.id} onClick={() => { setTab(item.id); if (mobile) setMobileOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] transition-colors ${active ? "bg-white/10 text-white font-medium" : "text-neutral-500 hover:text-white hover:bg-white/5"}`}>
              <div className="flex items-center gap-3">
                <item.icon size={17} className={active ? "text-white" : "text-neutral-600"} />
                {item.label}
              </div>
              <div className="flex items-center gap-1.5">
                {item.id === "requests" && pending > 0 && (
                  <span className="text-[11px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/25 px-1.5 py-0.5 rounded-full">{pending}</span>
                )}
                {active && <ChevronRight size={14} className="text-neutral-600" />}
              </div>
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/8 space-y-1">
        <Link href="/" target="_blank" className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[14px] text-neutral-500 hover:text-white hover:bg-white/5 transition-colors">
          <Globe size={17} className="text-neutral-600" />Lihat Website
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[14px] text-neutral-500 hover:text-red-400 hover:bg-red-500/5 transition-colors">
          <Lock size={17} className="text-neutral-600" />Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/8 bg-[#0a0a0a] fixed h-full z-40 hidden md:block">
        <Sidebar />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a] border-b border-white/8 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black font-black text-sm">P</div>
          <span className="text-base font-bold text-white">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white transition-colors">
          <LayoutDashboard size={19} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="md:hidden fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 28, stiffness: 280 }} className="md:hidden fixed top-0 left-0 h-full w-72 bg-[#0a0a0a] border-r border-white/8 z-[60]">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
          <AnimatePresence mode="wait">
            {tab === "dashboard"    && <DashboardTab    key="d" products={products} userRequests={userRequests} testimonials={testimonials} />}
            {tab === "products"     && <ProductsTab     key="p" products={products} isLoading={isLoading} deleteFromSupabase={deleteFromSupabase} fetchData={fetchData} />}
            {tab === "testimonials"  && <TestimonialsTab  key="t"  testimonials={testimonials} isLoading={isLoading} saveToSupabase={saveToSupabase} deleteFromSupabase={deleteFromSupabase} />}
            {tab === "academy"       && <AcademyTab       key="a"  tutorials={tutorials} isLoading={isLoading} saveToSupabase={saveToSupabase} deleteFromSupabase={deleteFromSupabase} />}
            {tab === "blog"          && <BlogTab          key="b"  blogPosts={blogPosts} isLoading={isLoading} deleteFromSupabase={deleteFromSupabase} />}
            {tab === "custom_orders" && <CustomOrdersTab  key="co" isLoading={isLoading} deleteFromSupabase={deleteFromSupabase} saveToSupabase={saveToSupabase} />}
            {tab === "requests"      && <RequestsTab      key="r"  userRequests={userRequests} isLoading={isLoading} saveToSupabase={saveToSupabase} deleteFromSupabase={deleteFromSupabase} />}
            {tab === "settings"      && <SettingsTab      key="s"  settings={settings} saveToSupabase={saveToSupabase} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminPageInner />
    </Suspense>
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
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Klik per Produk</h2>
            <span className="text-[13px] text-neutral-600">{products.length} produk</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="#444" tick={{ fontSize: 12, fill: "#666" }} />
              <YAxis stroke="#444" tick={{ fontSize: 12, fill: "#666" }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 13 }} />
              <Area type="monotone" dataKey="clicks" stroke="#3b82f6" fill="url(#cg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Produk Terpopuler</h2>
          {products.length === 0 ? <p className="text-neutral-600 text-[14px]">Belum ada produk.</p> : (
            <div className="space-y-3.5">
              {[...products].sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <span className="text-[14px] text-neutral-300 truncate">{p.name}</span>
                  <span className="text-[13px] font-semibold text-blue-400 flex-shrink-0">{p.clicks || 0} klik</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Testimoni Terbaru</h2>
          {testimonials.length === 0 ? <p className="text-neutral-600 text-[14px]">Belum ada testimoni.</p> : (
            <div className="space-y-3.5">
              {testimonials.slice(0, 3).map((t: any) => (
                <div key={t.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[13px] font-bold flex-shrink-0">{t.name.charAt(0)}</div>
                  <div className="min-w-0">
                    <p className="text-[14px] text-white font-medium truncate">{t.name}</p>
                    <p className="text-[13px] text-neutral-500 line-clamp-1">{t.content}</p>
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
function ProductsTab({ products, isLoading, deleteFromSupabase, fetchData }: any) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <motion.div key="products" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader
        title="Produk"
        subtitle={`${products.length} produk tersedia`}
        action={
          <button
            onClick={() => router.push("/admin/products/new")}
            className="flex items-center gap-2 bg-white text-black text-[15px] font-semibold px-5 py-3 rounded-xl hover:bg-neutral-100 transition-colors flex-shrink-0"
          >
            <Plus size={17} /> Tambah Produk
          </button>
        }
      />
      {isLoading ? <LoadingRows /> : products.length === 0 ? <EmptyState message="Belum ada produk. Tambah produk pertama kamu." /> : (
        <div className="space-y-2.5">
          {products.map((p: any) => (
            <div key={p.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 flex items-center gap-5 group hover:border-white/15 transition-colors">
              <div className="w-16 h-16 rounded-xl bg-neutral-900 relative overflow-hidden flex-shrink-0 border border-white/8">
                {(p.images?.[0] || p.image) && <Image src={p.images?.[0] || p.image} alt={p.name} fill className="object-cover" unoptimized />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white truncate">{p.name}</p>
                <p className="text-[13px] text-neutral-500 mt-1">{p.category} · Rp {p.price.toLocaleString("id-ID")} · {p.clicks || 0} klik</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => router.push(`/admin/products/${p.id}`)} className="p-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => setConfirmId(p.id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        open={!!confirmId}
        message="Produk ini akan dihapus permanen beserta semua gambarnya."
        onConfirm={() => { if (confirmId) deleteFromSupabase("products", confirmId); setConfirmId(null); }}
        onCancel={() => setConfirmId(null)}
      />
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
  const [confirmId, setConfirmId] = useState<string | null>(null);

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
        <div className="space-y-2.5">
          {testimonials.map((t: any) => (
            <div key={t.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 flex items-start gap-5 group hover:border-white/15 transition-colors">
              <div className="w-12 h-12 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold text-[15px] flex-shrink-0">{t.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[15px] font-semibold text-white">{t.name}</p>
                  <span className="text-[13px] text-neutral-600">· {t.role}</span>
                  <div className="flex items-center gap-0.5 ml-auto">{Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />)}</div>
                </div>
                <p className="text-[13px] text-neutral-500 line-clamp-2">{t.content}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => openEdit(t)} className="p-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => setConfirmId(t.id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Drawer open={open} onClose={reset} title={editing ? "Edit Testimoni" : "Tambah Testimoni"}>
        <form onSubmit={handleSubmit} className="p-7 space-y-6">
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
      <ConfirmModal
        open={!!confirmId}
        message="Testimoni ini akan dihapus permanen."
        onConfirm={() => { if (confirmId) deleteFromSupabase("testimonials", confirmId); setConfirmId(null); }}
        onCancel={() => setConfirmId(null)}
      />
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
  const [confirmId, setConfirmId] = useState<string | null>(null);

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
        <div className="space-y-2.5">
          {tutorials.map((t: any) => (
            <div key={t.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 flex items-start gap-5 group hover:border-white/15 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                {t.videoUrl ? <Video size={18} /> : <BookOpen size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white truncate">{t.title}</p>
                <p className="text-[13px] text-neutral-500 mt-1">{t.category}</p>
                {t.videoUrl && <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] text-blue-400 flex items-center gap-1 mt-1.5 hover:underline"><ExternalLink size={11} />Lihat Video</a>}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => openEdit(t)} className="p-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => setConfirmId(t.id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Drawer open={open} onClose={reset} title={editing ? "Edit Tutorial" : "Tambah Tutorial"}>
        <form onSubmit={handleSubmit} className="p-7 space-y-6">
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
      <ConfirmModal
        open={!!confirmId}
        message="Tutorial ini akan dihapus permanen."
        onConfirm={() => { if (confirmId) deleteFromSupabase("tutorials", confirmId); setConfirmId(null); }}
        onCancel={() => setConfirmId(null)}
      />
    </motion.div>
  );
}

// ─── Requests Tab ─────────────────────────────────────────────────────────────
function RequestsTab({ userRequests, isLoading, saveToSupabase, deleteFromSupabase }: any) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
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
            <div key={req.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-6 group hover:border-white/15 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-[15px] font-semibold text-white">{req.email}</p>
                  <p className="text-[12px] text-neutral-600 mt-1">{new Date(req.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[12px] font-semibold border flex-shrink-0 ${statusStyle[req.status] || statusStyle.pending}`}>{req.status}</span>
              </div>
              <p className="text-[14px] text-neutral-400 mb-5 leading-relaxed">{req.request}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {["pending", "reviewed", "completed"].map((s) => (
                  <button key={s} onClick={() => saveToSupabase("user_requests", { ...req, status: s })}
                    className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${req.status === s ? statusStyle[s] : "bg-white/5 text-neutral-500 border-white/8 hover:bg-white/10 hover:text-white"}`}>
                    {s}
                  </button>
                ))}
                <button onClick={() => setConfirmId(req.id)} className="ml-auto p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        open={!!confirmId}
        message="Request ini akan dihapus permanen."
        onConfirm={() => { if (confirmId) deleteFromSupabase("user_requests", confirmId); setConfirmId(null); }}
        onCancel={() => setConfirmId(null)}
      />
    </motion.div>
  );
}
function SettingsTab({ settings, saveToSupabase }: any) {
  const [form, setForm] = useState({
    metaTitle: "", metaDescription: "", metaKeywords: "",
    whatsappNumber: "", mainLynkUrl: "",
    // Shop page
    shopTitle: "", shopSubtitle: "", shopBadgeText: "",
    shopCategories: "", // comma-separated
    shopCtaText: "", shopPaymentNote: "",
  });
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  // Trust badges state: array of {label, icon}
  const [trustBadges, setTrustBadges] = useState<{ label: string; icon: string }[]>([]);
  // Global shop features state
  const [shopFeatures, setShopFeatures] = useState<{ title: string; desc: string; icon: string }[]>([]);

  useEffect(() => {
    if (settings) {
      setForm({
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || "",
        metaKeywords: settings.metaKeywords || "",
        whatsappNumber: settings.whatsappNumber || "",
        mainLynkUrl: settings.mainLynkUrl || "",
        shopTitle: settings.shopTitle || "",
        shopSubtitle: settings.shopSubtitle || "",
        shopBadgeText: settings.shopBadgeText || "",
        shopCategories: (settings.shopCategories || []).join(", "),
        shopCtaText: settings.shopCtaText || "",
        shopPaymentNote: settings.shopPaymentNote || "",
      });
      setTrustBadges(settings.shopTrustBadges || []);
      setShopFeatures(settings.shopFeatures || []);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const cats = form.shopCategories
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await saveToSupabase("site_settings", {
      id: settings?.id || "main",
      ...form,
      shopCategories: cats,
      shopTrustBadges: trustBadges,
      shopFeatures: shopFeatures,
    });
    setSaving(false); setOk(true); setTimeout(() => setOk(false), 2000);
  };

  const addTrustBadge = () => setTrustBadges((prev) => [...prev, { label: "", icon: "Star" }]);
  const removeTrustBadge = (i: number) => setTrustBadges((prev) => prev.filter((_, j) => j !== i));
  const updateTrustBadge = (i: number, key: "label" | "icon", val: string) =>
    setTrustBadges((prev) => prev.map((b, j) => j === i ? { ...b, [key]: val } : b));

  const addShopFeature = () => setShopFeatures((prev) => [...prev, { title: "", desc: "", icon: "Zap" }]);
  const removeShopFeature = (i: number) => setShopFeatures((prev) => prev.filter((_, j) => j !== i));
  const updateShopFeature = (i: number, key: "title" | "desc" | "icon", val: string) =>
    setShopFeatures((prev) => prev.map((f, j) => j === i ? { ...f, [key]: val } : f));

  const ICON_OPTIONS = ["Zap", "Clock", "Globe", "Star", "Shield", "Check", "LayoutDashboard", "Edit3", "MessageSquare", "Package", "Sparkles", "Heart", "Lock", "Rocket", "Layers"];

  return (
    <motion.div key="settings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Settings" subtitle="Konfigurasi website, toko, dan kontak" />
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">

        {/* SEO */}
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 space-y-6">
          <h2 className="text-base font-semibold text-white">SEO & Meta</h2>
          <Field label="Meta Title"><input type="text" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className={inputCls} placeholder="Pakarsheet - Template Google Sheets..." /></Field>
          <Field label="Meta Description"><textarea rows={3} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className={inputCls + " resize-none"} placeholder="Deskripsi singkat untuk mesin pencari..." /></Field>
          <Field label="Keywords (pisah koma)"><input type="text" value={form.metaKeywords} onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })} className={inputCls} placeholder="google sheets, template, otomasi..." /></Field>
        </div>

        {/* Kontak */}
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 space-y-6">
          <h2 className="text-base font-semibold text-white">Kontak & Link</h2>
          <Field label="Nomor WhatsApp">
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-neutral-500 font-mono flex-shrink-0">+62</span>
              <input type="text" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value.replace(/\D/g, "") })} className={inputCls + " font-mono"} placeholder="81234567890" />
            </div>
            <p className="text-[12px] text-neutral-600 mt-2">Tanpa tanda + atau 0 di depan.</p>
          </Field>
          <Field label="Main Lynk.id URL"><input type="url" value={form.mainLynkUrl} onChange={(e) => setForm({ ...form, mainLynkUrl: e.target.value })} className={inputCls} placeholder="https://lynk.id/pakarsheet" /></Field>
        </div>

        {/* Shop Header */}
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 space-y-6">
          <h2 className="text-base font-semibold text-white">Shop — Header</h2>
          <Field label="Badge Text">
            <input type="text" value={form.shopBadgeText} onChange={(e) => setForm({ ...form, shopBadgeText: e.target.value })} className={inputCls} placeholder="Koleksi Template Premium" />
          </Field>
          <Field label="Judul Halaman">
            <textarea rows={2} value={form.shopTitle} onChange={(e) => setForm({ ...form, shopTitle: e.target.value })} className={inputCls + " resize-none"} placeholder="Senjata Rahasia Operasional Bisnis." />
            <p className="text-[12px] text-neutral-600 mt-2">Gunakan baris baru (\n) untuk memisah baris. Baris ke-2 akan tampil abu-abu.</p>
          </Field>
          <Field label="Subtitle">
            <textarea rows={3} value={form.shopSubtitle} onChange={(e) => setForm({ ...form, shopSubtitle: e.target.value })} className={inputCls + " resize-none"} placeholder="Pilih sistem siap pakai yang telah dioptimasi..." />
          </Field>
          <Field label="Kategori Produk (pisah koma)">
            <input type="text" value={form.shopCategories} onChange={(e) => setForm({ ...form, shopCategories: e.target.value })} className={inputCls} placeholder="Keuangan, Marketing, Inventory, HR & Admin, Lainnya" />
            <p className="text-[12px] text-neutral-600 mt-2">&quot;Semua&quot; otomatis ditambahkan di awal.</p>
          </Field>
        </div>

        {/* Shop CTA */}
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 space-y-6">
          <h2 className="text-base font-semibold text-white">Shop — Tombol & Catatan</h2>
          <Field label="Teks Tombol Beli">
            <input type="text" value={form.shopCtaText} onChange={(e) => setForm({ ...form, shopCtaText: e.target.value })} className={inputCls} placeholder="Beli Sekarang" />
          </Field>
          <Field label="Catatan Pembayaran">
            <input type="text" value={form.shopPaymentNote} onChange={(e) => setForm({ ...form, shopPaymentNote: e.target.value })} className={inputCls} placeholder="🔒 Pembayaran aman via Lynk.id" />
          </Field>
        </div>

        {/* Trust Badges */}
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Shop — Trust Badges</h2>
            <button type="button" onClick={addTrustBadge} className="flex items-center gap-1.5 text-[13px] font-semibold text-neutral-400 hover:text-white transition-colors">
              <Plus size={15} /> Tambah
            </button>
          </div>
          <p className="text-[13px] text-neutral-600">Tampil di bawah gambar produk di halaman detail.</p>
          {trustBadges.length === 0 && (
            <p className="text-[13px] text-neutral-700 italic">Kosong = pakai default (Premium Quality, Lifetime Update, Cloud Sync)</p>
          )}
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <select value={badge.icon} onChange={(e) => updateTrustBadge(i, "icon", e.target.value)} className={inputCls + " appearance-none w-40 flex-shrink-0"}>
                {ICON_OPTIONS.map((ic) => <option key={ic} value={ic} className="bg-black">{ic}</option>)}
              </select>
              <input type="text" value={badge.label} onChange={(e) => updateTrustBadge(i, "label", e.target.value)} className={inputCls} placeholder="Premium Quality" />
              <button type="button" onClick={() => removeTrustBadge(i)} className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Global Shop Features */}
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Shop — Fitur Unggulan (Default)</h2>
            <button type="button" onClick={addShopFeature} className="flex items-center gap-1.5 text-[13px] font-semibold text-neutral-400 hover:text-white transition-colors">
              <Plus size={15} /> Tambah
            </button>
          </div>
          <p className="text-[13px] text-neutral-600">Dipakai untuk semua produk yang tidak punya fitur sendiri. Kosong = pakai bawaan sistem.</p>
          {shopFeatures.map((feat, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Fitur {i + 1}</span>
                <button type="button" onClick={() => removeShopFeature(i)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                  <X size={13} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={feat.title} onChange={(e) => updateShopFeature(i, "title", e.target.value)} className={inputCls} placeholder="Nama Fitur" />
                <select value={feat.icon} onChange={(e) => updateShopFeature(i, "icon", e.target.value)} className={inputCls + " appearance-none"}>
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic} className="bg-black">{ic}</option>)}
                </select>
              </div>
              <textarea rows={2} value={feat.desc} onChange={(e) => updateShopFeature(i, "desc", e.target.value)} className={inputCls + " resize-none"} placeholder="Deskripsi singkat fitur ini..." />
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-white text-black text-[15px] font-bold px-7 py-3.5 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50">
          {saving ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Menyimpan...</>
            : ok ? <><Check size={17} />Tersimpan!</>
            : <><Save size={17} />Simpan Pengaturan</>}
        </button>
      </form>
    </motion.div>
  );
}

// ─── Blog Tab ─────────────────────────────────────────────────────────────────
function BlogTab({ blogPosts, isLoading, deleteFromSupabase }: any) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const published = blogPosts.filter((p: any) => p.status === "published").length;
  const drafts = blogPosts.filter((p: any) => p.status === "draft").length;

  const statusStyle: Record<string, string> = {
    published: "bg-green-500/10 text-green-400 border-green-500/20",
    draft: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  };

  return (
    <motion.div key="blog" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader
        title="Blog"
        subtitle={`${published} published · ${drafts} draft`}
        action={
          <button
            onClick={() => router.push("/admin/blog/new")}
            className="flex items-center gap-2 bg-white text-black text-[15px] font-semibold px-5 py-3 rounded-xl hover:bg-neutral-100 transition-colors flex-shrink-0"
          >
            <Plus size={17} /> Tulis Artikel
          </button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-white">{blogPosts.length}</div>
          <div className="text-[13px] text-neutral-600 mt-1">Total Artikel</div>
        </div>
        <div className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">{published}</div>
          <div className="text-[13px] text-neutral-600 mt-1">Published</div>
        </div>
        <div className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-neutral-400">{drafts}</div>
          <div className="text-[13px] text-neutral-600 mt-1">Draft</div>
        </div>
      </div>

      {isLoading ? (
        <LoadingRows />
      ) : blogPosts.length === 0 ? (
        <EmptyState message="Belum ada artikel. Mulai tulis artikel pertama kamu." />
      ) : (
        <div className="space-y-2.5">
          {blogPosts.map((post: any) => (
            <div
              key={post.id}
              className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 flex items-start gap-5 group hover:border-white/15 transition-colors"
            >
              <div className="w-16 h-16 rounded-xl bg-neutral-900 relative overflow-hidden flex-shrink-0 border border-white/8">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={18} className="text-neutral-700" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-[15px] font-semibold text-white truncate">{post.title}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border flex-shrink-0 ${statusStyle[post.status] || statusStyle.draft}`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-[13px] text-neutral-500 line-clamp-1 mb-1.5">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-[12px] text-neutral-700">
                  <span>{post.category}</span>
                  <span className="flex items-center gap-1"><Eye size={11} /> {post.views || 0}</span>
                  <span className="flex items-center gap-1"><AlignLeft size={11} /> {post.readingTime || 1} mnt</span>
                  {post.tags?.length > 0 && (
                    <span className="flex items-center gap-1"><Tag size={11} /> {post.tags.slice(0, 2).join(", ")}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors">
                  <ExternalLink size={16} />
                </a>
                <button onClick={() => router.push(`/admin/blog/${post.id}`)} className="p-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => setConfirmId(post.id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!confirmId}
        message="Artikel ini akan dihapus permanen."
        onConfirm={() => { if (confirmId) deleteFromSupabase("blog_posts", confirmId); setConfirmId(null); }}
        onCancel={() => setConfirmId(null)}
      />
    </motion.div>
  );
}

// ─── Custom Orders Tab ────────────────────────────────────────────────────────
function CustomOrdersTab({ isLoading: _isLoading, deleteFromSupabase, saveToSupabase }: any) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from("custom_orders")
      .select("*")
      .order("createdAt", { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false); });
  }, []);

  const STATUS_OPTIONS = ["new", "reviewing", "in_progress", "delivered", "completed", "cancelled"];
  const statusStyle: Record<string, string> = {
    new:         "bg-blue-500/10 text-blue-400 border-blue-500/20",
    reviewing:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    in_progress: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    delivered:   "bg-purple-500/10 text-purple-400 border-purple-500/20",
    completed:   "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled:   "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  };
  const pkgStyle: Record<string, string> = {
    basic:      "text-yellow-400",
    pro:        "text-blue-400",
    enterprise: "text-purple-400",
  };

  const updateStatus = async (order: any, newStatus: string) => {
    await saveToSupabase("custom_orders", { ...order, status: newStatus });
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: newStatus } : o));
  };

  const newCount = orders.filter((o) => o.status === "new").length;

  return (
    <motion.div key="custom_orders" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Custom Orders" subtitle={`${orders.length} total · ${newCount} baru`} />

      {loading ? <LoadingRows /> : orders.length === 0 ? (
        <EmptyState message="Belum ada custom order masuk." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 group hover:border-white/15 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-[15px] font-semibold text-white">{order.name}</p>
                    <span className={`text-[11px] font-bold uppercase ${pkgStyle[order.package] ?? "text-neutral-400"}`}>
                      {order.package}
                    </span>
                  </div>
                  <p className="text-[13px] text-neutral-500">{order.email} · {order.business}</p>
                  <p className="text-[12px] text-neutral-700 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    {order.deadline && ` · Deadline: ${order.deadline}`}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[12px] font-semibold border flex-shrink-0 ${statusStyle[order.status] ?? statusStyle.new}`}>
                  {order.status.replace("_", " ")}
                </span>
              </div>

              <p className="text-[14px] text-neutral-400 leading-relaxed mb-5 bg-white/[0.02] rounded-xl p-4 border border-white/5">
                {order.description}
              </p>

              <div className="flex items-center gap-3 flex-wrap mb-4">
                <span className="text-[12px] text-neutral-600">Tim: {order.teamSize}</span>
                {order.hasMigration && <span className="text-[12px] text-neutral-600">· Ada migrasi data</span>}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order, s)}
                    className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${
                      order.status === s
                        ? statusStyle[s]
                        : "bg-white/5 text-neutral-500 border-white/8 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
                <button
                  onClick={() => setConfirmId(order.id)}
                  className="ml-auto p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!confirmId}
        message="Custom order ini akan dihapus permanen."
        onConfirm={() => {
          if (confirmId) {
            deleteFromSupabase("custom_orders", confirmId);
            setOrders((prev) => prev.filter((o) => o.id !== confirmId));
          }
          setConfirmId(null);
        }}
        onCancel={() => setConfirmId(null)}
      />
    </motion.div>
  );
}
