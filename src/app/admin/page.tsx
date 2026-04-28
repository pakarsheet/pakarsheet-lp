"use client";

import { useState, useRef, useMemo } from "react";
import { useProducts, Product } from "@/hooks/useProducts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Plus, Trash2, Image as ImageIcon, CheckCircle2, 
  Lock, Eye, EyeOff, Edit3, BarChart3, Package, TrendingUp, X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "pakarsheet2024";
const CATEGORIES = ["Keuangan", "Marketing", "Inventory", "HR & Admin", "Lainnya"];

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Lock className="text-black" size={28} />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white text-center mb-2 tracking-tight">Admin Area</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password admin..."
              className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 text-white placeholder:text-neutral-600 focus:outline-none transition-all pr-12 ${error ? "border-red-500/50" : "border-white/10 focus:border-white/30"}`}
              autoFocus
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-neutral-500 hover:text-white transition-colors">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-neutral-200 transition-all active:scale-95">Masuk</button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => (typeof window !== "undefined" ? sessionStorage.getItem("admin_auth") === "true" : false));
  const { products, addProduct, updateProduct, deleteProduct, isLoading } = useProducts();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dashboard Stats
  const stats = useMemo(() => {
    const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0);
    const mostClicked = [...products].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];
    return { totalProducts: products.length, totalClicks, topProduct: mostClicked?.name || "-" };
  }, [products]);

  if (!isAuthenticated) return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, description: product.description, price: product.price.toString(), lynkUrl: product.lynkUrl, category: product.category });
    setImagePreview(product.image);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", lynkUrl: "", category: "Keuangan" });
    setImagePreview(null);
    setImageFile(null);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return alert("Hanya file gambar.");
    if (file.size > 2 * 1024 * 1024) return alert("Maksimal 2MB.");
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value.replace(/\D/g, "") });
  const formatPrice = (price: string) => (price ? new Intl.NumberFormat("id-ID").format(parseInt(price, 10)) : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return alert("Harap upload gambar.");
    setIsSubmitting(true);

    const productData = { 
      name: formData.name, description: formData.description, 
      price: parseInt(formData.price || "0", 10), 
      image: imagePreview, lynkUrl: formData.lynkUrl, category: formData.category 
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productData, imageFile || undefined);
    } else {
      await addProduct(productData, imageFile || undefined);
    }

    setIsSubmitting(false);
    setShowSuccess(true);
    cancelEdit();
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.01] p-6 flex flex-col z-10">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-black font-bold text-xl">P</div>
          <span className="font-semibold text-lg">Admin Area</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={cancelEdit} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${!editingProduct ? 'bg-white/10 text-white font-medium border border-white/5 shadow-inner' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
            <Plus size={18} /> Upload Produk
          </button>
          <Link href="/shop" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"><ImageIcon size={18} /> Lihat Toko</Link>
        </nav>
        <button onClick={() => { sessionStorage.removeItem("admin_auth"); setIsAuthenticated(false); }} className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg text-neutral-600 hover:text-red-400 text-sm"><Lock size={16} /> Keluar</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 relative overflow-x-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* Stats Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl">
              <div className="flex items-center gap-3 text-neutral-500 text-sm mb-2"><Package size={16} /> Total Produk</div>
              <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl">
              <div className="flex items-center gap-3 text-neutral-500 text-sm mb-2"><TrendingUp size={16} /> Total Klik (Sales)</div>
              <div className="text-2xl font-bold text-green-400">{stats.totalClicks}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl">
              <div className="flex items-center gap-3 text-neutral-500 text-sm mb-2"><BarChart3 size={16} /> Produk Terlaris</div>
              <div className="text-lg font-bold text-white truncate">{stats.topProduct}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-5 bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</h2>
                {editingProduct && <button type="button" onClick={cancelEdit} className="text-neutral-500 hover:text-white"><X size={20} /></button>}
              </div>

              <div>
                <div
                  className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 border-dashed transition-all overflow-hidden ${imagePreview ? "border-transparent" : isDragging ? "border-white/50 bg-white/10" : "border-white/10 hover:border-white/30 bg-white/[0.02]"}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) processFile(file); }} onClick={() => !imagePreview && fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full group/image">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                        <button type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="text-white font-medium bg-white/10 border border-white/20 px-5 py-2.5 rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"><Upload size={16} /> Ganti Gambar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 cursor-pointer">
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4"><Upload className="w-6 h-6 text-neutral-400" /></div>
                      <p className="mb-2 text-sm text-neutral-200 font-medium">Klik atau Drag & Drop</p>
                      <p className="text-xs text-neutral-500">Maksimal 2MB</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) processFile(file); }} />
                </div>
              </div>

              <div className="space-y-4">
                <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/40 transition-all" placeholder="Nama Produk" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/40 transition-all" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat} className="bg-neutral-900">{cat}</option>)}
                </select>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">Rp</div>
                  <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-white/40 transition-all font-medium" placeholder="150.000" value={formatPrice(formData.price)} onChange={handlePriceChange} />
                </div>
                <input required type="url" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/40 transition-all" placeholder="URL Lynk.id" value={formData.lynkUrl} onChange={(e) => setFormData({ ...formData, lynkUrl: e.target.value })} />
                <textarea required maxLength={200} rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/40 transition-all resize-none" placeholder="Deskripsi Singkat..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black font-bold rounded-xl px-4 py-4 hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting ? <div className="w-5 h-5 border-2 border-black/20 border-t-black animate-spin rounded-full" /> : showSuccess ? "Berhasil Diupdate" : (editingProduct ? "Simpan Perubahan" : "Upload ke Toko")}
              </button>
            </form>

            {/* List Section */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl flex flex-col h-[750px] overflow-hidden">
              <div className="p-6 border-b border-white/5"><h2 className="text-xl font-semibold">Kelola Produk</h2></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {isLoading ? <div className="p-10 text-center animate-pulse text-neutral-500">Memuat produk...</div> : products.map((product) => (
                  <motion.div key={product.id} className="flex items-center gap-4 p-3 rounded-2xl bg-black/20 border border-white/5 group hover:border-white/20 transition-all">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900"><Image src={product.image} alt={product.name} fill className="object-cover" unoptimized /></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate text-white">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded">Rp {product.price.toLocaleString("id-ID")}</span>
                        <span className="text-[10px] text-blue-400 font-bold bg-blue-400/10 px-2 py-0.5 rounded flex items-center gap-1"><TrendingUp size={8} /> {product.clicks || 0} Klik</span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(product)} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"><Edit3 size={16} /></button>
                      <button onClick={() => window.confirm("Hapus produk?") && deleteProduct(product.id, product.image)} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
