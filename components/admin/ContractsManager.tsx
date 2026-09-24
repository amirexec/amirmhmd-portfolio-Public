"use client";
import { useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

type MediaItem = { id: string; url: string; type: string };
type Status = "DRAFT" | "SENT" | "SIGNED" | "ARCHIVED";
type Contract = {
  id: string;
  title: string;
  clientName: string | null;
  projectId: string | null;
  pdfMediaId: string | null;
  status: Status;
  notes: string | null;
};
type Project = { id: string; title: string };

const STATUS_LABEL: Record<Status, string> = {
  DRAFT: "پیش‌نویس",
  SENT: "ارسال‌شده",
  SIGNED: "امضاشده",
  ARCHIVED: "بایگانی",
};

const EMPTY = { title: "", clientName: "", projectId: "", notes: "", pdf: null as MediaItem | null };

export default function ContractsManager({
  initialItems,
  projects,
}: {
  initialItems: Contract[];
  projects: Project[];
}) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function startNew() {
    setEditingId("new");
    setForm(EMPTY);
  }

  async function save() {
    setSaving(true);
    const payload = {
      title: form.title,
      clientName: form.clientName || undefined,
      projectId: form.projectId || null,
      pdfMediaId: form.pdf?.id ?? null,
      notes: form.notes || undefined,
    };

    if (editingId === "new") {
      const res = await fetch("/api/admin/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
    }
    setSaving(false);
    setEditingId(null);
  }

  async function updateStatus(id: string, status: Status) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    await fetch(`/api/admin/contracts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function remove(id: string) {
    if (!confirm("این قرارداد حذف شود؟")) return;
    await fetch(`/api/admin/contracts/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <div className="border border-line rounded-sm overflow-hidden mb-4">
        {items.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-4 border-b border-line last:border-b-0">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{c.title}</p>
              {c.clientName && <p className="text-stone text-xs mt-0.5">{c.clientName}</p>}
            </div>
            <select
              value={c.status}
              onChange={(e) => updateStatus(c.id, e.target.value as Status)}
              className="bg-black border border-line rounded-sm px-2 py-1.5 text-xs outline-none focus:border-red"
            >
              {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
            <button onClick={() => remove(c.id)} className="text-sm text-stone hover:text-red transition-colors">
              حذف
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-stone text-sm p-5">هنوز قراردادی ثبت نشده است.</p>}
      </div>

      {editingId === "new" ? (
        <div className="border border-line rounded-sm p-5 space-y-4">
          <input
            placeholder="عنوان قرارداد *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
          />
          <input
            placeholder="نام کارفرما (اختیاری)"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red"
          />
          <select
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            className="w-full bg-black border border-line rounded-sm px-3 py-2.5 text-stone outline-none focus:border-red"
          >
            <option value="">مرتبط به پروژه (اختیاری)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <MediaUploader label="فایل PDF قرارداد" value={form.pdf} onChange={(m) => setForm({ ...form, pdf: m })} accept="application/pdf" />
          <textarea
            rows={2}
            placeholder="یادداشت (اختیاری)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 outline-none focus:border-red resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving || !form.title}
              className="px-6 py-2.5 rounded-sm bg-red text-sm hover:bg-[#8c121c] transition-colors disabled:opacity-50"
            >
              {saving ? "..." : "ذخیره"}
            </button>
            <button onClick={() => setEditingId(null)} className="px-6 py-2.5 rounded-sm border border-line text-sm hover:border-ivory transition-colors">
              انصراف
            </button>
          </div>
        </div>
      ) : (
        <button onClick={startNew} className="px-5 py-2.5 rounded-sm bg-red text-ivory text-sm hover:bg-[#8c121c] transition-colors">
          + قرارداد جدید
        </button>
      )}
    </div>
  );
}
