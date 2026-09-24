"use client";
import { useEffect, useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

type MediaItem = { id: string; url: string; type: string };

type FormState = {
  heroTagline: string;
  heroRoleLine: string;
  heroPortrait: MediaItem | null;
  aboutHeading: string;
  aboutBody: string;
  aboutPortrait: MediaItem | null;
  showreelTitle: string;
  showreelUrl: string;
  showreelThumb: MediaItem | null;
  showreelDesc: string;
};

export default function HomepageContentManager() {
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((r) => r.json())
      .then((d) =>
        setForm({
          heroTagline: d.heroTagline,
          heroRoleLine: d.heroRoleLine,
          heroPortrait: d.heroPortrait,
          aboutHeading: d.aboutHeading,
          aboutBody: d.aboutBody,
          aboutPortrait: d.aboutPortrait,
          showreelTitle: d.showreelTitle,
          showreelUrl: d.showreelUrl ?? "",
          showreelThumb: d.showreelThumb,
          showreelDesc: d.showreelDesc,
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
    await fetch("/api/admin/homepage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heroTagline: form.heroTagline,
        heroRoleLine: form.heroRoleLine,
        heroPortraitId: form.heroPortrait?.id ?? null,
        aboutHeading: form.aboutHeading,
        aboutBody: form.aboutBody,
        aboutPortraitId: form.aboutPortrait?.id ?? null,
        showreelTitle: form.showreelTitle,
        showreelUrl: form.showreelUrl || null,
        showreelThumbId: form.showreelThumb?.id ?? null,
        showreelDesc: form.showreelDesc,
      }),
    });
    setSaving(false);
    setSaved(true);
  }

  if (!form) return <p className="text-stone text-sm">در حال بارگذاری...</p>;

  return (
    <div className="max-w-2xl space-y-12">
      <section>
        <h2 className="eng text-red text-sm mb-4">HERO</h2>
        <div className="space-y-4">
          <MediaUploader label="پرتره هیرو" value={form.heroPortrait} onChange={(m) => set("heroPortrait", m)} />
          <div>
            <label className="block text-sm mb-1.5 text-stone">جمله تگ‌لاین</label>
            <input
              value={form.heroTagline}
              onChange={(e) => set("heroTagline", e.target.value)}
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-stone">خط عنوان (انگلیسی)</label>
            <input
              value={form.heroRoleLine}
              onChange={(e) => set("heroRoleLine", e.target.value)}
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red eng"
              dir="ltr"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="eng text-red text-sm mb-4">ABOUT</h2>
        <div className="space-y-4">
          <MediaUploader label="پرتره درباره من" value={form.aboutPortrait} onChange={(m) => set("aboutPortrait", m)} />
          <div>
            <label className="block text-sm mb-1.5 text-stone">عنوان بخش</label>
            <input
              value={form.aboutHeading}
              onChange={(e) => set("aboutHeading", e.target.value)}
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-stone">بیوگرافی</label>
            <textarea
              rows={6}
              value={form.aboutBody}
              onChange={(e) => set("aboutBody", e.target.value)}
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red resize-none"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="eng text-red text-sm mb-4">SHOWREEL</h2>
        <div className="space-y-4">
          <MediaUploader label="تصویر بندانگشتی" value={form.showreelThumb} onChange={(m) => set("showreelThumb", m)} />
          <div>
            <label className="block text-sm mb-1.5 text-stone">عنوان Showreel</label>
            <input
              value={form.showreelTitle}
              onChange={(e) => set("showreelTitle", e.target.value)}
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-stone">لینک ویدیو (یوتیوب، ووکست یا هر لینک مستقیم)</label>
            <input
              value={form.showreelUrl}
              onChange={(e) => set("showreelUrl", e.target.value)}
              placeholder="https://..."
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-stone">توضیح کوتاه</label>
            <textarea
              rows={2}
              value={form.showreelDesc}
              onChange={(e) => set("showreelDesc", e.target.value)}
              className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red resize-none"
            />
          </div>
        </div>
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
