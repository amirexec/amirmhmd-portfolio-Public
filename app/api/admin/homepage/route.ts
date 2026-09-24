import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const Schema = z.object({
  heroTagline: z.string().optional(),
  heroRoleLine: z.string().optional(),
  heroPortraitId: z.string().optional().nullable(),
  aboutHeading: z.string().optional(),
  aboutBody: z.string().optional(),
  aboutPortraitId: z.string().optional().nullable(),
  showreelTitle: z.string().optional(),
  showreelUrl: z.string().optional().nullable(),
  showreelThumbId: z.string().optional().nullable(),
  showreelDesc: z.string().optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const content = await prisma.homepageContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const mediaIds = [content.heroPortraitId, content.aboutPortraitId, content.showreelThumbId].filter(
    (id): id is string => !!id
  );
  const mediaRows = mediaIds.length ? await prisma.media.findMany({ where: { id: { in: mediaIds } } }) : [];
  const mediaById = Object.fromEntries(mediaRows.map((m) => [m.id, m]));

  return NextResponse.json({
    ...content,
    heroPortrait: content.heroPortraitId ? mediaById[content.heroPortraitId] ?? null : null,
    aboutPortrait: content.aboutPortraitId ? mediaById[content.aboutPortraitId] ?? null : null,
    showreelThumb: content.showreelThumbId ? mediaById[content.showreelThumbId] ?? null : null,
  });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const content = await prisma.homepageContent.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  return NextResponse.json(content);
}
