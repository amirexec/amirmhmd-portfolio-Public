"use client";
import { useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

type MediaItem = { id: string; url: string; type: string };
type ClientRow = {
  id: string;
  name: string;
  logoId: string;
  url: string | null;
  logoPreview: MediaItem | null;
};

const EMPTY = { name: "", url: "", logo: null as MediaItem | null };

export default function ClientsManager({ initialItems }: { initialItems: ClientRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [dragId, setDragId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.logo) return;
    setSaving(true);
    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, url: form.url || undefined, logoId: form.logo.id }),
    });
    const created = await res.json();
    setItems((prev) => [...prev, { ...created, logoPreview: form.logo }]);
    setForm(EMPTY);
    setAdding(false);
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("این برند حذف شود؟")) return;
    await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  function persistOrder(next: ClientRow[]) {
    setItems(next);
    fetch("/api/admin/clients/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: next.map((c) => c.id) }),
    });
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = items.findIndex((c) => c.id === dragId);
    const to = items.findIndex((c) => c.id === targetId);
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistOrder(next);
    setDragId(null);
  }

  return (
    <div className="max-w-2xl">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
        {items.map((c) => (
          <div
            key={c.id}
            draggable
            onDragStart={() => setDragId(c.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(c.id)}
            className="relative aspect-square border border-line rounded-sm overflow-hidden group cursor-grab active:cursor-grabbing bg-white/[0.02] flex items-center justify-center p-3"
          >
            {c.logoPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.logoPreview.url} alt={c.name} className="max-h-full max-w-full object-contain opacity-90" />
            )}
            <button
              onClick={() => remove(c.id)}
              className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center"
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="border border-line rounded-sm p-5 space-y-4">
          <MediaUploader label="لوگو *" value={form.logo} onChange={(m) => setForm({ ...form, logo: m })} />
          <input
            placeholder="نام برند *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
          />
          <input
            placeholder="وب‌سایت (اختیاری)"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
          />
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving || !form.logo || !form.name}
              className="px-6 py-2.5 rounded-sm bg-red text-sm hover:bg-[#8c121c] transition-colors disabled:opacity-50"
            >
              {saving ? "..." : "ذخیره"}
            </button>
            <button onClick={() => setAdding(false)} className="px-6 py-2.5 rounded-sm border border-line text-sm hover:border-ivory transition-colors">
              انصراف
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="px-5 py-2.5 rounded-sm bg-red text-ivory text-sm hover:bg-[#8c121c] transition-colors">
          + برند جدید
        </button>
      )}
    </div>
  );
}
