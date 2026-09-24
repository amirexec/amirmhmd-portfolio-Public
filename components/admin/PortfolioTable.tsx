"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  title: string;
  year: number;
  published: boolean;
  category: { name: string } | null;
};

export default function PortfolioTable({ projects }: { projects: Row[] }) {
  const [items, setItems] = useState(projects);
  const [dragId, setDragId] = useState<string | null>(null);
  const router = useRouter();

  function persistOrder(next: Row[]) {
    setItems(next);
    fetch("/api/admin/projects/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: next.map((p) => p.id) }),
    });
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = items.findIndex((p) => p.id === dragId);
    const to = items.findIndex((p) => p.id === targetId);
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistOrder(next);
    setDragId(null);
  }

  async function togglePublish(id: string, published: boolean) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, published } : p)));
    await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
  }

  async function remove(id: string) {
    if (!confirm("این پروژه حذف شود؟ این عمل قابل بازگشت نیست.")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((p) => p.id !== id));
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <p className="text-stone text-sm border border-dashed border-line rounded-sm p-8 text-center">
        هنوز پروژه‌ای ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="border border-line rounded-sm overflow-hidden">
      {items.map((p) => (
        <div
          key={p.id}
          draggable
          onDragStart={() => setDragId(p.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(p.id)}
          className="flex items-center gap-4 px-5 py-4 border-b border-line last:border-b-0 bg-black hover:bg-white/[0.03] transition-colors cursor-grab active:cursor-grabbing"
        >
          <span className="text-stone text-sm select-none">⠿</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{p.title}</p>
            <p className="text-stone text-xs mt-0.5">
              {p.category?.name ?? "بدون دسته‌بندی"} · <span className="eng">{p.year}</span>
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs text-stone cursor-pointer select-none">
            <input
              type="checkbox"
              checked={p.published}
              onChange={(e) => togglePublish(p.id, e.target.checked)}
              className="accent-red"
            />
            منتشر شده
          </label>
          <Link href={`/admin/portfolio/${p.id}`} className="text-sm text-ivory hover:text-red transition-colors">
            ویرایش
          </Link>
          <button onClick={() => remove(p.id)} className="text-sm text-stone hover:text-red transition-colors">
            حذف
          </button>
        </div>
      ))}
    </div>
  );
}
