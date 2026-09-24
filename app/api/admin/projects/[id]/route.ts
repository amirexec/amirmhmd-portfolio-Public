import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const ProjectUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  client: z.string().optional(),
  year: z.coerce.number().int().optional(),
  role: z.string().optional(),
  description: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  coverId: z.string().optional().nullable(),
  videoUrl: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  galleryMediaIds: z.array(z.string()).optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { category: true, media: true },
  });
  if (!project) return NextResponse.json({ error: "یافت نشد." }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const parsed = ProjectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { galleryMediaIds, ...data } = parsed.data;

  if (galleryMediaIds) {
    await prisma.projectMedia.deleteMany({ where: { projectId: params.id } });
  }

  const project = await prisma.project.update({
    where: { id: params.id },
    data: {
      ...data,
      media: galleryMediaIds
        ? { create: galleryMediaIds.map((mediaId, i) => ({ mediaId, order: i })) }
        : undefined,
    },
    include: { category: true, media: true },
  });

  return NextResponse.json(project);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
