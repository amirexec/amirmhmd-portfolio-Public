"use client";
import { useRef, useState } from "react";

type MediaItem = { id: string; url: string; type: string };
type BTSRow = { id: string; caption: string | null; media: MediaItem | null };

export default function BTSManager({ initialItems }: { initialItems: BTSRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const mediaRes = await fetch("/api/admin/media", { method: "POST", body: formData });
      if (!mediaRes.ok) continue;
      const media = await mediaRes.json();

      const res = await fetch("/api/admin/bts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId: media.id }),
      });
      const created = await res.json();
      setItems((prev) => [...prev, { ...created, media }]);
    }
    setUploading(false);
  }

  async function remove(id: string) {
    if (!confirm("این تصویر حذف شود؟")) return;
    await fetch(`/api/admin/bts/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function updateCaption(id: string, caption: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, caption } : i)));
    await fetch(`/api/admin/bts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption }),
    });
  }

  function persistOrder(next: BTSRow[]) {
    setItems(next);
    fetch("/api/admin/bts/reorder", {
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
    <div className="max-w-3xl">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
        {items.map((i) => (
          <div
            key={i.id}
            draggable
            onDragStart={() => setDragId(i.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(i.id)}
            className="relative aspect-[3/4] border border-line rounded-sm overflow-hidden group cursor-grab active:cursor-grabbing"
          >
            {i.media && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={i.media.url} alt="" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/75 transition-colors flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => remove(i.id)} className="self-end text-xs bg-black/60 px-2 py-1 rounded-sm">
                حذف
              </button>
              <input
                defaultValue={i.caption ?? ""}
                onBlur={(e) => updateCaption(i.id, e.target.value)}
                placeholder="زیرنویس..."
                className="bg-black/60 border border-line rounded-sm px-2 py-1 text-xs outline-none focus:border-red"
              />
            </div>
          </div>
        ))}
        <button
          onClick={() => inputRef.current?.click()}
          className="aspect-[3/4] border border-dashed border-line rounded-sm text-stone text-sm hover:border-red transition-colors"
        >
          {uploading ? "..." : "+ افزودن تصویر"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
