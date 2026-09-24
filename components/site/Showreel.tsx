"use client";

export default function Showreel({
  title,
  description,
  videoUrl,
  thumbnailUrl,
}: {
  title: string;
  description: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
}) {
  return (
    <section id="reel" className="px-6 md:px-14 py-28 bg-void border-y border-line">
      <p className="eng text-red text-sm">02 — SHOWREEL</p>
      <div className="w-14 h-px bg-red my-5" />
      <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold mb-9">نمونه‌ی حرکت</h2>

      <div
        className="relative aspect-[16/8.2] rounded-sm border border-line overflow-hidden flex items-center justify-center cursor-pointer"
        style={{
          background: thumbnailUrl
            ? `url(${thumbnailUrl}) center/cover`
            : "radial-gradient(ellipse at 50% 40%, rgba(163,22,33,0.14), transparent 60%), linear-gradient(120deg,#171310,#1f1815 55%,#120f0d)",
        }}
        onClick={() => videoUrl && window.open(videoUrl, "_blank")}
        role="button"
        tabIndex={0}
      >
        <div className="w-20 h-20 rounded-full border border-ivory flex items-center justify-center bg-black/35 hover:scale-105 hover:border-red hover:bg-red/20 transition-transform">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 4L20 12L6 20V4Z" fill="#EDE7DE" />
          </svg>
        </div>
        <span className="eng absolute bottom-5 left-6 text-xs text-stone">{title}</span>
      </div>
      <p className="text-stone text-sm mt-6 max-w-[60ch]">{description}</p>
    </section>
  );
}
