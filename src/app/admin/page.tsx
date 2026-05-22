"use client";

import { useState, useEffect, Suspense } from "react";
import { useData } from "@/hooks/useData";
import type {
  BlogPost,
  Product,
  SiteSettings,
  Testimonial,
  Tutorial,
  UserRequest,
} from "@/hooks/useData";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus, Trash2, Edit3, Package, X, Menu,
  MousePointerClick, MessageSquare, BookOpen,
  Settings as SettingsIcon, Mail, LayoutDashboard, LogOut,
  Globe, Star, Check, Save,
  ExternalLink, Video, ChevronRight, FileText,
  Eye, Tag, Image as ImageIcon, AlignLeft,
  Inbox,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Keuangan", "Marketing", "Inventory", "HR & Admin", "Lainnya"];
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

type SaveResult = { ok: boolean; error?: string };
type SaveToSupabase = (table: string, data: Record<string, unknown>) => Promise<SaveResult>;
type DeleteFromSupabase = (table: string, id: string) => Promise<SaveResult>;

type CustomOrder = {
  id: string;
  name: string;
  email: string;
  business: string;
  package: string;
  deadline?: string | null;
  createdAt: number;
  description: string;
  teamSize: string;
  hasMigration?: boolean | null;
  status: string;
};

type AdminSidebarProps = {
  tab: Tab;
  pending: number;
  mobile?: boolean;
  onTabChange: (tab: Tab) => void;
  onMobileClose: () => void;
  onLogout: () => void;
};

// ─── Shared Primitives ────────────────────────────────────────────────────────
const inputCls = "w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-base text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all";
const labelCls = "block text-sm font-semibold text-neutral-400 mb-2.5";

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
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-[calc(100%-2rem)] max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Konfirmasi Hapus</h3>
            <p className="text-base text-neutral-500 mb-7 leading-relaxed">{message}</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-base font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors">Batal</button>
              <button onClick={onConfirm} className="flex-1 py-3.5 rounded-xl bg-red-500/15 border border-red-500/25 text-base font-semibold text-red-400 hover:bg-red-500/25 transition-colors">Hapus</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10 md:mb-12">
      <div className="min-w-0">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">{title}</h1>
        {subtitle && <p className="text-base text-neutral-500 mt-2.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

function AddButton({ onClick, label = "Tambah" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 bg-white text-black text-base font-semibold px-6 py-3.5 rounded-xl hover:bg-neutral-100 transition-colors">
      <Plus size={18} /> {label}
    </button>
  );
}

function StatCard({ title, value, icon: Icon, sub }: { title: string; value: string | number; icon: React.ElementType; sub?: string }) {
  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-semibold text-neutral-500 uppercase tracking-[0.14em]">{title}</span>
        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-neutral-400">
          <Icon size={19} />
        </div>
      </div>
      <div className="text-5xl md:text-6xl font-bold text-white tracking-tight tabular-nums">{value}</div>
      {sub && <p className="text-sm text-neutral-600 mt-2.5">{sub}</p>}
    </div>
  );
}

function EmptyState({ message, icon: Icon = Inbox }: { message: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/8 rounded-2xl bg-white/[0.01]">
      <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
        <Icon size={22} className="text-neutral-600" />
      </div>
      <p className="text-neutral-500 text-[14px]">{message}</p>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-2.5">
      {[1, 2, 3].map((i) => <div key={i} className="h-[80px] rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />)}
    </div>
  );
}

function SubmitBtn({ loading, success, label }: { loading: boolean; success: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="w-full bg-white text-black text-base font-semibold py-4 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
      {loading ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Menyimpan...</>
        : success ? <><Check size={18} />Tersimpan!</>
        : label}
    </button>
  );
}

// ─── Row action buttons — visible on mobile, hover-reveal on desktop ──────────
function RowActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-1.5 flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
      {children}
    </div>
  );
}

function IconBtn({
  onClick,
  children,
  variant = "default",
  label,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "danger";
  label: string;
}) {
  const base = "w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-colors";
  const styles = variant === "danger"
    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
    : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10";
  return (
    <button onClick={onClick} aria-label={label} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function SettingsCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 md:p-8 space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-white uppercase tracking-[0.14em]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 z-50" />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0a0a0a] border-l border-white/8 z-[60] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/8 flex-shrink-0">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <button onClick={onClose} aria-label="Tutup" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function AdminSidebar({
  tab,
  pending,
  mobile = false,
  onTabChange,
  onMobileClose,
  onLogout,
}: AdminSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black font-black text-[16px] flex-shrink-0 group-hover:scale-105 transition-transform">P</div>
          <div>
            <div className="text-[15px] font-bold text-white leading-tight">Pakarsheet</div>
            <div className="text-[10px] text-neutral-600 mt-0.5 uppercase tracking-[0.14em]">Admin Panel</div>
          </div>
        </Link>
        {mobile && (
          <button onClick={onMobileClose} aria-label="Tutup menu" className="w-9 h-9 rounded-lg bg-white/5 text-neutral-400 hover:text-white flex items-center justify-center transition-colors">
            <X size={17} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (mobile) onMobileClose();
              }}
              aria-current={active ? "page" : undefined}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] transition-colors ${active ? "bg-white/10 text-white font-semibold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={active ? "text-white" : "text-neutral-500"} />
                {item.label}
              </div>
              <div className="flex items-center gap-1.5">
                {item.id === "requests" && pending > 0 && (
                  <span className="text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/25 px-1.5 py-0.5 rounded-full tabular-nums">{pending}</span>
                )}
                {active && <ChevronRight size={14} className="text-neutral-500" />}
              </div>
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/8 space-y-1">
        <Link href="/" target="_blank" className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-[14px] text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
          <Globe size={17} className="text-neutral-500" />Lihat Website
        </Link>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-[14px] text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-colors">
          <LogOut size={17} className="text-neutral-500" />Logout
        </button>
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { products, testimonials, tutorials, userRequests, settings, blogPosts, isLoading, saveToSupabase, deleteFromSupabase, fetchData } = useData();

  // Sync tab from URL query param (e.g. when returning from editor pages)
  useEffect(() => {
    const t = searchParams?.get("tab") as Tab | null;
    if (t && NAV_ITEMS.some((n) => n.id === t)) {
      queueMicrotask(() => setTab(t));
    }
  }, [searchParams]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.replace("/admin/login");
  };

  const pending = userRequests.filter((r) => r.status === "pending").length;
  const activeLabel = NAV_ITEMS.find((n) => n.id === tab)?.label ?? "";

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/8 bg-[#0a0a0a] fixed h-full z-40 hidden md:block">
        <AdminSidebar
          tab={tab}
          pending={pending}
          onTabChange={setTab}
          onMobileClose={() => setMobileOpen(false)}
          onLogout={logout}
        />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/8 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-black font-black text-[14px] flex-shrink-0">P</div>
          <span className="text-[15px] font-bold text-white">Admin</span>
          {activeLabel && <span className="text-[13px] text-neutral-500 truncate">· {activeLabel}</span>}
        </div>
        <button onClick={() => setMobileOpen(true)} aria-label="Buka menu" className="w-10 h-10 rounded-lg bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="md:hidden fixed inset-0 bg-black/70 z-50" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="md:hidden fixed top-0 left-0 h-full w-[280px] bg-[#0a0a0a] border-r border-white/8 z-[60] shadow-2xl">
              <AdminSidebar
                tab={tab}
                pending={pending}
                mobile
                onTabChange={setTab}
                onMobileClose={() => setMobileOpen(false)}
                onLogout={logout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
          <AnimatePresence mode="wait">
            {tab === "dashboard"    && <DashboardTab    key="d"  products={products} userRequests={userRequests} testimonials={testimonials} />}
            {tab === "products"     && <ProductsTab     key="p"  products={products} isLoading={isLoading} deleteFromSupabase={deleteFromSupabase} fetchData={fetchData} />}
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
function DashboardTab({
  products,
  userRequests,
  testimonials,
}: {
  products: Product[];
  userRequests: UserRequest[];
  testimonials: Testimonial[];
}) {
  const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0);
  const pending = userRequests.filter((r) => r.status === "pending").length;
  const chartData = [...products]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 7)
    .map((p) => ({
      name: p.name.length > 14 ? p.name.substring(0, 14) + "…" : p.name,
      clicks: p.clicks || 0,
    }));

  return (
    <motion.div key="dashboard" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Dashboard" subtitle="Ringkasan performa toko" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-5 md:mb-6">
        <StatCard title="Total Produk"    value={products.length} icon={Package}          sub="Produk aktif di toko" />
        <StatCard title="Total Klik"      value={totalClicks.toLocaleString("id-ID")} icon={MousePointerClick} sub="Akumulasi semua produk" />
        <StatCard title="Pending Request" value={pending}         icon={Mail}             sub="Menunggu ditinjau" />
      </div>

      {chartData.length > 0 && (
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 md:p-7 mb-5 md:mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-semibold text-white">Top 7 Produk · Klik</h2>
            <span className="text-[12px] text-neutral-600 uppercase tracking-wider">{products.length} total</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 0, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" stroke="#444" tick={{ fontSize: 12, fill: "#666" }} tickLine={false} axisLine={false} />
              <YAxis stroke="#444" tick={{ fontSize: 12, fill: "#666" }} tickLine={false} axisLine={false} width={34} />
              <Tooltip cursor={{ stroke: "rgba(255,255,255,0.12)", strokeWidth: 1 }} contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 13 }} />
              <Area type="monotone" dataKey="clicks" stroke="#3b82f6" fill="url(#cg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 md:p-7">
          <h2 className="text-[16px] font-semibold text-white mb-5">Produk Terpopuler</h2>
          {products.length === 0 ? <p className="text-neutral-600 text-[14px]">Belum ada produk.</p> : (
            <div className="space-y-3.5">
              {[...products].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[12px] font-mono text-neutral-700 w-4">{i + 1}</span>
                    <span className="text-[14px] text-neutral-300 truncate">{p.name}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-blue-400 flex-shrink-0 tabular-nums">{(p.clicks || 0).toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 md:p-7">
          <h2 className="text-[16px] font-semibold text-white mb-5">Testimoni Terbaru</h2>
          {testimonials.length === 0 ? <p className="text-neutral-600 text-[14px]">Belum ada testimoni.</p> : (
            <div className="space-y-4">
              {testimonials.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[13px] font-bold flex-shrink-0">{t.name.charAt(0).toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
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

// ─── Products Tab ─────────────────────────────────────────────────────────────
function ProductsTab({
  products,
  isLoading,
  deleteFromSupabase,
}: {
  products: Product[];
  isLoading: boolean;
  deleteFromSupabase: DeleteFromSupabase;
  fetchData: () => Promise<void>;
}) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <motion.div key="products" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader
        title="Produk"
        subtitle={`${products.length} produk tersedia`}
        action={<AddButton onClick={() => router.push("/admin/products/new")} label="Tambah Produk" />}
      />
      {isLoading ? <LoadingRows /> : products.length === 0 ? <EmptyState message="Belum ada produk. Tambah produk pertama kamu." icon={Package} /> : (
        <div className="space-y-2.5">
          {products.map((p) => (
            <div key={p.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 group hover:border-white/15 transition-colors">
              <div className="w-16 h-16 rounded-lg bg-neutral-900 relative overflow-hidden flex-shrink-0 border border-white/8">
                {(p.images?.[0] || p.image) && <Image src={p.images?.[0] || p.image || ""} alt={p.name} fill className="object-cover" unoptimized />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white truncate">{p.name}</p>
                <p className="text-[13px] text-neutral-500 mt-1 truncate">
                  <span className="text-neutral-600">{p.category}</span>
                  <span className="text-neutral-800 mx-1.5">·</span>
                  Rp {p.price.toLocaleString("id-ID")}
                  <span className="text-neutral-800 mx-1.5">·</span>
                  <span className="tabular-nums">{p.clicks || 0} klik</span>
                </p>
              </div>
              <RowActions>
                <IconBtn label="Edit" onClick={() => router.push(`/admin/products/${p.id}`)}><Edit3 size={16} /></IconBtn>
                <IconBtn label="Hapus" variant="danger" onClick={() => setConfirmId(p.id)}><Trash2 size={16} /></IconBtn>
              </RowActions>
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
function TestimonialsTab({
  testimonials,
  isLoading,
  saveToSupabase,
  deleteFromSupabase,
}: {
  testimonials: Testimonial[];
  isLoading: boolean;
  saveToSupabase: SaveToSupabase;
  deleteFromSupabase: DeleteFromSupabase;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", content: "", rating: "5" });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const reset = () => { setOpen(false); setEditing(null); setForm({ name: "", role: "", content: "", rating: "5" }); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ name: t.name, role: t.role, content: t.content, rating: String(t.rating || 5) }); setOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await saveToSupabase("testimonials", { id: editing?.id || crypto.randomUUID(), name: form.name, role: form.role, content: form.content, rating: parseInt(form.rating, 10), createdAt: editing?.createdAt || Date.now() });
    setSubmitting(false); setOk(true); setTimeout(() => { setOk(false); reset(); }, 1200);
  };

  return (
    <motion.div key="testimonials" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Testimoni" subtitle={`${testimonials.length} testimoni`} action={<AddButton onClick={() => { setEditing(null); setOpen(true); }} />} />
      {isLoading ? <LoadingRows /> : testimonials.length === 0 ? <EmptyState message="Belum ada testimoni." icon={MessageSquare} /> : (
        <div className="space-y-2.5">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-4 sm:p-5 flex items-start gap-4 sm:gap-5 group hover:border-white/15 transition-colors">
              <div className="w-11 h-11 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold text-[14px] flex-shrink-0">{t.name.charAt(0).toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-[15px] font-semibold text-white">{t.name}</p>
                  <span className="text-[13px] text-neutral-600">· {t.role}</span>
                  <div className="flex items-center gap-0.5 ml-auto">{Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}</div>
                </div>
                <p className="text-[13px] text-neutral-500 line-clamp-2 leading-relaxed">{t.content}</p>
              </div>
              <RowActions>
                <IconBtn label="Edit" onClick={() => openEdit(t)}><Edit3 size={16} /></IconBtn>
                <IconBtn label="Hapus" variant="danger" onClick={() => setConfirmId(t.id)}><Trash2 size={16} /></IconBtn>
              </RowActions>
            </div>
          ))}
        </div>
      )}
      <Drawer open={open} onClose={reset} title={editing ? "Edit Testimoni" : "Tambah Testimoni"}>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
function AcademyTab({
  tutorials,
  isLoading,
  saveToSupabase,
  deleteFromSupabase,
}: {
  tutorials: Tutorial[];
  isLoading: boolean;
  saveToSupabase: SaveToSupabase;
  deleteFromSupabase: DeleteFromSupabase;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tutorial | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", videoUrl: "", category: "Keuangan" });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const reset = () => { setOpen(false); setEditing(null); setForm({ title: "", content: "", videoUrl: "", category: "Keuangan" }); };
  const openEdit = (t: Tutorial) => { setEditing(t); setForm({ title: t.title, content: t.content, videoUrl: t.videoUrl || "", category: t.category }); setOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await saveToSupabase("tutorials", { id: editing?.id || crypto.randomUUID(), title: form.title, content: form.content, videoUrl: form.videoUrl || null, category: form.category, createdAt: editing?.createdAt || Date.now() });
    setSubmitting(false); setOk(true); setTimeout(() => { setOk(false); reset(); }, 1200);
  };

  return (
    <motion.div key="academy" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Academy" subtitle={`${tutorials.length} tutorial`} action={<AddButton onClick={() => { setEditing(null); setOpen(true); }} label="Tambah Tutorial" />} />
      {isLoading ? <LoadingRows /> : tutorials.length === 0 ? <EmptyState message="Belum ada tutorial." icon={BookOpen} /> : (
        <div className="space-y-2.5">
          {tutorials.map((t) => (
            <div key={t.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-4 sm:p-5 flex items-start gap-4 sm:gap-5 group hover:border-white/15 transition-colors">
              <div className="w-11 h-11 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-500/15">
                {t.videoUrl ? <Video size={18} /> : <BookOpen size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white truncate">{t.title}</p>
                <div className="flex items-center gap-2 flex-wrap mt-1 text-[13px] text-neutral-500">
                  <span>{t.category}</span>
                  {t.videoUrl && (
                    <>
                      <span className="text-neutral-800">·</span>
                      <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 inline-flex items-center gap-1 hover:underline">
                        <ExternalLink size={11} />Lihat Video
                      </a>
                    </>
                  )}
                </div>
              </div>
              <RowActions>
                <IconBtn label="Edit" onClick={() => openEdit(t)}><Edit3 size={16} /></IconBtn>
                <IconBtn label="Hapus" variant="danger" onClick={() => setConfirmId(t.id)}><Trash2 size={16} /></IconBtn>
              </RowActions>
            </div>
          ))}
        </div>
      )}
      <Drawer open={open} onClose={reset} title={editing ? "Edit Tutorial" : "Tambah Tutorial"}>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <Field label="Judul Tutorial"><input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Cara Pakai Finance Tracker" /></Field>
          <Field label="Kategori">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls + " appearance-none"}>
              {CATEGORIES.map((c) => <option key={c} value={c} className="bg-black">{c}</option>)}
            </select>
          </Field>
          <Field label="Link Video (opsional)"><input type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className={inputCls} placeholder="https://youtube.com/..." /></Field>
          <Field label="Konten (Markdown)"><textarea required rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputCls + " resize-none font-mono text-[13px]"} placeholder="## Cara Penggunaan..." /></Field>
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
function RequestsTab({
  userRequests,
  isLoading,
  saveToSupabase,
  deleteFromSupabase,
}: {
  userRequests: UserRequest[];
  isLoading: boolean;
  saveToSupabase: SaveToSupabase;
  deleteFromSupabase: DeleteFromSupabase;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const statusStyle: Record<string, string> = {
    pending:   "bg-orange-500/10 text-orange-400 border-orange-500/20",
    reviewed:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <motion.div key="requests" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="User Requests" subtitle={`${userRequests.filter((r) => r.status === "pending").length} pending · ${userRequests.length} total`} />
      {isLoading ? <LoadingRows /> : userRequests.length === 0 ? <EmptyState message="Belum ada request masuk." icon={Mail} /> : (
        <div className="space-y-3">
          {userRequests.map((req) => (
            <div key={req.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 sm:p-6 group hover:border-white/15 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-white truncate">{req.email}</p>
                  <p className="text-[12px] text-neutral-600 mt-1">{new Date(req.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 uppercase tracking-wider ${statusStyle[req.status] || statusStyle.pending}`}>{req.status}</span>
              </div>
              <p className="text-[14px] text-neutral-400 mb-5 leading-relaxed whitespace-pre-wrap">{req.request}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["pending", "reviewed", "completed"] satisfies UserRequest["status"][]).map((s) => (
                  <button key={s} onClick={() => saveToSupabase("user_requests", { ...req, status: s })}
                    className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold border transition-colors capitalize ${req.status === s ? statusStyle[s] : "bg-white/5 text-neutral-500 border-white/8 hover:bg-white/10 hover:text-white"}`}>
                    {s}
                  </button>
                ))}
                <div className="ml-auto">
                  <RowActions>
                    <IconBtn label="Hapus" variant="danger" onClick={() => setConfirmId(req.id)}><Trash2 size={15} /></IconBtn>
                  </RowActions>
                </div>
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
function SettingsTab({
  settings,
  saveToSupabase,
}: {
  settings: SiteSettings | null;
  saveToSupabase: SaveToSupabase;
}) {
  const [form, setForm] = useState({
    metaTitle: "", metaDescription: "", metaKeywords: "",
    whatsappNumber: "", mainLynkUrl: "",
    // Branding
    brandName: "",
    logoUrl: "",
    faviconUrl: "",
    // Shop page
    shopTitle: "", shopSubtitle: "", shopBadgeText: "",
    shopCategories: "", // comma-separated
    shopCtaText: "", shopPaymentNote: "",
  });
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [brandErr, setBrandErr] = useState<string | null>(null);
  const [uploadingKind, setUploadingKind] = useState<"logo" | "favicon" | null>(null);

  // Trust badges state: array of {label, icon}
  const [trustBadges, setTrustBadges] = useState<{ label: string; icon: string }[]>([]);
  // Global shop features state
  const [shopFeatures, setShopFeatures] = useState<{ title: string; desc: string; icon: string }[]>([]);

  useEffect(() => {
    if (settings) {
      const nextForm = {
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || "",
        metaKeywords: settings.metaKeywords || "",
        whatsappNumber: settings.whatsappNumber || "",
        mainLynkUrl: settings.mainLynkUrl || "",
        brandName: settings.brandName || "",
        logoUrl: settings.logoUrl || "",
        faviconUrl: settings.faviconUrl || "",
        shopTitle: settings.shopTitle || "",
        shopSubtitle: settings.shopSubtitle || "",
        shopBadgeText: settings.shopBadgeText || "",
        shopCategories: (settings.shopCategories || []).join(", "),
        shopCtaText: settings.shopCtaText || "",
        shopPaymentNote: settings.shopPaymentNote || "",
      };
      queueMicrotask(() => {
        setForm(nextForm);
        setTrustBadges(settings.shopTrustBadges || []);
        setShopFeatures(settings.shopFeatures || []);
      });
    }
  }, [settings]);

  const uploadBrandAsset = async (file: File, kind: "logo" | "favicon"): Promise<string | null> => {
    setBrandErr(null);
    if (!supabase) {
      setBrandErr("Supabase belum dikonfigurasi.");
      return null;
    }
    const maxBytes = kind === "favicon" ? 512 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setBrandErr(`Ukuran file terlalu besar. Maks ${kind === "favicon" ? "512KB" : "2MB"}.`);
      return null;
    }
    const allowed = kind === "favicon"
      ? ["image/x-icon", "image/vnd.microsoft.icon", "image/png", "image/svg+xml"]
      : ["image/png", "image/svg+xml", "image/jpeg", "image/webp"];
    if (file.type && !allowed.includes(file.type)) {
      setBrandErr(`Format tidak didukung untuk ${kind}.`);
      return null;
    }
    setUploadingKind(kind);
    try {
      const ext = file.name.split(".").pop() || (kind === "favicon" ? "ico" : "png");
      const path = `branding/${kind}-${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error: se } = await supabase.storage.from("products").upload(path, file, { upsert: false });
      if (se) {
        setBrandErr(`Gagal upload: ${se.message}`);
        return null;
      }
      const { data: ud } = supabase.storage.from("products").getPublicUrl(path);
      return ud.publicUrl;
    } finally {
      setUploadingKind(null);
    }
  };

  const onLogoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await uploadBrandAsset(file, "logo");
    if (url) setForm((f) => ({ ...f, logoUrl: url }));
  };

  const onFaviconPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await uploadBrandAsset(file, "favicon");
    if (url) setForm((f) => ({ ...f, faviconUrl: url }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const cats = form.shopCategories
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await saveToSupabase("site_settings", {
      id: settings?.id || "main",
      ...form,
      logoUrl: form.logoUrl || null,
      faviconUrl: form.faviconUrl || null,
      brandName: form.brandName || null,
      shopCategories: cats,
      shopTrustBadges: trustBadges,
      shopFeatures: shopFeatures,
    });
    // Invalidate server-side metadata cache so favicon/logo updates immediately.
    try {
      await fetch("/api/admin/revalidate-settings", { method: "POST" });
    } catch {
      // Non-fatal — will eventually expire from TTL.
    }
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
  const categoryPreview = form.shopCategories
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const brandPreview = form.brandName.trim() || "Pakarsheet";

  return (
    <motion.div key="settings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader
        title="Settings"
        subtitle="Kelola identitas website dan pengalaman toko dari satu layar."
        action={
          <button type="submit" form="settings-form" disabled={saving} className="inline-flex items-center gap-2 bg-white text-black text-base font-semibold px-6 py-3.5 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50">
            {saving ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Menyimpan...</>
              : ok ? <><Check size={18} />Tersimpan</>
              : <><Save size={18} />Simpan</>}
          </button>
        }
      />

      <form id="settings-form" onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        <SettingsCard
          title="Site Identity"
          action={<span className="text-[11px] text-neutral-600 font-semibold uppercase tracking-[0.14em]">Brand · SEO · Contact</span>}
        >
          <div className="flex items-center gap-4 pb-6 border-b border-white/8">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {form.logoUrl ? (
                <Image src={form.logoUrl} alt="Logo preview" width={64} height={64} className="object-contain w-full h-full" unoptimized />
              ) : (
                <span className="text-2xl font-black text-white/80">{brandPreview.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xl font-semibold text-white tracking-tight truncate">{brandPreview}</p>
                <div className="w-5 h-5 rounded-md bg-white/[0.04] border border-white/8 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {form.faviconUrl ? (
                    <Image src={form.faviconUrl} alt="Favicon preview" width={20} height={20} className="object-contain w-full h-full" unoptimized />
                  ) : (
                    <ImageIcon size={10} className="text-neutral-600" />
                  )}
                </div>
              </div>
              <p className="text-[13px] text-neutral-500 leading-relaxed">
                Preview ringkas untuk navbar, footer, metadata, dan tombol kontak.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <ImageIcon size={15} className="text-neutral-500" />
              <h3 className="text-[13px] font-bold text-white uppercase tracking-[0.14em]">Branding</h3>
            </div>
            <Field label="Nama Brand">
              <input
                type="text"
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                className={inputCls}
                placeholder="Pakarsheet"
              />
              <p className="text-[12px] text-neutral-600 mt-2">Tampil di samping logo pada Navbar dan Footer.</p>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Logo (PNG/SVG, maks 2MB)</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {form.logoUrl ? (
                      <Image src={form.logoUrl} alt="Logo" width={56} height={56} className="object-contain w-full h-full" unoptimized />
                    ) : (
                      <ImageIcon size={17} className="text-neutral-700" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <label className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white text-[13px] font-medium px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
                      <ImageIcon size={13} />
                      {uploadingKind === "logo" ? "Mengunggah..." : form.logoUrl ? "Ganti" : "Unggah"}
                      <input type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" className="hidden" onChange={onLogoPick} disabled={uploadingKind !== null} />
                    </label>
                    {form.logoUrl && (
                      <button type="button" onClick={() => setForm((f) => ({ ...f, logoUrl: "" }))} className="text-left text-[12px] font-medium text-red-400 hover:text-red-300 transition-colors">
                        Hapus logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className={labelCls}>Favicon (maks 512KB)</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {form.faviconUrl ? (
                      <Image src={form.faviconUrl} alt="Favicon" width={40} height={40} className="object-contain w-10 h-10" unoptimized />
                    ) : (
                      <ImageIcon size={17} className="text-neutral-700" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <label className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white text-[13px] font-medium px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
                      <ImageIcon size={13} />
                      {uploadingKind === "favicon" ? "Mengunggah..." : form.faviconUrl ? "Ganti" : "Unggah"}
                      <input type="file" accept=".ico,image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml" className="hidden" onChange={onFaviconPick} disabled={uploadingKind !== null} />
                    </label>
                    {form.faviconUrl && (
                      <button type="button" onClick={() => setForm((f) => ({ ...f, faviconUrl: "" }))} className="text-left text-[12px] font-medium text-red-400 hover:text-red-300 transition-colors">
                        Hapus favicon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {brandErr && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] px-4 py-3 rounded-lg">{brandErr}</div>
            )}
          </div>

          <div className="space-y-5 pt-6 border-t border-white/8">
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-neutral-500" />
              <h3 className="text-[13px] font-bold text-white uppercase tracking-[0.14em]">SEO & Meta</h3>
            </div>
            <Field label="Meta Title">
              <input type="text" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className={inputCls} placeholder="Pakarsheet - Template Google Sheets..." />
            </Field>
            <Field label="Meta Description">
              <textarea rows={3} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className={inputCls + " resize-none"} placeholder="Deskripsi singkat untuk mesin pencari..." />
            </Field>
            <Field label="Keywords (pisah koma)">
              <input type="text" value={form.metaKeywords} onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })} className={inputCls} placeholder="google sheets, template, otomasi..." />
            </Field>
          </div>

          <div className="space-y-5 pt-6 border-t border-white/8">
            <div className="flex items-center gap-2">
              <ExternalLink size={15} className="text-neutral-500" />
              <h3 className="text-[13px] font-bold text-white uppercase tracking-[0.14em]">Kontak & Link</h3>
            </div>
            <Field label="Nomor WhatsApp">
              <div className="flex items-center gap-2">
                <span className="text-[15px] text-neutral-500 font-mono flex-shrink-0">+62</span>
                <input type="text" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value.replace(/\D/g, "") })} className={inputCls + " font-mono"} placeholder="81234567890" />
              </div>
              <p className="text-[12px] text-neutral-600 mt-2">Tanpa tanda + atau 0 di depan.</p>
            </Field>
            <Field label="Main Lynk.id URL">
              <input type="url" value={form.mainLynkUrl} onChange={(e) => setForm({ ...form, mainLynkUrl: e.target.value })} className={inputCls} placeholder="https://lynk.id/pakarsheet" />
            </Field>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Shop Experience"
          action={<span className="text-[11px] text-neutral-600 font-semibold uppercase tracking-[0.14em]">{categoryPreview.length || CATEGORIES.length} Categories</span>}
        >
          <div className="pb-6 border-b border-white/8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/8 text-[12px] text-neutral-400 mb-4">
              <Tag size={13} className="text-neutral-500" />
              {form.shopBadgeText || "Koleksi Template Premium"}
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white/90 tracking-tight leading-tight whitespace-pre-line">
              {form.shopTitle || "Senjata Rahasia Operasional Bisnis."}
            </h3>
            <p className="text-[14px] text-neutral-500 leading-relaxed mt-3 line-clamp-2">
              {form.shopSubtitle || "Pilih sistem siap pakai yang telah dioptimasi untuk kerja operasional yang lebih cepat."}
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <AlignLeft size={15} className="text-neutral-500" />
              <h3 className="text-[13px] font-bold text-white uppercase tracking-[0.14em]">Shop Header</h3>
            </div>
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
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Semua", ...(categoryPreview.length ? categoryPreview : CATEGORIES)].map((cat) => (
                  <span key={cat} className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/8 text-[11px] text-neutral-500">{cat}</span>
                ))}
              </div>
            </Field>
          </div>

          <div className="space-y-5 pt-6 border-t border-white/8">
            <div className="flex items-center gap-2">
              <MousePointerClick size={15} className="text-neutral-500" />
              <h3 className="text-[13px] font-bold text-white uppercase tracking-[0.14em]">CTA & Payment</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Teks Tombol Beli">
                <input type="text" value={form.shopCtaText} onChange={(e) => setForm({ ...form, shopCtaText: e.target.value })} className={inputCls} placeholder="Beli Sekarang" />
              </Field>
              <Field label="Catatan Pembayaran">
                <input type="text" value={form.shopPaymentNote} onChange={(e) => setForm({ ...form, shopPaymentNote: e.target.value })} className={inputCls} placeholder="Pembayaran aman via Lynk.id" />
              </Field>
            </div>
          </div>

          <div className="space-y-5 pt-6 border-t border-white/8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Star size={15} className="text-neutral-500" />
                <h3 className="text-[13px] font-bold text-white uppercase tracking-[0.14em]">Trust Badges</h3>
              </div>
              <button type="button" onClick={addTrustBadge} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-400 hover:text-white transition-colors">
                <Plus size={14} /> Tambah
              </button>
            </div>
            <p className="text-[13px] text-neutral-600">Tampil di bawah gambar produk di halaman detail.</p>
            {trustBadges.length === 0 && (
              <p className="text-[13px] text-neutral-700 italic">Kosong = pakai default (Premium Quality, Lifetime Update, Cloud Sync).</p>
            )}
            <div className="space-y-2.5">
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <select value={badge.icon} onChange={(e) => updateTrustBadge(i, "icon", e.target.value)} className={inputCls + " appearance-none sm:w-40 flex-shrink-0"}>
                    {ICON_OPTIONS.map((ic) => <option key={ic} value={ic} className="bg-black">{ic}</option>)}
                  </select>
                  <input type="text" value={badge.label} onChange={(e) => updateTrustBadge(i, "label", e.target.value)} className={inputCls} placeholder="Premium Quality" />
                  <IconBtn label="Hapus" variant="danger" onClick={() => removeTrustBadge(i)}><X size={15} /></IconBtn>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 pt-6 border-t border-white/8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Package size={15} className="text-neutral-500" />
                <h3 className="text-[13px] font-bold text-white uppercase tracking-[0.14em]">Fitur Default Produk</h3>
              </div>
              <button type="button" onClick={addShopFeature} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-400 hover:text-white transition-colors">
                <Plus size={14} /> Tambah
              </button>
            </div>
            <p className="text-[13px] text-neutral-600">Dipakai untuk semua produk yang tidak punya fitur sendiri. Kosong = pakai bawaan sistem.</p>
            <div className="space-y-3">
              {shopFeatures.map((feat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-[0.14em]">Fitur {i + 1}</span>
                    <IconBtn label="Hapus" variant="danger" onClick={() => removeShopFeature(i)}><X size={14} /></IconBtn>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input type="text" value={feat.title} onChange={(e) => updateShopFeature(i, "title", e.target.value)} className={inputCls} placeholder="Nama Fitur" />
                    <select value={feat.icon} onChange={(e) => updateShopFeature(i, "icon", e.target.value)} className={inputCls + " appearance-none"}>
                      {ICON_OPTIONS.map((ic) => <option key={ic} value={ic} className="bg-black">{ic}</option>)}
                    </select>
                  </div>
                  <textarea rows={2} value={feat.desc} onChange={(e) => updateShopFeature(i, "desc", e.target.value)} className={inputCls + " resize-none"} placeholder="Deskripsi singkat fitur ini..." />
                </div>
              ))}
            </div>
          </div>
        </SettingsCard>
      </form>
    </motion.div>
  );
}

// ─── Blog Tab ─────────────────────────────────────────────────────────────────
function BlogTab({
  blogPosts,
  isLoading,
  deleteFromSupabase,
}: {
  blogPosts: BlogPost[];
  isLoading: boolean;
  deleteFromSupabase: DeleteFromSupabase;
}) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const published = blogPosts.filter((p) => p.status === "published").length;
  const drafts = blogPosts.filter((p) => p.status === "draft").length;

  const statusStyle: Record<string, string> = {
    published: "bg-green-500/10 text-green-400 border-green-500/20",
    draft: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  };

  return (
    <motion.div key="blog" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader
        title="Blog"
        subtitle={`${published} published · ${drafts} draft`}
        action={<AddButton onClick={() => router.push("/admin/blog/new")} label="Tulis Artikel" />}
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 md:gap-5 mb-7">
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 md:p-8 text-center">
          <div className="text-5xl md:text-6xl font-bold text-white tabular-nums">{blogPosts.length}</div>
          <div className="text-sm text-neutral-600 mt-2 uppercase tracking-wider">Total</div>
        </div>
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 md:p-8 text-center">
          <div className="text-5xl md:text-6xl font-bold text-green-400 tabular-nums">{published}</div>
          <div className="text-sm text-neutral-600 mt-2 uppercase tracking-wider">Published</div>
        </div>
        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 md:p-8 text-center">
          <div className="text-5xl md:text-6xl font-bold text-neutral-400 tabular-nums">{drafts}</div>
          <div className="text-sm text-neutral-600 mt-2 uppercase tracking-wider">Draft</div>
        </div>
      </div>

      {isLoading ? (
        <LoadingRows />
      ) : blogPosts.length === 0 ? (
        <EmptyState message="Belum ada artikel. Mulai tulis artikel pertama kamu." icon={FileText} />
      ) : (
        <div className="space-y-2.5">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#0d0d0d] border border-white/8 rounded-xl p-4 sm:p-5 flex items-start gap-4 sm:gap-5 group hover:border-white/15 transition-colors"
            >
              <div className="w-16 h-16 rounded-lg bg-neutral-900 relative overflow-hidden flex-shrink-0 border border-white/8">
                {post.coverImage ? (
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={18} className="text-neutral-700" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <p className="text-[15px] font-semibold text-white truncate">{post.title}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0 uppercase tracking-wider ${statusStyle[post.status] || statusStyle.draft}`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-[13px] text-neutral-500 line-clamp-1 mb-1.5">{post.excerpt}</p>
                <div className="flex items-center gap-2 sm:gap-3 text-[12px] text-neutral-700 flex-wrap">
                  <span>{post.category}</span>
                  <span className="flex items-center gap-1 tabular-nums"><Eye size={11} /> {post.views || 0}</span>
                  <span className="flex items-center gap-1 tabular-nums"><AlignLeft size={11} /> {post.readingTime || 1} mnt</span>
                  {post.tags?.length > 0 && (
                    <span className="flex items-center gap-1 hidden sm:inline-flex"><Tag size={11} /> {post.tags.slice(0, 2).join(", ")}</span>
                  )}
                </div>
              </div>
              <RowActions>
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Lihat" className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                  <ExternalLink size={16} />
                </a>
                <IconBtn label="Edit" onClick={() => router.push(`/admin/blog/${post.id}`)}><Edit3 size={16} /></IconBtn>
                <IconBtn label="Hapus" variant="danger" onClick={() => setConfirmId(post.id)}><Trash2 size={16} /></IconBtn>
              </RowActions>
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
function CustomOrdersTab({
  deleteFromSupabase,
  saveToSupabase,
}: {
  isLoading: boolean;
  deleteFromSupabase: DeleteFromSupabase;
  saveToSupabase: SaveToSupabase;
}) {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabase) {
        if (!cancelled) setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("custom_orders")
        .select("*")
        .order("createdAt", { ascending: false });
      if (cancelled) return;
      setOrders((data ?? []) as CustomOrder[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
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

  const updateStatus = async (order: CustomOrder, newStatus: string) => {
    await saveToSupabase("custom_orders", { ...order, status: newStatus });
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: newStatus } : o));
  };

  const newCount = orders.filter((o) => o.status === "new").length;

  return (
    <motion.div key="custom_orders" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <PageHeader title="Custom Orders" subtitle={`${orders.length} total · ${newCount} baru`} />

      {loading ? <LoadingRows /> : orders.length === 0 ? (
        <EmptyState message="Belum ada custom order masuk." icon={Star} />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 sm:p-6 group hover:border-white/15 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-[15px] font-semibold text-white">{order.name}</p>
                    <span className={`text-[11px] font-bold uppercase tracking-[0.14em] ${pkgStyle[order.package] ?? "text-neutral-400"}`}>
                      {order.package}
                    </span>
                  </div>
                  <p className="text-[13px] text-neutral-500 truncate">{order.email} · {order.business}</p>
                  <p className="text-[12px] text-neutral-700 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    {order.deadline && ` · Deadline: ${order.deadline}`}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 uppercase tracking-wider ${statusStyle[order.status] ?? statusStyle.new}`}>
                  {order.status.replace("_", " ")}
                </span>
              </div>

              <p className="text-[14px] text-neutral-400 leading-relaxed mb-5 bg-white/[0.02] rounded-lg p-4 border border-white/5 whitespace-pre-wrap">
                {order.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap mb-4 text-[12px] text-neutral-600">
                <span>Tim: {order.teamSize}</span>
                {order.hasMigration && <><span className="text-neutral-800">·</span><span>Ada migrasi data</span></>}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order, s)}
                    className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold border transition-colors capitalize ${
                      order.status === s
                        ? statusStyle[s]
                        : "bg-white/5 text-neutral-500 border-white/8 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
                <div className="ml-auto">
                  <RowActions>
                    <IconBtn label="Hapus" variant="danger" onClick={() => setConfirmId(order.id)}><Trash2 size={15} /></IconBtn>
                  </RowActions>
                </div>
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
