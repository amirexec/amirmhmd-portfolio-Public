import Link from "next/link";

type ProjectCard = {
  id: string;
  title: string;
  year: number;
  coverUrl?: string | null;
  category?: { name: string } | null;
};

export default function PortfolioGrid({ projects }: { projects: ProjectCard[] }) {
  const isReal = projects.length > 0;
  const items = isReal ? projects : PLACEHOLDER;

  return (
    <section id="work" className="px-6 md:px-14 py-28">
      <p className="eng text-red text-sm">03 — SELECTED WORK</p>
      <div className="w-14 h-px bg-red my-5" />
      <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold mb-12">پروژه‌های منتخب</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((p) => {
          const card = (
            <div
              className="relative aspect-[3/4] rounded-sm overflow-hidden border border-line hover:border-red transition-colors"
              style={{
                background: p.coverUrl
                  ? `url(${p.coverUrl}) center/cover`
                  : "linear-gradient(150deg,#1b1613,#221a17 55%,#131010)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/15 to-transparent" />
              <div className="absolute right-5 bottom-5 left-5">
                <p className="text-red text-xs mb-1">{p.category?.name ?? "پروژه"}</p>
                <h3 className="font-bold text-lg">{p.title}</h3>
                <p className="eng text-stone text-sm mt-1">{p.year}</p>
              </div>
            </div>
          );

          return isReal ? (
            <Link key={p.id} href={`/projects/${p.id}`}>
              {card}
            </Link>
          ) : (
            <div key={p.id}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}

// Shown only until real projects are published from the admin.
const PLACEHOLDER: ProjectCard[] = [
  { id: "1", title: "کمپین برند آفتاب", year: 2026, category: { name: "تیزر تبلیغاتی" } },
  { id: "2", title: "مستند کوتاه شهر", year: 2025, category: { name: "فیلمبرداری" } },
  { id: "3", title: "سری ریلز فصلی", year: 2025, category: { name: "محتوای شبکه‌های اجتماعی" } },
];
