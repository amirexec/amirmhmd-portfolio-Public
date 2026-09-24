"use client";
import { useEffect, useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

type MediaItem = { id: string; url: string; type: string };
type FormState = {
  siteName: string;
  logo: MediaItem | null;
  favicon: MediaItem | null;
  seoTitle: string;
  seoDescription: string;
  socialPreview: MediaItem | null;
  instagramUrl: string;
  whatsappUrl: string;
  telegramUrl: string;
  email: string;
  phone: string;
  accentColor: string;
  backgroundColor: string;
};

export default function SettingsManager() {
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) =>
        setForm({
          siteName: d.siteName,
          logo: d.logo,
          favicon: d.favicon,
          seoTitle: d.seoTitle,
          seoDescription: d.seoDescription,
          socialPreview: d.socialPreview,
          instagramUrl: d.instagramUrl ?? "",
          whatsappUrl: d.whatsappUrl ?? "",
          telegramUrl: d.telegramUrl ?? "",
          email: d.email ?? "",
          phone: d.phone ?? "",
          accentColor: d.accentColor,
          backgroundColor: d.backgroundColor,
        })
      );
  }, []);

  function set<K extends keyof FormState>(key: K, v: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: v } : prev));
    setSaved(false);
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteName: form.siteName,
        logoMediaId: form.logo?.id ?? null,
        faviconMediaId: form.favicon?.id ?? null,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        socialPreviewId: form.socialPreview?.id ?? null,
        instagramUrl: form.instagramUrl || null,
        whatsappUrl: form.whatsappUrl || null,
        telegramUrl: form.telegramUrl || null,
        email: form.email || null,
        phone: form.phone || null,
        accentColor: form.accentColor,
        backgroundColor: form.backgroundColor,
      }),
    });
    setSaving(false);
    setSaved(true);
  }

  if (!form) return <p className="text-stone text-sm">در حال بارگذاری...</p>;

  return (
    <div className="max-w-2xl space-y-12">
      <section>
        <h2 className="eng text-red text-sm mb-4">GENERAL</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5 text-stone">نام سایت</label>
            <input
              value={form.siteName}
              onChange={(e) => set("siteName", e.target.value)}
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MediaUploader label="لوگو" value={form.logo} onChange={(m) => set("logo", m)} />
            <MediaUploader label="فاوآیکون" value={form.favicon} onChange={(m) => set("favicon", m)} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="eng text-red text-sm mb-4">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5 text-stone">عنوان پیش‌فرض SEO</label>
            <input
              value={form.seoTitle}
              onChange={(e) => set("seoTitle", e.target.value)}
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-stone">توضیحات SEO</label>
            <textarea
              rows={2}
              value={form.seoDescription}
              onChange={(e) => set("seoDescription", e.target.value)}
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red resize-none"
            />
          </div>
          <MediaUploader label="تصویر اشتراک‌گذاری (Open Graph)" value={form.socialPreview} onChange={(m) => set("socialPreview", m)} />
        </div>
      </section>

      <section>
        <h2 className="eng text-red text-sm mb-4">CONTACT</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="اینستاگرام"
            value={form.instagramUrl}
            onChange={(e) => set("instagramUrl", e.target.value)}
            className="bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            dir="ltr"
          />
          <input
            placeholder="واتساپ"
            value={form.whatsappUrl}
            onChange={(e) => set("whatsappUrl", e.target.value)}
            className="bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            dir="ltr"
          />
          <input
            placeholder="تلگرام"
            value={form.telegramUrl}
            onChange={(e) => set("telegramUrl", e.target.value)}
            className="bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            dir="ltr"
          />
          <input
            placeholder="ایمیل"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            dir="ltr"
          />
          <input
            placeholder="تلفن"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            dir="ltr"
          />
        </div>
      </section>

      <section>
        <h2 className="eng text-red text-sm mb-4">THEME</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1.5 text-stone">رنگ اصلی (accent)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accentColor}
                onChange={(e) => set("accentColor", e.target.value)}
                className="w-11 h-11 rounded-sm border border-line bg-transparent"
              />
              <span className="eng text-sm text-stone">{form.accentColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-stone">رنگ پس‌زمینه</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.backgroundColor}
                onChange={(e) => set("backgroundColor", e.target.value)}
                className="w-11 h-11 rounded-sm border border-line bg-transparent"
              />
              <span className="eng text-sm text-stone">{form.backgroundColor}</span>
            </div>
          </div>
        </div>
        <p className="text-stone text-xs mt-3">
          این مقادیر ذخیره می‌شوند؛ اتصال زنده‌شان به سیستم طراحی Tailwind بخشی از اسلایس بعدی است.
        </p>
      </section>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="px-7 py-3 rounded-sm bg-red text-ivory text-sm hover:bg-[#8c121c] transition-colors disabled:opacity-50"
        >
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
        {saved && <span className="text-stone text-sm">ذخیره شد ✓</span>}
      </div>
    </div>
  );
}
