type MediaItem = { url: string };
type TestimonialItem = {
  id: string;
  clientName: string;
  company: string | null;
  quote: string;
  project: string | null;
  photo: MediaItem | null;
};

export default function Testimonials({ testimonials }: { testimonials: TestimonialItem[] }) {
  if (!testimonials.length) return null;

  return (
    <section className="px-6 md:px-14 py-28 border-t border-line">
      <p className="eng text-red text-sm">05 — TESTIMONIALS</p>
      <div className="w-14 h-px bg-red my-5" />
      <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold mb-12">نظر مشتریان</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((t) => (
          <blockquote key={t.id} className="border-r-2 border-red pr-6">
            <p className="text-lg font-light leading-relaxed text-[#e6e0d6]">«{t.quote}»</p>
            <footer className="mt-4 flex items-center gap-3">
              {t.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.photo.url} alt={t.clientName} className="w-9 h-9 rounded-full object-cover" />
              )}
              <div className="text-sm">
                <span className="text-ivory">{t.clientName}</span>
                {t.company && <span className="text-stone"> — {t.company}</span>}
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
