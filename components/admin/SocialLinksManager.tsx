"use client";
import { useState } from "react";

type Row = { id: string; platform: string; url: string };

export default function SocialLinksManager({ initialItems }: { initialItems: Row[] }) {
  const [items, setItems] = useState(initialItems);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  async function add() {
    if (!platform.trim() || !url.trim()) return;
    const res = await fetch("/api/admin/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, url }),
    });
    const created = await res.json();
    setItems((prev) => [...prev, created]);
    setPlatform("");
    setUrl("");
  }

  async function remove(id: string) {
    await fetch(`/api/admin/social-links/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function persistOrder(next: Row[]) {
    setItems(next);
    fetch("/api/admin/social-links/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: next.map((i) => i.id) }),
    });
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = items.findIndex((i) => i.id === dragId);
    const to = items.findIndex((i) => i.id === targetId);
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persistOrder(next);
    setDragId(null);
  }

  return (
    <div className="max-w-xl">
      <div className="border border-line rounded-sm overflow-hidden mb-4">
        {items.map((i) => (
          <div
            key={i.id}
            draggable
            onDragStart={() => setDragId(i.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(i.id)}
            className="flex items-center gap-4 px-5 py-3.5 border-b border-line last:border-b-0 hover:bg-white/[0.03] cursor-grab active:cursor-grabbing"
          >
            <span className="text-stone text-sm select-none">⠿</span>
            <span className="font-medium w-32">{i.platform}</span>
            <span className="eng text-stone text-sm flex-1 truncate" dir="ltr">{i.url}</span>
            <button onClick={() => remove(i.id)} className="text-sm text-stone hover:text-red transition-colors">
              حذف
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-stone text-sm p-5">هنوز لینکی اضافه نشده است.</p>}
      </div>
      <div className="flex gap-2">
        <input
          placeholder="نام پلتفرم (مثلاً LinkedIn)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-40 bg-transparent border border-line rounded-sm px-3 py-2.5 text-sm outline-none focus:border-red"
        />
        <input
          placeholder="لینک"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          dir="ltr"
          className="flex-1 bg-transparent border border-line rounded-sm px-3 py-2.5 text-sm outline-none focus:border-red"
        />
        <button onClick={add} className="px-5 py-2.5 rounded-sm bg-red text-sm hover:bg-[#8c121c] transition-colors">
          افزودن
        </button>
      </div>
    </div>
  );
}
