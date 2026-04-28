"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  lynkUrl: string;
  category: string;
  createdAt: number;
  clicks?: number; // Added for sales stats
};

const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Finance Tracker Pro",
    description: "Template otomatisasi keuangan untuk bisnis. Lacak pemasukan dan pengeluaran dengan analitik otomatis.",
    price: 250000,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    lynkUrl: "https://lynk.id/pakarsheet",
    category: "Keuangan",
    createdAt: Date.now(),
    clicks: 0,
  },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    
    if (!supabase) {
      const stored = localStorage.getItem("pakarsheet_products");
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        localStorage.setItem("pakarsheet_products", JSON.stringify(dummyProducts));
        setProducts(dummyProducts);
      }
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: Omit<Product, "id" | "createdAt" | "clicks">, imageFile?: File) => {
    let imageUrl = product.image;

    if (supabase && imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
      } else {
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
    }

    const newProduct = {
      ...product,
      image: imageUrl,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      clicks: 0,
    };

    if (supabase) {
      const { error } = await supabase.from('products').insert([newProduct]);
      if (error) return null;
    } else {
      const updatedProducts = [newProduct, ...products];
      localStorage.setItem("pakarsheet_products", JSON.stringify(updatedProducts));
    }
    
    await fetchProducts();
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Omit<Product, "id" | "createdAt">>, imageFile?: File) => {
    let imageUrl = updates.image;

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

    const finalUpdates = { ...updates };
    if (imageUrl) finalUpdates.image = imageUrl;

    if (supabase) {
      const { error } = await supabase.from('products').update(finalUpdates).eq('id', id);
      if (error) return false;
    } else {
      const updatedProducts = products.map(p => p.id === id ? { ...p, ...finalUpdates } : p);
      localStorage.setItem("pakarsheet_products", JSON.stringify(updatedProducts));
    }

    await fetchProducts();
    return true;
  };

  const deleteProduct = async (id: string, imageUrl?: string) => {
    if (supabase) {
      if (imageUrl && imageUrl.includes('product-images/')) {
        const path = imageUrl.split('product-images/').pop();
        if (path) await supabase.storage.from('products').remove([`product-images/${path}`]);
      }
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) return;
    } else {
      const updatedProducts = products.filter((p) => p.id !== id);
      localStorage.setItem("pakarsheet_products", JSON.stringify(updatedProducts));
    }
    await fetchProducts();
  };

  const trackClick = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (supabase) {
      await supabase.from('products').update({ clicks: (product.clicks || 0) + 1 }).eq('id', id);
    } else {
      const updatedProducts = products.map(p => p.id === id ? { ...p, clicks: (p.clicks || 0) + 1 } : p);
      localStorage.setItem("pakarsheet_products", JSON.stringify(updatedProducts));
    }
  };

  return { products, isLoading, addProduct, updateProduct, deleteProduct, trackClick, refresh: fetchProducts };
}
