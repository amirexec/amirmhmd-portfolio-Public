type MediaItem = { url: string };
type BTSItem = { id: string; caption: string | null; media: MediaItem | null };

export default function BehindTheScenes({ items }: { items: BTSItem[] }) {
  if (!items.length) return null;

  return (
    <section className="px-6 md:px-14 py-28 border-t border-line">
      <p className="eng text-red text-sm">پشت صحنه</p>
      <div className="w-14 h-px bg-red my-5" />
      <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold mb-12">پشت صحنه</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((i, idx) => (
          <div
            key={i.id}
            className={`relative border border-line rounded-sm overflow-hidden ${
              idx % 5 === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[3/4]"
            }`}
          >
            {i.media && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={i.media.url} alt={i.caption ?? ""} className="w-full h-full object-cover" />
            )}
            {i.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-xs text-stone">{i.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
