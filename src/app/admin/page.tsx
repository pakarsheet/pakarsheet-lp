"use client";

import { useState, useMemo } from "react";
import { useData } from "@/hooks/useData";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Image as ImageIcon, CheckCircle2, Lock, Eye, EyeOff, 
  Edit3, BarChart3, Package, TrendingUp, X, Search, Filter, 
  ExternalLink, MousePointerClick, MessageSquare, BookOpen, 
  Settings as SettingsIcon, Mail, Info, HelpCircle, LayoutDashboard,
  ShieldCheck, Globe, Share2
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
  const { products, testimonials, tutorials, userRequests, settings, isLoading, saveToSupabase, deleteFromSupabase } = useData();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Authentication handled in separate component or inline
  if (!isAuthenticated) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 p-8 rounded-3xl border border-white/10 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
        <input 
          type="password" 
          placeholder="Password..." 
          className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white mb-4"
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
                      {userRequests.slice(0, 3).map(req => (
                        <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                          <p className="text-sm text-neutral-400 truncate max-w-[150px]">{req.request}</p>
                          <span className="text-[10px] font-bold bg-orange-500/10 text-orange-400 px-2 py-1 rounded">{req.status}</span>
                        </div>
                      ))}
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
                  <button onClick={() => { setEditingItem(null); setIsDrawerOpen(true); }} className="bg-white text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2"><Plus size={18} /> Tambah</button>
                </div>
                {/* List products similar to previous version but integrated with useData */}
                <div className="grid grid-cols-1 gap-4">
                  {products.map(p => (
                    <div key={p.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-4 group">
                       <div className="w-16 h-16 rounded-xl bg-neutral-900 relative overflow-hidden"><Image src={p.image} alt={p.name} fill className="object-cover" unoptimized /></div>
                       <div className="flex-1">
                         <h4 className="font-bold text-white">{p.name}</h4>
                         <p className="text-xs text-neutral-500">{p.category} • Rp {p.price.toLocaleString()}</p>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleEdit(p)} className="p-2 rounded-lg bg-white/5 text-white"><Edit3 size={16} /></button>
                         <button onClick={() => deleteFromSupabase('products', p.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400"><Trash2 size={16} /></button>
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
                    <input type="text" defaultValue={settings?.metaTitle} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2"><Info size={14} /> Meta Description</label>
                    <textarea defaultValue={settings?.metaDescription} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={14} /> WhatsApp CS</label>
                      <input type="text" defaultValue={settings?.whatsappNumber} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2"><Share2 size={14} /> Profil Lynk.id</label>
                      <input type="text" defaultValue={settings?.mainLynkUrl} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white" />
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">Simpan Perubahan Global</button>
                </div>
              </motion.div>
            )}

            {/* Other tabs follow the same pattern... */}
          </AnimatePresence>

        </div>
      </main>

      {/* Reusable Side Drawer for all tabs */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0a0a0a] border-l border-white/10 z-[60] p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Editor Konten</h2>
              <p className="text-neutral-500 mb-8">Fitur CRUD untuk {activeTab} akan diimplementasikan di sini.</p>
              <button onClick={() => setIsDrawerOpen(false)} className="w-full bg-white/10 text-white py-4 rounded-xl">Tutup</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
