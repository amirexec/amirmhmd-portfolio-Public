"use client";
import { useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

type MediaItem = { id: string; url: string; type: string };
type Service = {
  id: string;
  title: string;
  description: string | null;
  mediaId: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  enabled: boolean;
  mediaPreview: MediaItem | null;
};

const EMPTY = { title: "", description: "", ctaLabel: "", ctaUrl: "", media: null as MediaItem | null };

export default function ServicesManager({ initialItems }: { initialItems: Service[] }) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [dragId, setDragId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startNew() {
    setEditingId("new");
    setForm(EMPTY);
  }

  function startEdit(s: Service) {
    setEditingId(s.id);
    setForm({
      title: s.title,
      description: s.description ?? "",
      ctaLabel: s.ctaLabel ?? "",
      ctaUrl: s.ctaUrl ?? "",
      media: s.mediaPreview,
    });
  }

  async function save() {
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description || undefined,
      ctaLabel: form.ctaLabel || undefined,
      ctaUrl: form.ctaUrl || undefined,
      mediaId: form.media?.id ?? null,
    };

    if (editingId === "new") {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      setItems((prev) => [...prev, { ...created, enabled: true, mediaPreview: form.media }]);
    } else if (editingId) {
      await fetch(`/api/admin/services/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setItems((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...payload, mediaPreview: form.media } : s))
      );
    }
    setSaving(false);
    setEditingId(null);
  }

  async function remove(id: string) {
    if (!confirm("این سرویس حذف شود؟")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((s) => s.id !== id));
  }

  async function toggleEnabled(id: string, enabled: boolean) {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)));
    await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
  }

  function persistOrder(next: Service[]) {
    setItems(next);
    fetch("/api/admin/services/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: next.map((s) => s.id) }),
    });
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = items.findIndex((s) => s.id === dragId);
    const to = items.findIndex((s) => s.id === targetId);
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistOrder(next);
    setDragId(null);
  }

  return (
    <div className="max-w-2xl">
      <div className="border border-line rounded-sm overflow-hidden mb-4">
        {items.map((s) => (
          <div key={s.id}>
            <div
              draggable
              onDragStart={() => setDragId(s.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(s.id)}
              className="flex items-center gap-4 px-5 py-4 border-b border-line last:border-b-0 hover:bg-white/[0.03] cursor-grab active:cursor-grabbing"
            >
              <span className="text-stone text-sm select-none">⠿</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{s.title}</p>
                {s.description && <p className="text-stone text-xs truncate mt-0.5">{s.description}</p>}
              </div>
              <label className="flex items-center gap-2 text-xs text-stone cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={s.enabled}
                  onChange={(e) => toggleEnabled(s.id, e.target.checked)}
                  className="accent-red"
                />
                فعال
              </label>
              <button onClick={() => startEdit(s)} className="text-sm hover:text-red transition-colors">
                ویرایش
              </button>
              <button onClick={() => remove(s.id)} className="text-sm text-stone hover:text-red transition-colors">
                حذف
              </button>
            </div>
            {editingId === s.id && (
              <ServiceForm form={form} setForm={setForm} onSave={save} onCancel={() => setEditingId(null)} saving={saving} />
            )}
          </div>
        ))}
      </div>

      {editingId === "new" ? (
        <div className="border border-line rounded-sm">
          <ServiceForm form={form} setForm={setForm} onSave={save} onCancel={() => setEditingId(null)} saving={saving} />
        </div>
      ) : (
        <button
          onClick={startNew}
          className="px-5 py-2.5 rounded-sm bg-red text-ivory text-sm hover:bg-[#8c121c] transition-colors"
        >
          + سرویس جدید
        </button>
      )}
    </div>
  );
}

function ServiceForm({
  form,
  setForm,
  onSave,
  onCancel,
  saving,
}: {
  form: typeof EMPTY;
  setForm: (f: typeof EMPTY) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="p-5 space-y-4 bg-white/[0.02]">
      <div>
        <label className="block text-sm mb-1.5 text-stone">عنوان سرویس *</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
        />
      </div>
      <div>
        <label className="block text-sm mb-1.5 text-stone">توضیح کوتاه</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red resize-none"
        />
      </div>
      <MediaUploader label="تصویر/ویدیو (اختیاری)" value={form.media} onChange={(m) => setForm({ ...form, media: m })} />
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="متن دکمه CTA"
          value={form.ctaLabel}
          onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
          className="bg-transparent border border-line rounded-sm px-3 py-2.5 text-sm outline-none focus:border-red"
        />
        <input
          placeholder="لینک CTA"
          value={form.ctaUrl}
          onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
          className="bg-transparent border border-line rounded-sm px-3 py-2.5 text-sm outline-none focus:border-red"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={onSave}
          disabled={saving || !form.title}
          className="px-6 py-2.5 rounded-sm bg-red text-sm hover:bg-[#8c121c] transition-colors disabled:opacity-50"
        >
          {saving ? "..." : "ذخیره"}
        </button>
        <button onClick={onCancel} className="px-6 py-2.5 rounded-sm border border-line text-sm hover:border-ivory transition-colors">
          انصراف
        </button>
      </div>
    </div>
  );
}
