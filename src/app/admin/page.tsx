"use client";

import { useState, useRef } from "react";
import { useProducts } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import { Upload, Plus, Trash2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminPage() {
  const { products, addProduct, deleteProduct, isLoading } = useProducts();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Hanya file gambar yang diperbolehkan.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar. Maksimal 2MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, price: rawValue });
  };

  const formatPrice = (price: string) => {
    if (!price) return "";
    return new Intl.NumberFormat('id-ID').format(parseInt(price, 10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      alert("Harap upload gambar produk terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    addProduct({
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price || "0", 10),
      image: imagePreview,
    });

    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form
    setFormData({ name: "", description: "", price: "" });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.01] p-6 flex flex-col z-10 relative">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            P
          </div>
          <span className="font-semibold text-lg tracking-tight">Admin Area</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/10 text-white font-medium border border-white/5 transition-all shadow-inner">
            <Plus size={18} /> Upload Produk
          </Link>
          <Link href="/shop" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
            <ImageIcon size={18} /> Lihat Toko
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 relative">
        {/* Subtle glowing orb in background */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl font-semibold mb-2 tracking-tight">Upload Produk Baru</h1>
          <p className="text-neutral-400 mb-8">Tambahkan template atau produk baru ke halaman toko.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">Gambar Produk (Rasio 1:1)</label>
                <div 
                  className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
                    imagePreview ? 'border-transparent' : 
                    isDragging ? 'border-white/50 bg-white/10 scale-[1.02]' : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !imagePreview && fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full group/image">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="text-white font-medium bg-white/10 border border-white/20 px-5 py-2.5 rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
                        >
                          <Upload size={16} /> Ganti Gambar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 cursor-pointer">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-white/20' : 'bg-white/5'}`}>
                        <Upload className={`w-6 h-6 transition-colors ${isDragging ? 'text-white' : 'text-neutral-400'}`} />
                      </div>
                      <p className="mb-2 text-sm text-neutral-200 font-medium">Klik atau Drag & Drop gambar</p>
                      <p className="text-xs text-neutral-500">Rasio 1:1 direkomendasikan (Max 2MB)</p>
                    </div>
                  )}
                  <input 
                    ref={fileInputRef}
                    id="dropzone-file" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Nama Produk</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all"
                    placeholder="Misal: Template Keuangan V2"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Harga</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-neutral-500 font-medium">Rp</span>
                    </div>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all font-medium tracking-wide"
                      placeholder="150.000"
                      value={formatPrice(formData.price)}
                      onChange={handlePriceChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-neutral-300">Deskripsi Singkat</label>
                    <span className="text-xs text-neutral-500">{formData.description.length}/200</span>
                  </div>
                  <textarea 
                    required
                    maxLength={200}
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40 focus:bg-white/[0.05] transition-all resize-none"
                    placeholder="Jelaskan fitur utama dari template ini secara singkat..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !formData.name || !formData.price || !formData.description}
                className="w-full bg-white text-black font-bold rounded-xl px-4 py-4 hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                ) : showSuccess ? (
                  <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-green-600"/> Berhasil Diupload
                  </motion.div>
                ) : (
                  "Upload ke Toko"
                )}
              </button>
            </form>

            {/* Existing Products List */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl flex flex-col h-[700px] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.01]">
                <h2 className="text-xl font-semibold">Produk Aktif</h2>
                <p className="text-sm text-neutral-400 mt-1">Kelola {products.length} produk yang tampil di toko.</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {isLoading ? (
                  <div className="flex justify-center p-10">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center p-10 text-neutral-500 text-sm flex flex-col items-center">
                    <ImageIcon size={32} className="mb-3 text-neutral-700" />
                    Belum ada produk di toko Anda.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-4 p-3 pr-4 rounded-2xl bg-black/20 hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all group"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900 border border-white/10">
                          <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate text-white/90 mb-1">{product.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-md">
                              Rp {product.price.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if(window.confirm('Yakin ingin menghapus produk ini?')) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                          title="Hapus Produk"
                        >
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
