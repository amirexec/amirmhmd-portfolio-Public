import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        media: { orderBy: { order: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!project) notFound();

  const mediaIds = [
    ...(project.coverId ? [project.coverId] : []),
    ...project.media.map((m) => m.mediaId),
  ];
  const mediaRows = await prisma.media.findMany({ where: { id: { in: mediaIds } } });
  const mediaById = new Map(mediaRows.map((m) => [m.id, m]));

  const cover = project.coverId ? mediaById.get(project.coverId) ?? null : null;
  const gallery = project.media
    .map((m) => mediaById.get(m.mediaId))
    .filter((m): m is NonNullable<typeof m> => !!m);

  return (
    <div className="px-8 py-10">
      <div dir="rtl" className="font-vazir mb-8">
        <h1 className="eng text-2xl mb-1">EDIT PROJECT</h1>
        <p className="text-stone text-sm">{project.title}</p>
      </div>
      <ProjectForm
        categories={categories}
        initial={{
          id: project.id,
          title: project.title,
          client: project.client ?? "",
          year: project.year,
          role: project.role ?? "",
          description: project.description ?? "",
          externalUrl: project.externalUrl ?? "",
          published: project.published,
          categoryId: project.categoryId,
          videoUrl: project.videoUrl ?? "",
          seoTitle: project.seoTitle ?? "",
          seoDesc: project.seoDesc ?? "",
          cover,
          gallery,
        }}
      />
    </div>
  );
}
