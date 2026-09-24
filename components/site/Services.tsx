type ServiceItem = {
  id: string;
  title: string;
  description: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
};

export default function Services({ services }: { services: ServiceItem[] }) {
  if (!services.length) return null;

  return (
    <section id="services" className="px-6 md:px-14 py-28 border-t border-line">
      <p className="eng text-red text-sm">04 — SERVICES</p>
      <div className="w-14 h-px bg-red my-5" />
      <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold mb-12">خدمات</h2>

      <div className="grid md:grid-cols-2 gap-px bg-line">
        {services.map((s) => (
          <div key={s.id} className="bg-black p-8 hover:bg-white/[0.02] transition-colors">
            <h3 className="text-xl font-bold mb-2.5">{s.title}</h3>
            {s.description && <p className="text-stone text-sm leading-relaxed mb-4">{s.description}</p>}
            {s.ctaLabel && s.ctaUrl && (
              <a href={s.ctaUrl} className="text-red text-sm hover:text-ivory transition-colors">
                {s.ctaLabel}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
