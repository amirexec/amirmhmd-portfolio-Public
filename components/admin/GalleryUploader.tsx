"use client";
import { useRef, useState } from "react";

type MediaItem = { id: string; url: string; type: string };

// Multi-image picker for a project's gallery. Each upload appends to the list;
// items can be removed individually.
export default function GalleryUploader({
  value,
  onChange,
}: {
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setLoading(true);
    try {
      const uploaded: MediaItem[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/media", { method: "POST", body: formData });
        if (res.ok) uploaded.push(await res.json());
      }
      onChange([...value, ...uploaded]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm mb-1.5 text-stone">گالری تصاویر</label>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {value.map((m) => (
          <div key={m.id} className="relative aspect-square border border-line rounded-sm overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v.id !== m.id))}
              className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            >
              حذف
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-square border border-dashed border-line rounded-sm text-stone text-xs hover:border-red transition-colors"
        >
          {loading ? "..." : "+ افزودن"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
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
