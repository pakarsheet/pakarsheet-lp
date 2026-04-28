"use client";

import { useState, useEffect } from "react";
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
  },
  {
    id: "2",
    name: "Social Media Planner",
    description: "Jadwalkan dan tracking performa konten sosial media kamu dalam satu dashboard.",
    price: 150000,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    lynkUrl: "https://lynk.id/pakarsheet",
    category: "Marketing",
    createdAt: Date.now() - 10000,
  },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    
    // Fallback to localStorage if Supabase is not configured
    if (!supabase) {
      console.warn("Supabase not configured, using localStorage");
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
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, "id" | "createdAt">, imageFile?: File) => {
    let imageUrl = product.image;

    // Handle Image Upload to Supabase Storage if configured
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
    };

    if (supabase) {
      const { error } = await supabase.from('products').insert([newProduct]);
      if (error) {
        console.error("Error adding product to Supabase:", error);
        return null;
      }
    } else {
      const updatedProducts = [newProduct, ...products];
      localStorage.setItem("pakarsheet_products", JSON.stringify(updatedProducts));
    }
    
    await fetchProducts();
    return newProduct;
  };

  const deleteProduct = async (id: string, imageUrl?: string) => {
    if (supabase) {
      // Optional: Delete image from storage if it's a Supabase URL
      if (imageUrl && imageUrl.includes('product-images/')) {
        const path = imageUrl.split('product-images/').pop();
        if (path) {
          await supabase.storage.from('products').remove([`product-images/${path}`]);
        }
      }

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error("Error deleting product from Supabase:", error);
        return;
      }
    } else {
      const updatedProducts = products.filter((p) => p.id !== id);
      localStorage.setItem("pakarsheet_products", JSON.stringify(updatedProducts));
    }
    
    await fetchProducts();
  };

  return { products, isLoading, addProduct, deleteProduct, refresh: fetchProducts };
}
