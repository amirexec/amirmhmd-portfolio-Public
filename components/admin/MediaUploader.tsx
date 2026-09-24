"use client";
import { useRef, useState } from "react";

type MediaItem = { id: string; url: string; type: string };

// Single-image picker (used for cover images and thumbnails). Uploads
// immediately on file select and reports the created Media row up.
export default function MediaUploader({
  value,
  onChange,
  accept = "image/*",
  label,
}: {
  value?: MediaItem | null;
  onChange: (media: MediaItem | null) => void;
  accept?: string;
  label: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const media = await res.json();
      onChange(media);
    } catch {
      setError("آپلود ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm mb-1.5 text-stone">{label}</label>
      <div
        className="border border-dashed border-line rounded-sm aspect-video flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-red transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          value.type === "IMAGE" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm text-stone break-all px-3">{value.url}</span>
          )
        ) : (
          <span className="text-sm text-stone">
            {loading ? "در حال آپلود..." : "برای آپلود کلیک کنید"}
          </span>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
          }}
          className="text-xs text-stone hover:text-red mt-1.5"
        >
          حذف تصویر
        </button>
      )}
      {error && <p className="text-red text-xs mt-1.5">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
