"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useData } from "@/hooks/useData";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Image as ImageIcon, CheckCircle2, Lock, Eye, EyeOff, 
  Edit3, BarChart3, Package, TrendingUp, X, Search, Filter, 
  ExternalLink, MousePointerClick, MessageSquare, BookOpen, 
  Settings as SettingsIcon, Mail, Info, HelpCircle, LayoutDashboard,
  ShieldCheck, Globe, Share2, Upload
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "pakarsheet2024";
const CATEGORIES = ["Keuangan", "Marketing", "Inventory", "HR & Admin", "Lainnya"];

const chartData = [
  { name: 'Sen', clicks: 400 },
  { name: 'Sel', clicks: 300 },
  { name: 'Rab', clicks: 600 },
  { name: 'Kam', clicks: 800 },
  { name: 'Jum', clicks: 500 },
  { name: 'Sab', clicks: 900 },
  { name: 'Min', clicks: 1200 },
];

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px] relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 transition-opacity group-hover:opacity-30 ${color}`} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-neutral-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 group-hover:text-white transition-colors`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'testimonials' | 'academy' | 'requests' | 'settings'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(() => (typeof window !== "undefined" ? sessionStorage.getItem("admin_auth") === "true" : false));
  const { products, testimonials, tutorials, userRequests, settings, isLoading, saveToSupabase, deleteFromSupabase, fetchData } = useData();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form States
  const [formData, setFormData] = useState({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'products') {
      setFormData({ name: item.name, description: item.description, price: item.price.toString(), lynkUrl: item.lynkUrl || "", category: item.category });
      setImagePreviews(item.images || []);
      setImageFiles([]);
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingItem(null);
    setFormData({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
    setImagePreviews([]);
    setImageFiles([]);
  };

  const processFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imagePreviews.length === 0) return alert("Pilih minimal satu gambar.");
    setIsSubmitting(true);

    const uploadedUrls: string[] = [...imagePreviews.filter(url => url.startsWith('http'))];

    if (supabase && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
        if (!uploadError) {
          const { data } = supabase.storage.from('products').getPublicUrl(filePath);
          uploadedUrls.push(data.publicUrl);
        }
      }
    }

    const productData = {
      id: editingItem?.id || Math.random().toString(36).substring(2, 9),
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price || "0", 10),
      images: uploadedUrls,
      lynkUrl: formData.lynkUrl,
      category: formData.category,
      createdAt: editingItem?.createdAt || Date.now(),
      clicks: editingItem?.clicks || 0
    };

    await saveToSupabase('products', productData);
    
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      closeDrawer();
      window.location.reload(); // Force refresh to sync UI
    }, 1500);
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 p-8 rounded-3xl border border-white/10 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">Admin Login</h2>
        <input 
          type="password" 
          placeholder="Password..." 
          className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white mb-4 focus:outline-none focus:border-white/30"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (e.currentTarget.value === ADMIN_PASSWORD) {
                sessionStorage.setItem("admin_auth", "true");
                setIsAuthenticated(true);
              }
            }
          }}
        />
        <p className="text-xs text-neutral-600 text-center">Tekan Enter untuk masuk</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col fixed h-full z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black font-black text-xl flex-shrink-0">P</div>
          <span className="font-bold text-lg hidden md:block tracking-tight text-white/90">Admin Hub</span>
        </div>
        <nav className="flex-1 px-4 mt-6 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Produk', icon: Package },
            { id: 'testimonials', label: 'Testimoni', icon: MessageSquare },
            { id: 'academy', label: 'Academy', icon: BookOpen },
            { id: 'requests', label: 'Requests', icon: Mail },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeTab === item.id ? 'bg-white/10 text-white border border-white/10' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20} className={activeTab === item.id ? 'text-blue-400' : ''} />
              <span className="font-medium hidden md:block">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:text-white hover:bg-white/5 transition-all group">
            <Globe size={18} /><span className="font-medium hidden md:block">Buka Website</span>
          </Link>
          <button onClick={() => { sessionStorage.removeItem("admin_auth"); setIsAuthenticated(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 hover:text-red-400 transition-all group">
            <Lock size={18} /><span className="font-medium hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-20 md:ml-64 p-6 md:p-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Dashboard Insights</h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                  <StatCard title="Total Produk" value={products.length} icon={Package} color="bg-blue-500" />
                  <StatCard title="Total Klik" value={products.reduce((acc, p) => acc + (p.clicks || 0), 0)} icon={MousePointerClick} color="bg-green-500" />
                  <StatCard title="Pending Requests" value={userRequests.filter(r => r.status === 'pending').length} icon={Mail} color="bg-orange-500" />
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-4xl font-bold text-white tracking-tight">Koleksi Produk</h1>
                  <button onClick={() => { setEditingItem(null); setIsDrawerOpen(true); }} className="bg-white text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-neutral-200 transition-all"><Plus size={18} /> Tambah</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {isLoading ? (
                    <div className="text-center py-20 text-neutral-500 animate-pulse font-bold uppercase tracking-widest">Sinkronisasi Database...</div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-24 text-neutral-600 bg-white/[0.01] rounded-[40px] border border-white/5 border-dashed">Belum ada produk di database online ini.</div>
                  ) : products.map(p => (
                    <div key={p.id} className="bg-white/[0.02] border border-white/5 p-5 rounded-[32px] flex items-center gap-5 group hover:bg-white/[0.04] transition-all">
                       <div className="w-16 h-16 rounded-2xl bg-neutral-900 relative overflow-hidden flex-shrink-0 border border-white/10">
                         <Image src={(p.images && p.images.length > 0) ? p.images[0] : ""} alt={p.name} fill className="object-cover" unoptimized />
                       </div>
                       <div className="flex-1">
                         <h4 className="font-bold text-white text-lg leading-tight">{p.name}</h4>
                         <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mt-1">{p.category} • Rp {p.price.toLocaleString("id-ID")}</p>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                         <button onClick={() => handleEdit(p)} className="p-3 rounded-2xl bg-white/5 text-white hover:bg-white/10"><Edit3 size={18} /></button>
                         <button onClick={() => window.confirm("Hapus produk?") && deleteFromSupabase('products', p.id)} className="p-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={18} /></button>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Side Drawer Form - COMPLETELY FIXED SCROLLING */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#080808] border-l border-white/10 z-[60] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white tracking-tight">{editingItem ? "Edit Produk" : "Tambah Produk"}</h2>
                <button onClick={closeDrawer} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-all"><X size={20} /></button>
              </div>

              {/* Form Content Area - MUST SCROLL */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 custom-scrollbar">
                <form onSubmit={handleProductSubmit} className="space-y-8 pb-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Foto Produk</label>
                    <div className="grid grid-cols-2 gap-3">
                      {imagePreviews.map((url, idx) => (
                        <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group bg-neutral-900">
                          <Image src={url} alt="Preview" fill className="object-cover" unoptimized />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><X size={14} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-white/30 bg-white/[0.02] flex flex-col items-center justify-center text-neutral-600 hover:text-white transition-all group">
                        <Plus size={32} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] mt-2 font-black tracking-widest uppercase">Pilih Foto</span>
                      </button>
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" multiple onChange={(e) => e.target.files && processFiles(e.target.files)} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Nama Produk</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Kategori</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-white/30 transition-all font-medium appearance-none">
                        {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Harga (Rp)</label>
                      <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value.replace(/\D/g, "")})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Link Lynk.id</label>
                    <input required type="url" value={formData.lynkUrl} onChange={e => setFormData({...formData, lynkUrl: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all font-medium" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Deskripsi</label>
                    <textarea required rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white resize-none focus:outline-none focus:border-white/30 transition-all font-medium" />
                  </div>
                  
                  <div className="sticky bottom-0 pt-4 bg-[#080808]">
                    <button disabled={isSubmitting} type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-neutral-200 active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl shadow-white/5 flex items-center justify-center gap-3">
                      {isSubmitting ? <><div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Menyimpan...</> : showSuccess ? "Berhasil Diunggah!" : (editingItem ? "Update Produk" : "Simpan ke Database")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
