"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useData } from "@/hooks/useData";
import { checkAdminAuth } from "@/lib/adminAuth";
import {
  EditorTopBar,
  TwoColumnEditor,
  SectionCard,
  Field,
  SaveButton,
  inputCls,
  labelCls,
} from "@/components/admin/EditorLayout";
import { AlertCircle, Plus, X, Trash2 } from "lucide-react";
import Image from "next/image";

// ── Types ──────────────────────────────────────────────────────────────────────
type ImageSlot =
  | { type: "existing"; url: string }
  | { type: "new"; preview: string; file: File };

type Feature = { title: string; desc: string; icon: string };

const CATEGORIES = ["Keuangan", "Marketing", "Inventory", "HR & Admin", "Lainnya"];
const ICON_OPTIONS = [
  "Zap", "Clock", "Globe", "Star", "Shield", "Check",
  "LayoutDashboard", "Edit3", "MessageSquare", "Package",
  "Sparkles", "Heart", "Lock", "Rocket", "Layers",
];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  lynkUrl: "",
  category: "Keuangan",
  salePrice: "",
  salePriceUntil: "",
  socialProofCount: "",
};

// ── Validation ─────────────────────────────────────────────────────────────────
function validate(form: typeof EMPTY_FORM, slots: ImageSlot[]) {
  const errors: Partial<Record<keyof typeof EMPTY_FORM | "images", string>> = {};
  if (!form.name.trim()) errors.name = "Nama produk wajib diisi.";
  if (!form.price.trim()) errors.price = "Harga wajib diisi.";
  if (!form.lynkUrl.trim()) errors.lynkUrl = "Link Lynk.id wajib diisi.";
  if (slots.length === 0) errors.images = "Pilih minimal satu gambar produk.";
  return errors;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function ProductEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();

  const { products, isLoading, saveToSupabase, fetchData } = useData();

  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slots, setSlots] = useState<ImageSlot[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auth check
  useEffect(() => {
    checkAdminAuth().then((ok) => {
      setAuthed(ok);
      setChecked(true);
      if (!ok) router.replace("/admin");
    });
  }, [router]);

  // Load existing product
  useEffect(() => {
    if (isNew || isLoading || !products.length) return;
    const p = products.find((x) => x.id === id);
    if (!p) { router.replace("/admin?tab=products"); return; }
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      originalPrice: (p as any).originalPrice ? (p as any).originalPrice.toString() : "",
      lynkUrl: (p as any).lynkUrl || "",
      category: p.category,
      salePrice: (p as any).salePrice ? (p as any).salePrice.toString() : "",
      salePriceUntil: (p as any).salePriceUntil
        ? new Date((p as any).salePriceUntil).toISOString().slice(0, 16)
        : "",
      socialProofCount: (p as any).socialProofCount ? (p as any).socialProofCount.toString() : "",
    });
    const urls: string[] = (p as any).images || ((p as any).image ? [(p as any).image] : []);
    setSlots(urls.map((url) => ({ type: "existing" as const, url })));
    setFeatures((p as any).features || []);
  }, [id, isNew, isLoading, products, router]);

  const addFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setSlots((prev) => [
          ...prev,
          { type: "new" as const, preview: reader.result as string, file },
        ]);
      reader.readAsDataURL(file);
    });
  };

  const addFeature = () =>
    setFeatures((prev) => [...prev, { title: "", desc: "", icon: "Zap" }]);
  const removeFeature = (i: number) =>
    setFeatures((prev) => prev.filter((_, j) => j !== i));
  const updateFeature = (i: number, key: keyof Feature, val: string) =>
    setFeatures((prev) => prev.map((f, j) => (j === i ? { ...f, [key]: val } : f)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form, slots);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    setSaveErr(null);

    // Upload new images
    const urls: string[] = [];
    for (const slot of slots) {
      if (slot.type === "existing") { urls.push(slot.url); continue; }
      if (!supabase) { urls.push(slot.preview); continue; }
      const ext = slot.file.name.split(".").pop() || "jpg";
      const path = `product-images/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error: se } = await supabase.storage
        .from("products")
        .upload(path, slot.file, { upsert: false });
      if (se) {
        setSaveErr(`Gagal upload gambar: ${se.message}`);
        setSubmitting(false);
        return;
      }
      const { data: ud } = supabase.storage.from("products").getPublicUrl(path);
      urls.push(ud.publicUrl);
    }

    const data = {
      id: editingId || crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseInt(form.price || "0", 10),
      originalPrice: form.originalPrice ? parseInt(form.originalPrice, 10) : null,
      images: urls,
      lynkUrl: form.lynkUrl.trim(),
      category: form.category,
      createdAt: isNew ? Date.now() : undefined,
      clicks: isNew ? 0 : undefined,
      salePrice: form.salePrice ? parseInt(form.salePrice, 10) : null,
      salePriceUntil: form.salePriceUntil
        ? new Date(form.salePriceUntil).getTime()
        : null,
      socialProofCount: form.socialProofCount
        ? parseInt(form.socialProofCount, 10)
        : null,
      features: features.length > 0 ? features : null,
    };

    const result = await saveToSupabase("products", data as any);
    await fetchData();
    setSubmitting(false);

    if (result?.ok === false) {
      setSaveErr(`Gagal menyimpan: ${result.error}`);
      return;
    }

    setSaveOk(true);
    setTimeout(() => {
      setSaveOk(false);
      router.push("/admin?tab=products");
    }, 1200);
  };

  if (!checked) return null;
  if (!authed) return null;

  const pageTitle = isNew ? "Tambah Produk" : "Edit Produk";

  const saveBtn = (
    <SaveButton
      loading={submitting}
      success={saveOk}
      label={isNew ? "Simpan Produk" : "Update Produk"}
    />
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <EditorTopBar
        backHref="/admin?tab=products"
        backLabel="Kembali ke Produk"
        title={pageTitle}
        actions={saveBtn}
      />

      <form onSubmit={handleSubmit} noValidate>
        <TwoColumnEditor
          left={
            <>
              {/* Error banner */}
              {saveErr && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {saveErr}
                </div>
              )}

              {/* Basic info */}
              <SectionCard title="Informasi Produk">
                <Field label="Nama Produk" error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="Finance Tracker Pro"
                  />
                </Field>
                <Field label="Deskripsi">
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputCls + " resize-none"}
                    placeholder="Deskripsi singkat produk yang menarik perhatian calon pembeli..."
                  />
                </Field>
              </SectionCard>

              {/* Features */}
              <SectionCard>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Fitur Unggulan
                  </h3>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                  >
                    <Plus size={13} /> Tambah Fitur
                  </button>
                </div>
                <p className="text-xs text-neutral-600 -mt-2">
                  Kosong = pakai fitur default dari Settings.
                </p>

                {features.length === 0 && (
                  <div className="border border-dashed border-white/8 rounded-xl py-8 text-center text-neutral-700 text-sm">
                    Belum ada fitur. Klik &quot;Tambah Fitur&quot; untuk menambahkan.
                  </div>
                )}

                <div className="space-y-4">
                  {features.map((feat, i) => (
                    <div
                      key={i}
                      className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Fitur {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <div className="grid grid-cols-[1fr_140px] gap-2">
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => updateFeature(i, "title", e.target.value)}
                          className={inputCls}
                          placeholder="Nama Fitur"
                        />
                        <select
                          value={feat.icon}
                          onChange={(e) => updateFeature(i, "icon", e.target.value)}
                          className={inputCls + " appearance-none"}
                        >
                          {ICON_OPTIONS.map((ic) => (
                            <option key={ic} value={ic} className="bg-black">
                              {ic}
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        rows={2}
                        value={feat.desc}
                        onChange={(e) => updateFeature(i, "desc", e.target.value)}
                        className={inputCls + " resize-none"}
                        placeholder="Deskripsi singkat fitur ini..."
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Bottom save */}
              <div className="flex justify-end pb-8">{saveBtn}</div>
            </>
          }
          right={
            <>
              {/* Images */}
              <SectionCard title="Foto Produk">
                {errors.images && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle size={11} /> {errors.images}
                  </p>
                )}
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-white/8 group/img"
                    >
                      <Image
                        src={slot.type === "existing" ? slot.url : slot.preview}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <span
                        className={`absolute top-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white ${
                          slot.type === "existing"
                            ? "bg-blue-500/80"
                            : "bg-green-500/80"
                        }`}
                      >
                        {slot.type === "existing" ? "SAVED" : "NEW"}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSlots((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-white/25 bg-white/[0.02] flex flex-col items-center justify-center text-neutral-600 hover:text-neutral-400 transition-colors"
                  >
                    <Plus size={18} />
                    <span className="text-[9px] mt-1 font-semibold uppercase tracking-wider">
                      Foto
                    </span>
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && addFiles(e.target.files)}
                />
              </SectionCard>

              {/* Category & Price */}
              <SectionCard title="Kategori & Harga">
                <Field label="Kategori">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={inputCls + " appearance-none"}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-black">
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Harga Normal (Rp)" error={errors.price}>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value.replace(/\D/g, "") })
                    }
                    className={inputCls}
                    placeholder="99000"
                  />
                </Field>

                <Field label="Harga Coret / Asli (Rp) — opsional">
                  <input
                    type="text"
                    value={form.originalPrice}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        originalPrice: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className={inputCls}
                    placeholder="249000"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Flash Sale (Rp)">
                    <input
                      type="text"
                      value={form.salePrice}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          salePrice: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className={inputCls}
                      placeholder="79000"
                    />
                  </Field>
                  <Field label="Berakhir">
                    <input
                      type="datetime-local"
                      value={form.salePriceUntil}
                      onChange={(e) =>
                        setForm({ ...form, salePriceUntil: e.target.value })
                      }
                      className={inputCls + " [color-scheme:dark]"}
                    />
                  </Field>
                </div>

                <Field
                  label="Social Proof Count"
                  hint="Jumlah bisnis yang pakai (opsional)"
                >
                  <input
                    type="text"
                    value={form.socialProofCount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialProofCount: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className={inputCls}
                    placeholder="234"
                  />
                </Field>
              </SectionCard>

              {/* Lynk URL */}
              <SectionCard title="Link Pembelian">
                <Field label="Lynk.id URL" error={errors.lynkUrl}>
                  <input
                    type="url"
                    value={form.lynkUrl}
                    onChange={(e) => setForm({ ...form, lynkUrl: e.target.value })}
                    className={inputCls}
                    placeholder="https://lynk.id/pakarsheet/..."
                  />
                </Field>
              </SectionCard>
            </>
          }
        />
      </form>
    </div>
  );
}
