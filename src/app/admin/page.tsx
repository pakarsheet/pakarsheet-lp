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

// --- Mock Chart Data ---
const chartData = [
  { name: 'Sen', clicks: 400 },
  { name: 'Sel', clicks: 300 },
  { name: 'Rab', clicks: 600 },
  { name: 'Kam', clicks: 800 },
  { name: 'Jum', clicks: 500 },
  { name: 'Sab', clicks: 900 },
  { name: 'Min', clicks: 1200 },
];

// --- Components ---

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

  // Form States for Products
  const [formData, setFormData] = useState({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'products') {
      setFormData({ name: item.name, description: item.description, price: item.price.toString(), lynkUrl: item.lynkUrl || "", category: item.category });
      setImagePreview(item.image);
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingItem(null);
    setFormData({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
    setImagePreview(null);
    setImageFile(null);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = imagePreview;

    // Handle Image Upload to Supabase Storage if new file selected
    if (supabase && imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile);

      if (!uploadError) {
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
    }

    const productData = {
      id: editingItem?.id || Math.random().toString(36).substring(2, 9),
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price || "0", 10),
      image: imageUrl,
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
    }, 1500);
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 p-8 rounded-3xl border border-white/10 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
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
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeTab === item.id ? 'bg-white/10 text-white border border-white/10' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-blue-400' : ''} />
              <span className="font-medium hidden md:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:text-white hover:bg-white/5 transition-all group">
            <Globe size={18} />
            <span className="font-medium hidden md:block">Buka Website</span>
          </Link>
          <button 
            onClick={() => { sessionStorage.removeItem("admin_auth"); setIsAuthenticated(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 hover:text-red-400 transition-all group"
          >
            <Lock size={18} />
            <span className="font-medium hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 md:ml-64 p-6 md:p-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Dashboard Insights</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                  <StatCard title="Total Produk" value={products.length} icon={Package} color="bg-blue-500" />
                  <StatCard title="Total Klik" value={products.reduce((acc, p) => acc + (p.clicks || 0), 0)} icon={MousePointerClick} color="bg-green-500" />
                  <StatCard title="Pending Requests" value={userRequests.filter(r => r.status === 'pending').length} icon={Mail} color="bg-orange-500" />
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] mb-12">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white">Tren Pengunjung (7 Hari Terakhir)</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-bold bg-white/5 px-4 py-2 rounded-full">
                      <TrendingUp size={14} className="text-green-400" /> +24% vs minggu lalu
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', fontSize: '12px'}}
                          itemStyle={{color: '#fff'}}
                        />
                        <Area type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[24px]">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Mail size={18} /> Request Terbaru</h4>
                    <div className="space-y-4">
                      {userRequests.length > 0 ? userRequests.slice(0, 3).map(req => (
                        <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                          <p className="text-sm text-neutral-400 truncate max-w-[150px]">{req.request}</p>
                          <span className="text-[10px] font-bold bg-orange-500/10 text-orange-400 px-2 py-1 rounded">{req.status}</span>
                        </div>
                      )) : <p className="text-sm text-neutral-600">Belum ada request.</p>}
                    </div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[24px]">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2"><HelpCircle size={18} /> Bantuan Cepat</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <a href="https://wa.me/628123456789" className="p-4 rounded-xl bg-green-500/10 text-green-400 text-xs font-bold text-center border border-green-500/10 hover:bg-green-500/20 transition-all">WhatsApp CS</a>
                      <button className="p-4 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-bold text-center border border-blue-500/10 hover:bg-blue-500/20 transition-all">Panduan Setup</button>
                    </div>
                  </div>
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
                    <div className="text-center py-20 text-neutral-500 animate-pulse">Memuat produk...</div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-20 text-neutral-600 bg-white/[0.01] rounded-3xl border border-white/5">Belum ada produk. Klik "Tambah" untuk memulai.</div>
                  ) : products.map(p => (
                    <div key={p.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.04] transition-all">
                       <div className="w-16 h-16 rounded-xl bg-neutral-900 relative overflow-hidden flex-shrink-0 border border-white/5"><Image src={p.image} alt={p.name} fill className="object-cover" unoptimized /></div>
                       <div className="flex-1">
                         <h4 className="font-bold text-white">{p.name}</h4>
                         <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mt-0.5">{p.category} • Rp {p.price.toLocaleString("id-ID")}</p>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                         <button onClick={() => handleEdit(p)} className="p-2.5 rounded-xl bg-white/5 text-white hover:bg-white/10"><Edit3 size={18} /></button>
                         <button onClick={() => window.confirm("Hapus produk?") && deleteFromSupabase('products', p.id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={18} /></button>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
                <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Site Settings</h1>
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2"><Globe size={14} /> Meta Title</label>
                    <input type="text" defaultValue={settings?.metaTitle} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-white/30 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2"><Info size={14} /> Meta Description</label>
                    <textarea defaultValue={settings?.metaDescription} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white resize-none focus:outline-none focus:border-white/30 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={14} /> WhatsApp CS</label>
                      <input type="text" defaultValue={settings?.whatsappNumber} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-white/30 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2"><Share2 size={14} /> Profil Lynk.id</label>
                      <input type="text" defaultValue={settings?.mainLynkUrl} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-white/30 transition-all" />
                    </div>
                  </div>
                  <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 transition-all shadow-xl shadow-white/5">Simpan Perubahan Global</button>
                </div>
              </motion.div>
            )}

            {/* Testimonials Tab Placeholder */}
            {activeTab === 'testimonials' && (
              <motion.div key="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-4xl font-bold text-white tracking-tight">Testimoni</h1>
                  <button onClick={() => { setEditingItem(null); setIsDrawerOpen(true); }} className="bg-white text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2"><Plus size={18} /> Tambah</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.length > 0 ? testimonials.map(t => (
                    <div key={t.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                      <p className="text-white font-bold">{t.name}</p>
                      <p className="text-sm text-neutral-500 italic mt-2">"{t.content}"</p>
                    </div>
                  )) : <div className="col-span-2 text-center py-20 text-neutral-600 bg-white/[0.01] rounded-3xl border border-white/5">Belum ada testimoni.</div>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Side Drawer Form */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0a0a0a] border-l border-white/10 z-[60] shadow-2xl p-8 flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold text-white tracking-tight">{editingItem ? "Edit" : "Tambah Baru"}</h2>
                <button onClick={closeDrawer} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-all">
                  <X size={24} />
                </button>
              </div>

              {activeTab === 'products' ? (
                <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Image</label>
                    <div onClick={() => fileInputRef.current?.click()} className="relative w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-white/30 bg-white/[0.02] flex items-center justify-center overflow-hidden cursor-pointer">
                      {imagePreview ? <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized /> : <Upload size={24} className="text-neutral-600" />}
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Nama Produk</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Kategori</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white outline-none">
                        {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Harga (Rp)</label>
                      <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value.replace(/\D/g, "")})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Link Lynk.id</label>
                    <input required type="url" value={formData.lynkUrl} onChange={e => setFormData({...formData, lynkUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Deskripsi</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white resize-none" />
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 transition-all disabled:opacity-50 mt-4">
                    {isSubmitting ? "Menyimpan..." : showSuccess ? "Berhasil!" : (editingItem ? "Update Produk" : "Tambah Produk")}
                  </button>
                </form>
              ) : (
                <div className="text-center py-20 text-neutral-600">Form untuk modul {activeTab} akan segera hadir.</div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
