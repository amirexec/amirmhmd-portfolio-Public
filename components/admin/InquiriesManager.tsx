"use client";
import { useState } from "react";

type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  projectType: string | null;
  budget: string | null;
  description: string;
  preferredContact: string | null;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  adminNotes: string | null;
  createdAt: string;
};

const STATUS_LABEL: Record<Inquiry["status"], string> = {
  NEW: "جدید",
  CONTACTED: "تماس گرفته شد",
  IN_PROGRESS: "در حال انجام",
  COMPLETED: "تکمیل شده",
  REJECTED: "رد شده",
};

const STATUS_COLOR: Record<Inquiry["status"], string> = {
  NEW: "text-red",
  CONTACTED: "text-ivory",
  IN_PROGRESS: "text-ivory",
  COMPLETED: "text-stone",
  REJECTED: "text-stone",
};

export default function InquiriesManager({ initialItems }: { initialItems: Inquiry[] }) {
  const [items, setItems] = useState(initialItems);
  const [openId, setOpenId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  async function updateStatus(id: string, status: Inquiry["status"]) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function saveNotes(id: string) {
    const adminNotes = notesDraft[id] ?? "";
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, adminNotes } : i)));
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNotes }),
    });
  }

  async function remove(id: string) {
    if (!confirm("این درخواست حذف شود؟")) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (items.length === 0) {
    return (
      <p className="text-stone text-sm border border-dashed border-line rounded-sm p-8 text-center">
        هنوز درخواستی ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="border border-line rounded-sm overflow-hidden max-w-4xl">
      {items.map((i) => (
        <div key={i.id} className="border-b border-line last:border-b-0">
          <div
            className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
            onClick={() => setOpenId(openId === i.id ? null : i.id)}
          >
            <span className={`text-xs shrink-0 w-28 ${STATUS_COLOR[i.status]}`}>{STATUS_LABEL[i.status]}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {i.name} {i.company && <span className="text-stone">— {i.company}</span>}
              </p>
              <p className="text-stone text-xs truncate mt-0.5">{i.description}</p>
            </div>
            <span className="eng text-stone text-xs shrink-0">
              {new Date(i.createdAt).toLocaleDateString("fa-IR")}
            </span>
          </div>

          {openId === i.id && (
            <div className="px-5 pb-5 bg-white/[0.02] space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <p>
                  <span className="text-stone">تلفن: </span>
                  <span className="eng">{i.phone}</span>
                </p>
                {i.email && (
                  <p>
                    <span className="text-stone">ایمیل: </span>
                    <span className="eng">{i.email}</span>
                  </p>
                )}
                {i.projectType && (
                  <p>
                    <span className="text-stone">نوع پروژه: </span>
                    {i.projectType}
                  </p>
                )}
                {i.budget && (
                  <p>
                    <span className="text-stone">بودجه: </span>
                    {i.budget}
                  </p>
                )}
                {i.preferredContact && (
                  <p>
                    <span className="text-stone">روش ارتباطی: </span>
                    {i.preferredContact}
                  </p>
                )}
              </div>
              <p className="text-sm leading-relaxed border-t border-line pt-4">{i.description}</p>

              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS_LABEL) as Inquiry["status"][]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(i.id, s)}
                    className={`px-3 py-1.5 rounded-sm text-xs border transition-colors ${
                      i.status === s ? "border-red text-red" : "border-line text-stone hover:text-ivory"
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs text-stone mb-1.5">یادداشت داخلی</label>
                <textarea
                  rows={2}
                  defaultValue={i.adminNotes ?? ""}
                  onChange={(e) => setNotesDraft((prev) => ({ ...prev, [i.id]: e.target.value }))}
                  onBlur={() => saveNotes(i.id)}
                  className="w-full bg-transparent border border-line rounded-sm px-3 py-2 text-sm outline-none focus:border-red resize-none"
                  placeholder="فقط برای شما قابل مشاهده است..."
                />
              </div>

              <button onClick={() => remove(i.id)} className="text-xs text-stone hover:text-red transition-colors">
                حذف این درخواست
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
