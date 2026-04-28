"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useProducts, Product } from "@/hooks/useProducts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Plus, Trash2, Image as ImageIcon, CheckCircle2, 
  Lock, Eye, EyeOff, Edit3, BarChart3, Package, TrendingUp, X,
  Search, Filter, ChevronRight, LayoutGrid, List as ListIcon,
  ExternalLink, MousePointerClick, MoreVertical
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "pakarsheet2024";
const CATEGORIES = ["Keuangan", "Marketing", "Inventory", "HR & Admin", "Lainnya"];

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

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      onSuccess();
    } else {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative z-10">
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-[28px] bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/20">
            <Lock className="text-black" size={32} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight">Admin Area</h1>
        <p className="text-neutral-500 text-center mb-10">Masukkan akses keamanan Pakarsheet</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
              className={`w-full bg-white/[0.03] border rounded-[20px] px-6 py-4 text-white placeholder:text-neutral-600 focus:outline-none transition-all pr-14 ${error ? "border-red-500/50 animate-shake" : "border-white/10 focus:border-white/30 focus:bg-white/[0.05]"}`}
              autoFocus
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-5 flex items-center text-neutral-500 hover:text-white transition-colors">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-[20px] hover:bg-neutral-200 transition-all active:scale-[0.98] shadow-xl">Masuk</button>
        </form>
      </motion.div>
    </div>
  );
}

// --- Main Page ---

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => (typeof window !== "undefined" ? sessionStorage.getItem("admin_auth") === "true" : false));
  const { products, addProduct, updateProduct, deleteProduct, isLoading } = useProducts();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");

  const [formData, setFormData] = useState({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0);
    const mostClicked = [...products].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];
    return { totalProducts: products.length, totalClicks, topProduct: mostClicked?.name || "-" };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === "Semua" || p.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, filterCategory]);

  if (!isAuthenticated) return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, description: product.description, price: product.price.toString(), lynkUrl: product.lynkUrl, category: product.category });
    setImagePreview(product.image);
    setImageFile(null);
    setIsDrawerOpen(true);
  };

  const openAddDrawer = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
    setImagePreview(null);
    setImageFile(null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setEditingProduct(null);
      setFormData({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
      setImagePreview(null);
      setImageFile(null);
    }, 300);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const productData = { 
      name: formData.name, description: formData.description, 
      price: parseInt(formData.price || "0", 10), 
      image: imagePreview || "", lynkUrl: formData.lynkUrl, category: formData.category 
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productData, imageFile || undefined);
    } else {
      await addProduct(productData, imageFile || undefined);
    }

    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      closeDrawer();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex">
      
      {/* 1. Sidebar - Slim & Premium */}
      <aside className="w-20 md:w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col items-center md:items-stretch fixed h-full z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] flex-shrink-0">P</div>
          <span className="font-bold text-lg hidden md:block tracking-tight text-white/90">Pakarsheet</span>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 group transition-all">
            <Package size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium hidden md:block">Produk</span>
          </button>
          <Link href="/shop" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:text-white hover:bg-white/5 group transition-all">
            <ImageIcon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium hidden md:block">Lihat Toko</span>
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={() => { sessionStorage.removeItem("admin_auth"); setIsAuthenticated(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 hover:text-red-400 hover:bg-red-400/5 transition-all group"
          >
            <Lock size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="font-medium hidden md:block">Keluar</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content - Spacious & Clean */}
      <main className="flex-1 ml-20 md:ml-64 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Manajemen Konten</h1>
              <p className="text-neutral-500">Kelola dan pantau performa template digital Anda.</p>
            </div>
            <button 
              onClick={openAddDrawer}
              className="bg-white text-black font-bold px-8 py-4 rounded-[18px] flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all active:scale-[0.98] shadow-2xl shadow-white/5"
            >
              <Plus size={20} strokeWidth={3} /> Tambah Produk
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <StatCard title="Total Koleksi" value={stats.totalProducts} icon={Package} color="bg-blue-500" />
            <StatCard title="Klik Pengunjung" value={stats.totalClicks} icon={MousePointerClick} color="bg-green-500" />
            <StatCard title="Top Performer" value={stats.topProduct} icon={TrendingUp} color="bg-purple-500" />
          </div>

          {/* Data List Toolbar */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-2 mb-8 flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
              <input 
                type="text" 
                placeholder="Cari nama produk..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-4 pl-14 pr-6 text-white focus:outline-none placeholder:text-neutral-700"
              />
            </div>
            <div className="flex gap-2 p-1">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/5 border border-white/5 text-white rounded-2xl px-6 py-2 text-sm focus:outline-none focus:border-white/20 transition-all"
              >
                <option value="Semua">Semua Kategori</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Product List - Elegant Table */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-6 text-neutral-500 font-medium text-sm">Produk</th>
                    <th className="px-8 py-6 text-neutral-500 font-medium text-sm">Kategori</th>
                    <th className="px-8 py-6 text-neutral-500 font-medium text-sm">Harga</th>
                    <th className="px-8 py-6 text-neutral-500 font-medium text-sm">Statistik</th>
                    <th className="px-8 py-6 text-neutral-500 font-medium text-sm text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr><td colSpan={5} className="px-8 py-20 text-center text-neutral-500 animate-pulse">Menghubungkan ke database...</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan={5} className="px-8 py-20 text-center text-neutral-500">Tidak ada produk ditemukan.</td></tr>
                  ) : filteredProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-white/[0.015] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 flex-shrink-0 relative">
                            <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{product.name}</p>
                            <Link href={`/shop/${product.id}`} className="text-xs text-neutral-600 hover:text-white flex items-center gap-1 mt-1">
                              ID: {product.id} <ExternalLink size={10} />
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-semibold text-white">
                        Rp {product.price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-green-400 font-bold text-sm bg-green-400/10 w-fit px-3 py-1 rounded-lg">
                          <TrendingUp size={14} /> {product.clicks || 0}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => window.confirm("Hapus produk permanen?") && deleteProduct(product.id, product.image)}
                            className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Side Drawer Form - The " linear" style Editor */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#0a0a0a] border-l border-white/10 z-[60] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{editingProduct ? "Edit Produk" : "Produk Baru"}</h2>
                  <p className="text-neutral-500 text-sm mt-1">Lengkapi detail informasi di bawah ini.</p>
                </div>
                <button onClick={closeDrawer} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                {/* Image Upload Row */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-neutral-400 uppercase tracking-widest">Cover Image</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full aspect-video rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer ${imagePreview ? 'border-transparent' : 'border-white/10 hover:border-white/30 bg-white/[0.02]'}`}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full group">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                          <span className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold">Ganti Gambar</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3"><Upload size={24} className="text-neutral-600" /></div>
                        <p className="text-sm text-neutral-500">Klik untuk upload (Rasio 16:9 atau 1:1)</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Nama Produk</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all" placeholder="Misal: Finance Tracker v2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Kategori</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none transition-all">
                        {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#0a0a0a]">{cat}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Harga (Rp)</label>
                      <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value.replace(/\D/g, "")})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none transition-all font-mono" placeholder="250000" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Link Lynk.id</label>
                    <input required type="url" value={formData.lynkUrl} onChange={e => setFormData({...formData, lynkUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none transition-all" placeholder="https://lynk.id/..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Deskripsi</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none transition-all resize-none" placeholder="Ceritakan keunggulan template ini..." />
                  </div>
                </div>

                <div className="pt-8 mt-auto sticky bottom-0 bg-[#0a0a0a] pb-2">
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all disabled:opacity-50 active:scale-[0.98] shadow-2xl shadow-white/10"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-3 border-black/20 border-t-black animate-spin rounded-full" />
                    ) : showSuccess ? (
                      <div className="flex items-center gap-2"><CheckCircle2 size={20} /> Tersimpan!</div>
                    ) : (
                      editingProduct ? "Perbarui Produk" : "Publikasikan Produk"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
