"use client";

import { useState, useEffect } from "react";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Base64 image or URL
  lynkUrl: string; // Lynk.id checkout URL per product
  category: string; // For filtering
  createdAt: number;
};

// Initial dummy products for demo purposes
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
  {
    id: "3",
    name: "Inventory Management",
    description: "Sistem otomatis rekap stok barang keluar masuk. Cocok untuk toko online & offline.",
    price: 350000,
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    lynkUrl: "https://lynk.id/pakarsheet",
    category: "Inventory",
    createdAt: Date.now() - 20000,
  },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = () => {
      try {
        const stored = localStorage.getItem("pakarsheet_products");
        if (stored) {
          const parsed: Product[] = JSON.parse(stored);
          // Migrate old products that lack new fields
          const migrated = parsed.map((p) => ({
            ...p,
            lynkUrl: p.lynkUrl ?? "https://lynk.id/pakarsheet",
            category: p.category ?? "Lainnya",
          }));
          setProducts(migrated);
        } else {
          localStorage.setItem("pakarsheet_products", JSON.stringify(dummyProducts));
          setProducts(dummyProducts);
        }
      } catch (error) {
        console.error("Failed to load products from localStorage:", error);
        setProducts(dummyProducts);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };

    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);
    localStorage.setItem("pakarsheet_products", JSON.stringify(updatedProducts));

    return newProduct;
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("pakarsheet_products", JSON.stringify(updatedProducts));
  };

  return { products, isLoading, addProduct, deleteProduct };
}
