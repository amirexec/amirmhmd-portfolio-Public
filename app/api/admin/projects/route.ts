import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const ProjectSchema = z.object({
  title: z.string().min(1),
  client: z.string().optional(),
  year: z.coerce.number().int(),
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

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { category: true, media: true },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const parsed = ProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { galleryMediaIds, ...data } = parsed.data;
  const maxOrder = await prisma.project.aggregate({ _max: { order: true } });

  const project = await prisma.project.create({
    data: {
      ...data,
      order: (maxOrder._max.order ?? -1) + 1,
      media: galleryMediaIds
        ? { create: galleryMediaIds.map((mediaId, i) => ({ mediaId, order: i })) }
        : undefined,
    },
    include: { category: true, media: true },
  });

  return NextResponse.json(project, { status: 201 });
}
