"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaUploader from "@/components/admin/MediaUploader";
import GalleryUploader from "@/components/admin/GalleryUploader";

type MediaItem = { id: string; url: string; type: string };
type Category = { id: string; name: string };

export type ProjectFormValue = {
  id?: string;
  title: string;
  client: string;
  year: number;
  role: string;
  description: string;
  externalUrl: string;
  published: boolean;
  categoryId: string | null;
  videoUrl: string;
  seoTitle: string;
  seoDesc: string;
  cover: MediaItem | null;
  gallery: MediaItem[];
};

const EMPTY: ProjectFormValue = {
  title: "",
  client: "",
  year: new Date().getFullYear(),
  role: "",
  description: "",
  externalUrl: "",
  published: false,
  categoryId: null,
  videoUrl: "",
  seoTitle: "",
  seoDesc: "",
  cover: null,
  gallery: [],
};

export default function ProjectForm({
  initial,
  categories,
}: {
  initial?: Partial<ProjectFormValue>;
  categories: Category[];
}) {
  const [value, setValue] = useState<ProjectFormValue>({ ...EMPTY, ...initial });
  const [newCategory, setNewCategory] = useState("");
  const [categoryList, setCategoryList] = useState(categories);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function set<K extends keyof ProjectFormValue>(key: K, v: ProjectFormValue[K]) {
    setValue((prev) => ({ ...prev, [key]: v }));
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory.trim() }),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategoryList((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)));
      set("categoryId", cat.id);
      setNewCategory("");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: value.title,
      client: value.client || undefined,
      year: value.year,
      role: value.role || undefined,
      description: value.description || undefined,
      externalUrl: value.externalUrl || "",
      published: value.published,
      categoryId: value.categoryId,
      coverId: value.cover?.id ?? null,
      videoUrl: value.videoUrl || undefined,
      seoTitle: value.seoTitle || undefined,
      seoDesc: value.seoDesc || undefined,
      galleryMediaIds: value.gallery.map((g) => g.id),
    };

    const res = await fetch(
      value.id ? `/api/admin/projects/${value.id}` : "/api/admin/projects",
      {
        method: value.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setSaving(false);

    if (!res.ok) {
      setError("ذخیره‌سازی ناموفق بود. فیلدهای الزامی را بررسی کنید.");
      return;
    }

    router.push("/admin/portfolio");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} dir="rtl" className="font-vazir max-w-3xl">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <MediaUploader
          label="تصویر کاور"
          value={value.cover}
          onChange={(m) => set("cover", m)}
        />
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5 text-stone">لینک ویدیو (اختیاری)</label>
            <input
              value={value.videoUrl}
              onChange={(e) => set("videoUrl", e.target.value)}
              placeholder="https://..."
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-stone">لینک خارجی (اختیاری)</label>
            <input
              value={value.externalUrl}
              onChange={(e) => set("externalUrl", e.target.value)}
              placeholder="https://..."
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1.5 text-stone">عنوان پروژه *</label>
          <input
            required
            value={value.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-stone">کارفرما</label>
          <input
            value={value.client}
            onChange={(e) => set("client", e.target.value)}
            className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-stone">سال *</label>
          <input
            required
            type="number"
            value={value.year}
            onChange={(e) => set("year", Number(e.target.value))}
            className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red eng"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-stone">نقش من</label>
          <input
            value={value.role}
            onChange={(e) => set("role", e.target.value)}
            placeholder="کارگردانی، تدوین..."
            className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1.5 text-stone">دسته‌بندی</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {categoryList.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => set("categoryId", c.id)}
              className={`px-3 py-1.5 rounded-sm text-sm border transition-colors ${
                value.categoryId === c.id
                  ? "border-red text-red"
                  : "border-line text-stone hover:text-ivory"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="دسته‌بندی جدید..."
            className="flex-1 bg-transparent border border-line rounded-sm px-3 py-2 text-sm outline-none focus:border-red"
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-4 py-2 border border-line rounded-sm text-sm hover:border-red transition-colors"
          >
            افزودن
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-1.5 text-stone">توضیحات</label>
        <textarea
          rows={5}
          value={value.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red resize-none"
        />
      </div>

      <div className="mb-8">
        <GalleryUploader value={value.gallery} onChange={(g) => set("gallery", g)} />
      </div>

      <details className="mb-8 border border-line rounded-sm p-4">
        <summary className="text-sm text-stone cursor-pointer">SEO این پروژه</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm mb-1.5 text-stone">عنوان SEO</label>
            <input
              value={value.seoTitle}
              onChange={(e) => set("seoTitle", e.target.value)}
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-stone">توضیحات SEO</label>
            <textarea
              rows={2}
              value={value.seoDesc}
              onChange={(e) => set("seoDesc", e.target.value)}
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red resize-none"
            />
          </div>
        </div>
      </details>

      <label className="flex items-center gap-2 text-sm mb-8 cursor-pointer select-none w-fit">
        <input
          type="checkbox"
          checked={value.published}
          onChange={(e) => set("published", e.target.checked)}
          className="accent-red"
        />
        این پروژه در سایت منتشر شود
      </label>

      {error && <p className="text-red text-sm mb-4">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-3 rounded-sm bg-red text-ivory text-sm hover:bg-[#8c121c] transition-colors disabled:opacity-50"
        >
          {saving ? "در حال ذخیره..." : "ذخیره پروژه"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/portfolio")}
          className="px-7 py-3 rounded-sm border border-line text-sm hover:border-ivory transition-colors"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}
