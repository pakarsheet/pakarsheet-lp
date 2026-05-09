"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useData } from "@/hooks/useData";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, CheckCircle2, Lock, Edit3,
  Package, X, MousePointerClick, MessageSquare,
  BookOpen, Settings as SettingsIcon, Mail,
  LayoutDashboard, Globe, Star, Send, Check,
  AlertCircle, Save, ExternalLink, Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const CATEGORIES = ["Keuangan", "Marketing", "Inventory", "HR & Admin", "Lainnya"];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px] relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 transition-opacity group-hover:opacity-30 ${color}`} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-neutral-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 group-hover:text-white transition-colors">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onLogin();
      } else {
        setError("Password salah. Coba lagi.");
      }
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 p-8 rounded-3xl border border-white/10 w-full max-w-sm"
      >
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black font-black text-2xl mx-auto mb-6">P</div>
        <h2 className="text-2xl font-bold text-white mb-2 text-center tracking-tight">Admin Login</h2>
        <p className="text-neutral-500 text-sm text-center mb-8">Masukkan password untuk melanjutkan</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/30 transition-all"
            autoFocus
          />
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Memverifikasi...</> : "Masuk"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "testimonials" | "academy" | "requests" | "settings">("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const { products, testimonials, tutorials, userRequests, settings, isLoading, saveToSupabase, deleteFromSupabase, fetchData } = useData();

  // Check auth status on mount via a lightweight ping
  useEffect(() => {
    fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: "" }) })
      .then(() => {})
      .catch(() => {});
    // We rely on sessionStorage as a client-side hint to avoid flicker,
    // but the real auth is the httpOnly cookie checked server-side.
    const hint = sessionStorage.getItem("admin_auth");
    if (hint === "true") setIsAuthenticated(true);
    setAuthChecked(true);
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem("admin_auth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  if (!authChecked) return null;
  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col fixed h-full z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black font-black text-xl flex-shrink-0">P</div>
          <span className="font-bold text-lg hidden md:block tracking-tight text-white/90">Admin Hub</span>
        </div>
        <nav className="flex-1 px-4 mt-6 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "products", label: "Produk", icon: Package },
            { id: "testimonials", label: "Testimoni", icon: MessageSquare },
            { id: "academy", label: "Academy", icon: BookOpen },
            { id: "requests", label: "Requests", icon: Mail },
            { id: "settings", label: "Settings", icon: SettingsIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? "bg-white/10 text-white border border-white/10" : "text-neutral-500 hover:text-white hover:bg-white/5"}`}
            >
              <item.icon size={20} className={activeTab === item.id ? "text-blue-400" : ""} />
              <span className="font-medium hidden md:block">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:text-white hover:bg-white/5 transition-all">
            <Globe size={18} /><span className="font-medium hidden md:block">Buka Website</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 hover:text-red-400 transition-all">
            <Lock size={18} /><span className="font-medium hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-20 md:ml-64 p-6 md:p-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && <DashboardTab key="dashboard" products={products} userRequests={userRequests} testimonials={testimonials} />}
            {activeTab === "products" && <ProductsTab key="products" products={products} isLoading={isLoading} saveToSupabase={saveToSupabase} deleteFromSupabase={deleteFromSupabase} fetchData={fetchData} />}
            {activeTab === "testimonials" && <TestimonialsTab key="testimonials" testimonials={testimonials} isLoading={isLoading} saveToSupabase={saveToSupabase} deleteFromSupabase={deleteFromSupabase} />}
            {activeTab === "academy" && <AcademyTab key="academy" tutorials={tutorials} isLoading={isLoading} saveToSupabase={saveToSupabase} deleteFromSupabase={deleteFromSupabase} />}
            {activeTab === "requests" && <RequestsTab key="requests" userRequests={userRequests} isLoading={isLoading} saveToSupabase={saveToSupabase} deleteFromSupabase={deleteFromSupabase} />}
            {activeTab === "settings" && <SettingsTab key="settings" settings={settings} saveToSupabase={saveToSupabase} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab({ products, userRequests, testimonials }: { products: any[]; userRequests: any[]; testimonials: any[] }) {
  // Build click chart from real product data
  const chartData = products.slice(0, 7).map((p) => ({
    name: p.name.length > 10 ? p.name.substring(0, 10) + "…" : p.name,
    clicks: p.clicks || 0,
  }));

  const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0);
  const pendingRequests = userRequests.filter((r) => r.status === "pending").length;

  return (
    <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Dashboard Insights</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Produk" value={products.length} icon={Package} color="bg-blue-500" />
        <StatCard title="Total Klik" value={totalClicks} icon={MousePointerClick} color="bg-green-500" />
        <StatCard title="Pending Requests" value={pendingRequests} icon={Mail} color="bg-orange-500" />
      </div>

      {chartData.length > 0 && (
        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 mb-8">
          <h2 className="text-lg font-bold text-white mb-6 tracking-tight">Klik per Produk</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 11 }} />
              <YAxis stroke="#555" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Area type="monotone" dataKey="clicks" stroke="#3b82f6" fill="url(#clickGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
          <h2 className="text-lg font-bold text-white mb-4 tracking-tight">Produk Terpopuler</h2>
          {products.length === 0 ? (
            <p className="text-neutral-600 text-sm">Belum ada produk.</p>
          ) : (
            <div className="space-y-3">
              {[...products].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <span className="text-neutral-300 text-sm truncate max-w-[200px]">{p.name}</span>
                  <span className="text-blue-400 text-sm font-bold">{p.clicks || 0} klik</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
          <h2 className="text-lg font-bold text-white mb-4 tracking-tight">Testimoni Terbaru</h2>
          {testimonials.length === 0 ? (
            <p className="text-neutral-600 text-sm">Belum ada testimoni.</p>
          ) : (
            <div className="space-y-3">
              {testimonials.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-neutral-500 text-xs line-clamp-1">{t.content}</p>
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
// Each image slot is either:
//   { type: "existing", url: string }  — already uploaded to Supabase (keep as-is)
//   { type: "new", preview: string, file: File }  — local file, needs uploading
type ImageSlot =
  | { type: "existing"; url: string }
  | { type: "new"; preview: string; file: File };

function ProductsTab({ products, isLoading, saveToSupabase, deleteFromSupabase, fetchData }: any) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
  // Single source of truth for images — no more parallel arrays
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingItem(null);
    setFormData({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
    setImageSlots([]);
    setUploadError(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      lynkUrl: item.lynkUrl || "",
      category: item.category,
    });
    // Load existing images as "existing" slots
    const existingUrls: string[] = item.images || (item.image ? [item.image] : []);
    setImageSlots(existingUrls.map((url) => ({ type: "existing", url })));
    setUploadError(null);
    setIsDrawerOpen(true);
  };

  const addFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSlots((prev) => [
          ...prev,
          { type: "new", preview: reader.result as string, file },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSlot = (index: number) => {
    setImageSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageSlots.length === 0) return alert("Pilih minimal satu gambar.");
    setIsSubmitting(true);
    setUploadError(null);

    const finalUrls: string[] = [];

    for (const slot of imageSlots) {
      if (slot.type === "existing") {
        // Already on Supabase — keep the URL directly
        finalUrls.push(slot.url);
      } else {
        // New file — upload to Supabase Storage
        if (supabase) {
          const fileExt = slot.file.name.split(".").pop() || "jpg";
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `product-images/${fileName}`;

          const { error: storageError } = await supabase.storage
            .from("products")
            .upload(filePath, slot.file, { upsert: false });

          if (storageError) {
            console.error("Upload error:", storageError);
            setUploadError(`Gagal upload gambar: ${storageError.message}`);
            setIsSubmitting(false);
            return;
          }

          const { data: urlData } = supabase.storage
            .from("products")
            .getPublicUrl(filePath);

          finalUrls.push(urlData.publicUrl);
        } else {
          // No Supabase — store base64 locally (dev/fallback mode)
          finalUrls.push(slot.preview);
        }
      }
    }

    const productData = {
      id: editingItem?.id || Math.random().toString(36).substring(2, 9),
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price || "0", 10),
      images: finalUrls,
      lynkUrl: formData.lynkUrl,
      category: formData.category,
      createdAt: editingItem?.createdAt || Date.now(),
      clicks: editingItem?.clicks || 0,
    };

    await saveToSupabase("products", productData);
    await fetchData();

    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      closeDrawer();
    }, 1500);
  };

  return (
    <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">Koleksi Produk</h1>
        <button onClick={() => { setEditingItem(null); setIsDrawerOpen(true); }} className="bg-white text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-neutral-200 transition-all">
          <Plus size={18} /> Tambah
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-20 text-neutral-500 animate-pulse font-bold uppercase tracking-widest">Sinkronisasi Database...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-neutral-600 bg-white/[0.01] rounded-[40px] border border-white/5 border-dashed">Belum ada produk.</div>
        ) : (
          products.map((p: any) => (
            <div key={p.id} className="bg-white/[0.02] border border-white/5 p-5 rounded-[32px] flex items-center gap-5 group hover:bg-white/[0.04] transition-all">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 relative overflow-hidden flex-shrink-0 border border-white/10">
                {(p.images?.[0] || p.image) && (
                  <Image src={p.images?.[0] || p.image} alt={p.name} fill className="object-cover" unoptimized />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg leading-tight">{p.name}</h4>
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mt-1">{p.category} • Rp {p.price.toLocaleString("id-ID")} • {p.clicks || 0} klik</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                <button onClick={() => handleEdit(p)} className="p-3 rounded-2xl bg-white/5 text-white hover:bg-white/10"><Edit3 size={18} /></button>
                <button onClick={() => window.confirm("Hapus produk ini?") && deleteFromSupabase("products", p.id)} className="p-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={18} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#080808] border-l border-white/10 z-[60] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white tracking-tight">{editingItem ? "Edit Produk" : "Tambah Produk"}</h2>
                <button onClick={closeDrawer} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-all"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 custom-scrollbar">
                <form onSubmit={handleProductSubmit} className="space-y-8 pb-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
                      Foto Produk ({imageSlots.length} dipilih)
                    </label>
                    {uploadError && (
                      <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                        <AlertCircle size={14} className="flex-shrink-0" /> {uploadError}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {imageSlots.map((slot, idx) => (
                        <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group bg-neutral-900">
                          <Image
                            src={slot.type === "existing" ? slot.url : slot.preview}
                            alt={`Preview ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <span className={`absolute top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded-full ${slot.type === "existing" ? "bg-blue-500/80 text-white" : "bg-green-500/80 text-white"}`}>
                            {slot.type === "existing" ? "SAVED" : "NEW"}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSlot(idx)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-white/30 bg-white/[0.02] flex flex-col items-center justify-center text-neutral-600 hover:text-white transition-all group"
                      >
                        <Plus size={32} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] mt-2 font-black tracking-widest uppercase">Pilih Foto</span>
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => e.target.files && addFiles(e.target.files)}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Nama Produk</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Kategori</label>
                      <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-white/30 transition-all font-medium appearance-none">
                        {CATEGORIES.map((cat) => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Harga (Rp)</label>
                      <input required type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/\D/g, "") })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Link Lynk.id</label>
                    <input required type="url" value={formData.lynkUrl} onChange={(e) => setFormData({ ...formData, lynkUrl: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-medium" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Deskripsi</label>
                    <textarea required rows={6} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white resize-none focus:outline-none focus:border-white/30 transition-all font-medium" />
                  </div>
                  <div className="sticky bottom-0 pt-4 bg-[#080808]">
                    <button disabled={isSubmitting} type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-neutral-200 active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl shadow-white/5 flex items-center justify-center gap-3">
                      {isSubmitting ? <><div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Menyimpan...</> : showSuccess ? <><Check size={18} /> Berhasil!</> : (editingItem ? "Update Produk" : "Simpan ke Database")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Testimonials Tab ─────────────────────────────────────────────────────────
function TestimonialsTab({ testimonials, isLoading, saveToSupabase, deleteFromSupabase }: any) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", content: "", rating: "5" });

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingItem(null);
    setFormData({ name: "", role: "", content: "", rating: "5" });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ name: item.name, role: item.role, content: item.content, rating: String(item.rating || 5) });
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = {
      id: editingItem?.id || Math.random().toString(36).substring(2, 9),
      name: formData.name,
      role: formData.role,
      content: formData.content,
      rating: parseInt(formData.rating, 10),
      createdAt: editingItem?.createdAt || Date.now(),
    };
    await saveToSupabase("testimonials", data);
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); closeDrawer(); }, 1500);
  };

  return (
    <motion.div key="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">Testimoni</h1>
        <button onClick={() => { setEditingItem(null); setIsDrawerOpen(true); }} className="bg-white text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-neutral-200 transition-all">
          <Plus size={18} /> Tambah
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-20 text-neutral-500 animate-pulse font-bold uppercase tracking-widest">Memuat...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-24 text-neutral-600 bg-white/[0.01] rounded-[40px] border border-white/5 border-dashed">Belum ada testimoni.</div>
        ) : (
          testimonials.map((t: any) => (
            <div key={t.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] flex items-start gap-5 group hover:bg-white/[0.04] transition-all">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                {t.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <span className="text-xs text-neutral-500">• {t.role}</span>
                  <div className="flex items-center gap-0.5 ml-auto">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-400 text-sm line-clamp-2">{t.content}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleEdit(t)} className="p-3 rounded-2xl bg-white/5 text-white hover:bg-white/10"><Edit3 size={16} /></button>
                <button onClick={() => window.confirm("Hapus testimoni ini?") && deleteFromSupabase("testimonials", t.id)} className="p-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#080808] border-l border-white/10 z-[60] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{editingItem ? "Edit Testimoni" : "Tambah Testimoni"}</h2>
                <button onClick={closeDrawer} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6 pb-12">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Nama</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Jabatan / Role</label>
                    <input required type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Rating (1-5)</label>
                    <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-white/30 transition-all appearance-none">
                      {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r} className="bg-black">{r} Bintang</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Isi Testimoni</label>
                    <textarea required rows={6} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white resize-none focus:outline-none focus:border-white/30 transition-all" />
                  </div>
                  <div className="sticky bottom-0 pt-4 bg-[#080808]">
                    <button disabled={isSubmitting} type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                      {isSubmitting ? <><div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Menyimpan...</> : showSuccess ? <><Check size={18} /> Berhasil!</> : (editingItem ? "Update" : "Simpan")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Academy Tab ──────────────────────────────────────────────────────────────
function AcademyTab({ tutorials, isLoading, saveToSupabase, deleteFromSupabase }: any) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", videoUrl: "", category: "Keuangan" });

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingItem(null);
    setFormData({ title: "", content: "", videoUrl: "", category: "Keuangan" });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ title: item.title, content: item.content, videoUrl: item.videoUrl || "", category: item.category });
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = {
      id: editingItem?.id || Math.random().toString(36).substring(2, 9),
      title: formData.title,
      content: formData.content,
      videoUrl: formData.videoUrl || null,
      category: formData.category,
      createdAt: editingItem?.createdAt || Date.now(),
    };
    await saveToSupabase("tutorials", data);
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); closeDrawer(); }, 1500);
  };

  return (
    <motion.div key="academy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">Academy</h1>
        <button onClick={() => { setEditingItem(null); setIsDrawerOpen(true); }} className="bg-white text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-neutral-200 transition-all">
          <Plus size={18} /> Tambah Tutorial
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-20 text-neutral-500 animate-pulse font-bold uppercase tracking-widest">Memuat...</div>
        ) : tutorials.length === 0 ? (
          <div className="text-center py-24 text-neutral-600 bg-white/[0.01] rounded-[40px] border border-white/5 border-dashed">Belum ada tutorial.</div>
        ) : (
          tutorials.map((t: any) => (
            <div key={t.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] flex items-start gap-5 group hover:bg-white/[0.04] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                {t.videoUrl ? <Video size={20} /> : <BookOpen size={20} />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">{t.title}</h4>
                <p className="text-xs text-neutral-500 uppercase tracking-widest">{t.category}</p>
                {t.videoUrl && (
                  <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 flex items-center gap-1 mt-1 hover:underline">
                    <ExternalLink size={10} /> Lihat Video
                  </a>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleEdit(t)} className="p-3 rounded-2xl bg-white/5 text-white hover:bg-white/10"><Edit3 size={16} /></button>
                <button onClick={() => window.confirm("Hapus tutorial ini?") && deleteFromSupabase("tutorials", t.id)} className="p-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#080808] border-l border-white/10 z-[60] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{editingItem ? "Edit Tutorial" : "Tambah Tutorial"}</h2>
                <button onClick={closeDrawer} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6 pb-12">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Judul Tutorial</label>
                    <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Kategori</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-white/30 transition-all appearance-none">
                      {CATEGORIES.map((cat) => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Link Video (opsional)</label>
                    <input type="url" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="https://youtube.com/..." className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-neutral-700" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Konten (Markdown)</label>
                    <textarea required rows={10} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="## Cara Penggunaan&#10;&#10;1. Buka template...&#10;2. ..." className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white resize-none focus:outline-none focus:border-white/30 transition-all font-mono text-sm placeholder:text-neutral-700" />
                  </div>
                  <div className="sticky bottom-0 pt-4 bg-[#080808]">
                    <button disabled={isSubmitting} type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                      {isSubmitting ? <><div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Menyimpan...</> : showSuccess ? <><Check size={18} /> Berhasil!</> : (editingItem ? "Update Tutorial" : "Simpan Tutorial")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Requests Tab ─────────────────────────────────────────────────────────────
function RequestsTab({ userRequests, isLoading, saveToSupabase, deleteFromSupabase }: any) {
  const statusColors: Record<string, string> = {
    pending: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    reviewed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  const updateStatus = async (req: any, status: string) => {
    await saveToSupabase("user_requests", { ...req, status });
  };

  return (
    <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">User Requests</h1>
        <div className="text-sm text-neutral-500">
          {userRequests.filter((r: any) => r.status === "pending").length} pending
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-20 text-neutral-500 animate-pulse font-bold uppercase tracking-widest">Memuat...</div>
        ) : userRequests.length === 0 ? (
          <div className="text-center py-24 text-neutral-600 bg-white/[0.01] rounded-[40px] border border-white/5 border-dashed">Belum ada request masuk.</div>
        ) : (
          userRequests.map((req: any) => (
            <div key={req.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] group hover:bg-white/[0.04] transition-all">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-bold text-white">{req.email}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{new Date(req.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[req.status] || statusColors.pending}`}>
                  {req.status}
                </span>
              </div>
              <p className="text-neutral-400 text-sm mb-4">{req.request}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {["pending", "reviewed", "completed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(req, s)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${req.status === s ? statusColors[s] : "bg-white/5 text-neutral-500 border-white/10 hover:bg-white/10"}`}
                  >
                    {s}
                  </button>
                ))}
                <button onClick={() => window.confirm("Hapus request ini?") && deleteFromSupabase("user_requests", req.id)} className="ml-auto p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ settings, saveToSupabase }: any) {
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    whatsappNumber: "",
    mainLynkUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Populate form when settings load from DB
  useEffect(() => {
    if (settings) {
      setFormData({
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || "",
        metaKeywords: settings.metaKeywords || "",
        whatsappNumber: settings.whatsappNumber || "",
        mainLynkUrl: settings.mainLynkUrl || "",
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await saveToSupabase("site_settings", {
      id: settings?.id || "main",
      ...formData,
    });
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Settings</h1>
      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6">
          <h2 className="text-lg font-bold text-white tracking-tight">SEO & Meta</h2>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Meta Title</label>
            <input type="text" value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} placeholder="Pakarsheet - Template Google Sheets..." className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-neutral-700" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Meta Description</label>
            <textarea rows={3} value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} placeholder="Deskripsi singkat untuk mesin pencari..." className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white resize-none focus:outline-none focus:border-white/30 transition-all placeholder:text-neutral-700" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Keywords (pisah koma)</label>
            <input type="text" value={formData.metaKeywords} onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })} placeholder="google sheets, template, otomasi..." className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-neutral-700" />
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6">
          <h2 className="text-lg font-bold text-white tracking-tight">Kontak & Link</h2>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Nomor WhatsApp</label>
            <div className="flex items-center gap-3">
              <span className="text-neutral-500 text-sm font-mono">+62</span>
              <input type="text" value={formData.whatsappNumber} onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value.replace(/\D/g, "") })} placeholder="81234567890" className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-neutral-700 font-mono" />
            </div>
            <p className="text-xs text-neutral-600">Tanpa tanda + atau 0 di depan. Contoh: 81234567890</p>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Main Lynk.id URL</label>
            <input type="url" value={formData.mainLynkUrl} onChange={(e) => setFormData({ ...formData, mainLynkUrl: e.target.value })} placeholder="https://lynk.id/pakarsheet" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-neutral-700" />
          </div>
        </div>

        <button type="submit" disabled={isSaving} className="bg-white text-black font-black px-10 py-5 rounded-2xl hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center gap-3">
          {isSaving ? <><div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Menyimpan...</> : showSuccess ? <><Check size={18} /> Tersimpan!</> : <><Save size={18} /> Simpan Pengaturan</>}
        </button>
      </form>
    </motion.div>
  );
}
