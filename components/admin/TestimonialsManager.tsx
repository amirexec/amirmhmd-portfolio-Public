"use client";
import { useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

type MediaItem = { id: string; url: string; type: string };
type Testimonial = {
  id: string;
  clientName: string;
  company: string | null;
  quote: string;
  project: string | null;
  photoId: string | null;
  photoPreview: MediaItem | null;
};

const EMPTY = { clientName: "", company: "", quote: "", project: "", photo: null as MediaItem | null };

export default function TestimonialsManager({ initialItems }: { initialItems: Testimonial[] }) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [dragId, setDragId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startNew() {
    setEditingId("new");
    setForm(EMPTY);
  }

  function startEdit(t: Testimonial) {
    setEditingId(t.id);
    setForm({
      clientName: t.clientName,
      company: t.company ?? "",
      quote: t.quote,
      project: t.project ?? "",
      photo: t.photoPreview,
    });
  }

  async function save() {
    setSaving(true);
    const payload = {
      clientName: form.clientName,
      company: form.company || undefined,
      quote: form.quote,
      project: form.project || undefined,
      photoId: form.photo?.id ?? null,
    };

    if (editingId === "new") {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      setItems((prev) => [...prev, { ...created, photoPreview: form.photo }]);
    } else if (editingId) {
      await fetch(`/api/admin/testimonials/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setItems((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...payload, photoPreview: form.photo } : t)));
    }
    setSaving(false);
    setEditingId(null);
  }

  async function remove(id: string) {
    if (!confirm("این نظر حذف شود؟")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  function persistOrder(next: Testimonial[]) {
    setItems(next);
    fetch("/api/admin/testimonials/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: next.map((t) => t.id) }),
    });
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = items.findIndex((t) => t.id === dragId);
    const to = items.findIndex((t) => t.id === targetId);
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistOrder(next);
    setDragId(null);
  }

  return (
    <div className="max-w-2xl">
      <div className="border border-line rounded-sm overflow-hidden mb-4">
        {items.map((t) => (
          <div key={t.id}>
            <div
              draggable
              onDragStart={() => setDragId(t.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(t.id)}
              className="flex items-center gap-4 px-5 py-4 border-b border-line last:border-b-0 hover:bg-white/[0.03] cursor-grab active:cursor-grabbing"
            >
              <span className="text-stone text-sm select-none">⠿</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {t.clientName} {t.company && <span className="text-stone">— {t.company}</span>}
                </p>
                <p className="text-stone text-xs truncate mt-0.5">{t.quote}</p>
              </div>
              <button onClick={() => startEdit(t)} className="text-sm hover:text-red transition-colors">
                ویرایش
              </button>
              <button onClick={() => remove(t.id)} className="text-sm text-stone hover:text-red transition-colors">
                حذف
              </button>
            </div>
            {editingId === t.id && (
              <TestimonialForm form={form} setForm={setForm} onSave={save} onCancel={() => setEditingId(null)} saving={saving} />
            )}
          </div>
        ))}
      </div>

      {editingId === "new" ? (
        <div className="border border-line rounded-sm">
          <TestimonialForm form={form} setForm={setForm} onSave={save} onCancel={() => setEditingId(null)} saving={saving} />
        </div>
      ) : (
        <button onClick={startNew} className="px-5 py-2.5 rounded-sm bg-red text-ivory text-sm hover:bg-[#8c121c] transition-colors">
          + نظر جدید
        </button>
      )}
    </div>
  );
}

function TestimonialForm({
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
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="نام مشتری *"
          value={form.clientName}
          onChange={(e) => setForm({ ...form, clientName: e.target.value })}
          className="bg-transparent border border-line rounded-sm px-3 py-2.5 text-sm outline-none focus:border-red"
        />
        <input
          placeholder="شرکت (اختیاری)"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="bg-transparent border border-line rounded-sm px-3 py-2.5 text-sm outline-none focus:border-red"
        />
      </div>
      <textarea
        rows={3}
        placeholder="متن نظر مشتری *"
        value={form.quote}
        onChange={(e) => setForm({ ...form, quote: e.target.value })}
        className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 text-sm outline-none focus:border-red resize-none"
      />
      <input
        placeholder="مرتبط با کدام پروژه (اختیاری)"
        value={form.project}
        onChange={(e) => setForm({ ...form, project: e.target.value })}
        className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 text-sm outline-none focus:border-red"
      />
      <MediaUploader label="عکس مشتری (اختیاری)" value={form.photo} onChange={(m) => setForm({ ...form, photo: m })} />
      <div className="flex gap-3">
        <button
          onClick={onSave}
          disabled={saving || !form.clientName || !form.quote}
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
