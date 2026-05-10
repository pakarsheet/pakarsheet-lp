import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

type Props = {
  params: Promise<{ id: string }>;
};

async function getProduct(id: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const client = createClient(url, key);
    const { data } = await client
      .from("products")
      .select("name, description, images, category, price")
      .eq("id", id)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Template | Pakarsheet",
      description: "Template Google Sheets premium dengan otomasi Apps Script.",
    };
  }

  const title = `${product.name} | Pakarsheet`;
  const description =
    product.description ||
    `Template Google Sheets ${product.category} dengan otomasi Apps Script. Harga Rp ${product.price?.toLocaleString("id-ID")}.`;
  const image = product.images?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://pakarsheet.com/shop/${id}`,
      siteName: "Pakarsheet",
      locale: "id_ID",
      type: "website",
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: product.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
