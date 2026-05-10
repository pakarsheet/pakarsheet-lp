"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useData } from "@/hooks/useData";
import { checkAdminAuth } from "@/lib/adminAuth";
import { looksLikeMarkdown, markdownToHtml } from "@/lib/markdownToHtml";
import {
  EditorTopBar,
  TwoColumnEditor,
  SectionCard,
  Field,
  SaveButton,
  inputCls,
} from "@/components/admin/EditorLayout";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { AlertCircle, Image as ImageIcon, X } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
const BLOG_CATEGORIES = ["Tutorial", "Tips & Trik", "Use Case", "Update", "Lainnya"];

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Tutorial",
  tags: "",
  status: "draft" as "draft" | "published",
  relatedProductId: "",
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function validate(form: typeof EMPTY_FORM) {
  const errors: Partial<Record<keyof typeof EMPTY_FORM, string>> = {};
  if (!form.title.trim()) errors.title = "Judul artikel wajib diisi.";
  if (!form.excerpt.trim()) errors.excerpt = "Excerpt wajib diisi.";
  if (!form.content || form.content === "<p></p>" || form.content.trim() === "")
    errors.content = "Konten artikel wajib diisi.";
  return errors;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function BlogEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();

  const { blogPosts, products, isLoading, saveToSupabase, fetchData } = useData();

  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [contentLoadErr, setContentLoadErr] = useState<string | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  // Auth check
  useEffect(() => {
    checkAdminAuth().then((ok) => {
      setAuthed(ok);
      setChecked(true);
      if (!ok) router.replace(`/admin/login?next=/admin/blog/${id}`);
    });
  }, [id, router]);

  // Load existing post
  useEffect(() => {
    if (isNew || isLoading || !blogPosts.length) return;
    const post = blogPosts.find((x) => x.id === id);
    if (!post) { router.replace("/admin?tab=blog"); return; }

    // Handle Markdown → HTML conversion for legacy content
    let content = post.content || "";
    let nextContentLoadErr: string | null = null;
    if (looksLikeMarkdown(content)) {
      const html = markdownToHtml(content);
      if (html === null) {
        nextContentLoadErr =
          "Konten artikel ini menggunakan format Markdown yang tidak dapat dikonversi secara otomatis. Silakan edit konten secara manual.";
        content = "";
      } else {
        content = html;
      }
    }

    const nextForm = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content,
      coverImage: post.coverImage || "",
      category: post.category,
      tags: (post.tags || []).join(", "),
      status: post.status,
      relatedProductId: post.relatedProductId || "",
    };

    queueMicrotask(() => {
      setEditingId(post.id);
      setSlugManuallyEdited(true);
      setContentLoadErr(nextContentLoadErr);
      setForm(nextForm);
      setCoverPreview(post.coverImage || "");
    });
  }, [id, isNew, isLoading, blogPosts, router]);

  // Auto-generate slug from title (new posts only)
  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: slugManuallyEdited ? prev.slug : generateSlug(val),
    }));
  };

  const handleCoverFile = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    setForm((prev) => ({ ...prev, coverImage: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    setSaveErr(null);

    // Upload cover image if new file selected
    let coverUrl = form.coverImage;
    if (coverFile) {
      if (!supabase) {
        coverUrl = coverPreview;
      } else {
        const ext = coverFile.name.split(".").pop() || "jpg";
        const path = `blog-covers/${Date.now()}-${crypto.randomUUID()}.${ext}`;
        const { error: se } = await supabase.storage
          .from("products")
          .upload(path, coverFile, { upsert: false });
        if (se) {
          setSaveErr(`Gagal upload cover: ${se.message}`);
          setSubmitting(false);
          return;
        }
        const { data: ud } = supabase.storage.from("products").getPublicUrl(path);
        coverUrl = ud.publicUrl;
      }
    }

    const existingPost = !isNew ? blogPosts.find((x) => x.id === id) : null;

    const words = form.content.replace(/<[^>]+>/g, "").trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const now = Date.now();

    const data: Record<string, unknown> = {
      id: editingId || crypto.randomUUID(),
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      coverImage: coverUrl,
      category: form.category,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: form.status,
      relatedProductId: form.relatedProductId || null,
      readingTime,
      // Always send non-null values — preserve existing for updates
      views: isNew ? 0 : (existingPost?.views ?? 0),
      publishedAt: form.status === "published"
        ? (existingPost?.publishedAt || now)
        : (existingPost?.publishedAt ?? 0),
      createdAt: isNew ? now : (existingPost?.createdAt ?? now),
      updatedAt: now,
    };

    const result = await saveToSupabase("blog_posts", data);
    await fetchData();
    setSubmitting(false);

    if (result?.ok === false) {
      setSaveErr(`Gagal menyimpan: ${result.error}`);
      return;
    }

    setSaveOk(true);
    setTimeout(() => {
      setSaveOk(false);
      router.push("/admin?tab=blog");
    }, 1200);
  };

  if (!checked) return null;
  if (!authed) return null;

  const pageTitle = isNew ? "Tulis Artikel Baru" : "Edit Artikel";
  const excerptLen = form.excerpt.length;
  const excerptMax = 160;

  const saveBtn = (
    <SaveButton
      loading={submitting}
      success={saveOk}
      label={isNew ? "Simpan Artikel" : "Update Artikel"}
    />
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <EditorTopBar
        backHref="/admin?tab=blog"
        backLabel="Kembali ke Blog"
        title={pageTitle}
        actions={saveBtn}
      />

      <form onSubmit={handleSubmit} noValidate>
        <TwoColumnEditor
          left={
            <>
              {/* Error banners */}
              {saveErr && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {saveErr}
                </div>
              )}
              {contentLoadErr && (
                <div className="flex items-start gap-2 text-orange-400 text-sm bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                  <span>{contentLoadErr}</span>
                </div>
              )}

              {/* Title */}
              <SectionCard title="Judul & Slug">
                <Field label="Judul Artikel" error={errors.title}>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={inputCls}
                    placeholder="Cara membuat laporan keuangan otomatis di Google Sheets"
                  />
                </Field>

                <Field label="Slug (URL)">
                  <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 focus-within:border-white/30 focus-within:bg-white/[0.07] transition-all">
                    <span className="text-sm text-neutral-600 flex-shrink-0 font-mono">
                      /blog/
                    </span>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => {
                        setSlugManuallyEdited(true);
                        setForm((prev) => ({
                          ...prev,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-"),
                        }));
                      }}
                      className="flex-1 bg-transparent text-base text-white focus:outline-none font-mono placeholder:text-neutral-600"
                      placeholder="cara-membuat-laporan-keuangan"
                    />
                  </div>
                  {form.slug && (
                    <p className="text-sm text-neutral-600 mt-2 font-mono">
                      pakarsheet.com/blog/{form.slug}
                    </p>
                  )}
                </Field>
              </SectionCard>

              {/* Content */}
              <SectionCard title="Konten Artikel">
                {errors.content && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400 -mt-2">
                    <AlertCircle size={11} /> {errors.content}
                  </p>
                )}
                <RichTextEditor
                  content={form.content}
                  onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
                  placeholder="Mulai menulis konten artikel di sini..."
                />
              </SectionCard>

              {/* Bottom save */}
              <div className="flex justify-end pb-8">{saveBtn}</div>
            </>
          }
          right={
            <>
              {/* Cover image */}
              <SectionCard title="Cover Image">
                <div
                  className="relative w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-white/10 hover:border-white/25 bg-white/[0.02] overflow-hidden cursor-pointer transition-colors"
                  onClick={() => coverRef.current?.click()}
                >
                  {coverPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverPreview}
                      alt="cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-600">
                      <ImageIcon size={28} className="mb-3" />
                      <span className="text-sm font-semibold uppercase tracking-wider">
                        Upload Cover
                      </span>
                      <span className="text-xs mt-1.5 text-neutral-700">Rasio 21:9 disarankan</span>
                    </div>
                  )}
                </div>
                <input
                  ref={coverRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleCoverFile(e.target.files[0])}
                />
                {coverPreview && (
                  <button
                    type="button"
                    onClick={removeCover}
                    className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X size={14} /> Hapus cover
                  </button>
                )}
              </SectionCard>

              {/* Meta */}
              <SectionCard title="Pengaturan Artikel">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Kategori">
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className={inputCls + " appearance-none"}
                    >
                      {BLOG_CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#111]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as "draft" | "published",
                        })
                      }
                      className={inputCls + " appearance-none"}
                    >
                      <option value="draft" className="bg-[#111]">
                        Draft
                      </option>
                      <option value="published" className="bg-[#111]">
                        Published
                      </option>
                    </select>
                  </Field>
                </div>

                <Field
                  label={`Excerpt (${excerptLen}/${excerptMax})`}
                  error={errors.excerpt}
                >
                  <textarea
                    rows={3}
                    maxLength={Math.max(excerptMax, excerptLen)}
                    value={form.excerpt}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= excerptMax || val.length < excerptLen) {
                        setForm({ ...form, excerpt: val });
                      }
                    }}
                    className={inputCls + " resize-none"}
                    placeholder="Ringkasan singkat artikel untuk SEO dan preview card..."
                  />
                </Field>

                <Field label="Tags (pisah koma)">
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className={inputCls}
                    placeholder="google-sheets, keuangan, umkm"
                  />
                </Field>

                <Field
                  label="Template Terkait (opsional)"
                  hint="Tampil sebagai CTA di sidebar artikel."
                >
                  <select
                    value={form.relatedProductId}
                    onChange={(e) =>
                      setForm({ ...form, relatedProductId: e.target.value })
                    }
                    className={inputCls + " appearance-none"}
                  >
                    <option value="" className="bg-[#111]">
                      — Tidak ada —
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#111]">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </SectionCard>
            </>
          }
        />
      </form>
    </div>
  );
}
