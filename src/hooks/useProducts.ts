"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type ProductFeature = {
  title: string;
  desc: string;
  icon: string; // icon name string, e.g. "Zap", "Clock"
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;        // Optional discounted-from price
  salePrice?: number | null;     // Flash sale price (overrides price display)
  salePriceUntil?: number | null; // Timestamp ms when sale ends
  socialProofCount?: number | null; // Manual buyer count override
  images: string[];              // Canonical multi-image field
  /** @deprecated use images[] */ image?: string;
  lynkUrl: string;
  category: string;
  createdAt: number;
  clicks?: number;
  features?: ProductFeature[] | null; // Per-product feature list
};

const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Finance Tracker Pro",
    description:
      "Template otomatisasi keuangan untuk bisnis. Lacak pemasukan dan pengeluaran dengan analitik otomatis.",
    price: 99000,
    originalPrice: 249000,
    images: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ],
    lynkUrl: "https://lynk.id/pakarsheet",
    category: "Keuangan",
    createdAt: Date.now(),
    clicks: 0,
  },
];

/** Normalise a product so it always has an `images` array, never just `image`. */
function normalise(p: Product): Product {
  if (!p.images || p.images.length === 0) {
    return { ...p, images: p.image ? [p.image] : [] };
  }
  return p;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);

    if (!supabase) {
      const stored = localStorage.getItem("pakarsheet_products");
      if (stored) {
        setProducts((JSON.parse(stored) as Product[]).map(normalise));
      } else if (process.env.NODE_ENV === "development") {
        // Only show dummy data in development — never in production
        localStorage.setItem("pakarsheet_products", JSON.stringify(dummyProducts));
        setProducts(dummyProducts);
      } else {
        setProducts([]);
      }
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) throw error;
      setProducts((data ?? []).map(normalise));
    } catch {
      // silently fail — products stay empty, no crash
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void fetchProducts());
  }, [fetchProducts]);

  // ── Upload helper ──────────────────────────────────────────────────────────
  async function uploadImage(file: File): Promise<string | null> {
    if (!supabase) return null;
    const ext = file.name.split(".").pop() || "jpg";
    const path = `product-images/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("products").upload(path, file, { upsert: false });
    if (error) { return null; }
    const { data } = supabase.storage.from("products").getPublicUrl(path);
    return data.publicUrl;
  }

  // ── Delete storage file helper ─────────────────────────────────────────────
  async function deleteStorageFile(url: string) {
    if (!supabase || !url.includes("product-images/")) return;
    const path = "product-images/" + url.split("product-images/").pop();
    await supabase.storage.from("products").remove([path]);
  }

  // ── addProduct ─────────────────────────────────────────────────────────────
  const addProduct = async (
    product: Omit<Product, "id" | "createdAt" | "clicks" | "image">,
    imageFiles?: File[]
  ): Promise<Product | null> => {
    const uploadedUrls: string[] = [];

    if (imageFiles?.length) {
      for (const file of imageFiles) {
        const url = await uploadImage(file);
        if (url) uploadedUrls.push(url);
      }
    }

    const newProduct: Product = {
      ...product,
      images: uploadedUrls.length ? uploadedUrls : product.images ?? [],
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      clicks: 0,
    };

    if (supabase) {
      const { error } = await supabase.from("products").insert([newProduct]);
      if (error) { return null; }
    } else {
      const updated = [newProduct, ...products];
      localStorage.setItem("pakarsheet_products", JSON.stringify(updated));
    }

    await fetchProducts();
    return newProduct;
  };

  // ── updateProduct ──────────────────────────────────────────────────────────
  const updateProduct = async (
    id: string,
    updates: Partial<Omit<Product, "id" | "createdAt" | "image">>,
    newImageFiles?: File[]
  ): Promise<boolean> => {
    const existing = products.find((p) => p.id === id);
    const uploadedUrls: string[] = [];

    if (newImageFiles?.length) {
      for (const file of newImageFiles) {
        const url = await uploadImage(file);
        if (url) uploadedUrls.push(url);
      }
    }

    // Determine final images array
    const finalImages =
      uploadedUrls.length > 0
        ? uploadedUrls
        : updates.images ?? existing?.images ?? [];

    // Delete old storage files that are no longer in the new set
    if (existing && supabase) {
      const removed = (existing.images ?? []).filter(
        (url) => !finalImages.includes(url)
      );
      for (const url of removed) await deleteStorageFile(url);
    }

    const finalUpdates = { ...updates, images: finalImages };

    if (supabase) {
      const { error } = await supabase
        .from("products")
        .update(finalUpdates)
        .eq("id", id);
      if (error) { return false; }
    } else {
      const updated = products.map((p) =>
        p.id === id ? { ...p, ...finalUpdates } : p
      );
      localStorage.setItem("pakarsheet_products", JSON.stringify(updated));
    }

    await fetchProducts();
    return true;
  };

  // ── deleteProduct ──────────────────────────────────────────────────────────
  const deleteProduct = async (id: string): Promise<void> => {
    const product = products.find((p) => p.id === id);

    if (supabase) {
      // Delete all associated storage files
      for (const url of product?.images ?? []) await deleteStorageFile(url);
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) { return; }
    } else {
      const updated = products.filter((p) => p.id !== id);
      localStorage.setItem("pakarsheet_products", JSON.stringify(updated));
    }

    await fetchProducts();
  };

  // ── trackClick ─────────────────────────────────────────────────────────────
  const trackClick = async (id: string): Promise<void> => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    if (supabase) {
      await supabase
        .from("products")
        .update({ clicks: (product.clicks ?? 0) + 1 })
        .eq("id", id);
    } else {
      const updated = products.map((p) =>
        p.id === id ? { ...p, clicks: (p.clicks ?? 0) + 1 } : p
      );
      localStorage.setItem("pakarsheet_products", JSON.stringify(updated));
    }

    await fetchProducts();
  };

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    trackClick,
    refresh: fetchProducts,
  };
}
