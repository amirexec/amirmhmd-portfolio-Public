import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { category: true, media: { orderBy: { order: "asc" } } },
  });
  if (!project || !project.published) return null;

  const mediaIds = [
    ...(project.coverId ? [project.coverId] : []),
    ...project.media.map((m) => m.mediaId),
  ];
  const mediaRows = mediaIds.length ? await prisma.media.findMany({ where: { id: { in: mediaIds } } }) : [];
  const mediaById = new Map(mediaRows.map((m) => [m.id, m]));

  return {
    project,
    cover: project.coverId ? mediaById.get(project.coverId) ?? null : null,
    gallery: project.media.map((m) => mediaById.get(m.mediaId)).filter((m): m is NonNullable<typeof m> => !!m),
  };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getProject(params.id);
  if (!data) return {};
  return {
    title: data.project.seoTitle || `${data.project.title} — امیرمحمد باقری`,
    description: data.project.seoDesc || data.project.description || undefined,
    openGraph: data.cover ? { images: [data.cover.url] } : undefined,
  };
}

// Pre-render published projects at build time; anything published later is
// still served (and cached) on first request via ISR-style on-demand render.
export async function generateStaticParams() {
  const projects = await prisma.project.findMany({ where: { published: true }, select: { id: true } }).catch(() => []);
  return projects.map((p) => ({ id: p.id }));
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const data = await getProject(params.id);
  if (!data) notFound();
  const { project, cover, gallery } = data;

  return (
    <>
      <Header />
      <article className="px-6 md:px-14 pt-32 pb-24 max-w-5xl mx-auto">
        <p className="eng text-red text-sm mb-3">
          {project.category?.name ?? "پروژه"} · {project.year}
        </p>
        <h1 className="text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-tight mb-8">{project.title}</h1>

        <div
          className="aspect-video rounded-sm border border-line overflow-hidden mb-10"
          style={{
            background: cover
              ? `url(${cover.url}) center/cover`
              : "linear-gradient(150deg,#1b1613,#221a17 55%,#131010)",
          }}
        />

        <div className="grid md:grid-cols-[1fr_1.6fr] gap-10 mb-14">
          <dl className="space-y-4 text-sm">
            {project.client && (
              <div>
                <dt className="text-stone mb-1">کارفرما</dt>
                <dd>{project.client}</dd>
              </div>
            )}
            {project.role && (
              <div>
                <dt className="text-stone mb-1">نقش من</dt>
                <dd>{project.role}</dd>
              </div>
            )}
            {project.externalUrl && (
              <div>
                <dt className="text-stone mb-1">لینک خارجی</dt>
                <dd>
                  <a href={project.externalUrl} target="_blank" rel="noreferrer" className="text-red hover:text-ivory transition-colors">
                    مشاهده ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {project.description && (
            <p className="text-[#cfc8bd] leading-loose font-light whitespace-pre-line">{project.description}</p>
          )}
        </div>

        {project.videoUrl && (
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mb-14 px-7 py-3.5 rounded-sm bg-red text-ivory text-sm hover:bg-[#8c121c] transition-colors"
          >
            پخش ویدیوی پروژه
          </a>
        )}

        {gallery.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
            {gallery.map((g) => (
              <div key={g.id} className="aspect-[4/3] rounded-sm border border-line overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <Link href="/#work" className="text-stone hover:text-ivory text-sm transition-colors">
          ← بازگشت به نمونه‌کارها
        </Link>
      </article>
      <Footer />
    </>
  );
}
