"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // Changed from image: string
  lynkUrl: string;
  category: string;
  createdAt: number;
  clicks?: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
  createdAt: number;
};

export type Tutorial = {
  id: string;
  title: string;
  content: string; // Markdown
  videoUrl?: string;
  category: string;
  createdAt: number;
};

export type UserRequest = {
  id: string;
  email: string;
  request: string;
  status: 'pending' | 'reviewed' | 'completed';
  createdAt: number;
};

export type SiteSettings = {
  id: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  whatsappNumber: string;
  mainLynkUrl: string;
};

export function useData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    if (!supabase) {
      const stored = localStorage.getItem("pakarsheet_products");
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        // Fallback to empty or initial products if needed
        setProducts([]);
      }
      setIsLoading(false);
      return;
    }

    try {
      const [prodRes, testRes, tutRes, reqRes, setRes] = await Promise.all([
        supabase.from('products').select('*').order('createdAt', { ascending: false }),
        supabase.from('testimonials').select('*').order('createdAt', { ascending: false }),
        supabase.from('tutorials').select('*').order('createdAt', { ascending: false }),
        supabase.from('user_requests').select('*').order('createdAt', { ascending: false }),
        supabase.from('site_settings').select('*').single()
      ]);

      setProducts(prodRes.data || []);
      setTestimonials(testRes.data || []);
      setTutorials(tutRes.data || []);
      setUserRequests(reqRes.data || []);
      setSettings(setRes.data || null);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- CRUD Operations (Generic Logic) ---
  
  const saveToSupabase = async (table: string, data: any) => {
    if (!supabase) {
      if (table === 'products') {
        const updated = products.some(p => p.id === data.id) 
          ? products.map(p => p.id === data.id ? data : p)
          : [data, ...products];
        setProducts(updated);
        localStorage.setItem("pakarsheet_products", JSON.stringify(updated));
      }
      return data;
    }
    const { data: result, error } = await supabase.from(table).upsert([data]);
    if (error) {
      console.error(`Error saving to ${table}:`, error);
      return null;
    }
    await fetchData();
    return result;
  };

  const deleteFromSupabase = async (table: string, id: string) => {
    if (!supabase) {
      if (table === 'products') {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        localStorage.setItem("pakarsheet_products", JSON.stringify(updated));
      }
      return;
    }
    await supabase.from(table).delete().eq('id', id);
    await fetchData();
  };

  return {
    products, testimonials, tutorials, userRequests, settings,
    isLoading, fetchData, saveToSupabase, deleteFromSupabase
  };
}
