import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const Schema = z.object({
  siteName: z.string().optional(),
  logoMediaId: z.string().optional().nullable(),
  faviconMediaId: z.string().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  socialPreviewId: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  whatsappUrl: z.string().optional().nullable(),
  telegramUrl: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  accentColor: z.string().optional(),
  backgroundColor: z.string().optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const mediaIds = [settings.logoMediaId, settings.faviconMediaId, settings.socialPreviewId].filter(
    (id): id is string => !!id
  );
  const mediaRows = mediaIds.length ? await prisma.media.findMany({ where: { id: { in: mediaIds } } }) : [];
  const mediaById = Object.fromEntries(mediaRows.map((m) => [m.id, m]));

  return NextResponse.json({
    ...settings,
    logo: settings.logoMediaId ? mediaById[settings.logoMediaId] ?? null : null,
    favicon: settings.faviconMediaId ? mediaById[settings.faviconMediaId] ?? null : null,
    socialPreview: settings.socialPreviewId ? mediaById[settings.socialPreviewId] ?? null : null,
  });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  return NextResponse.json(settings);
}
