import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const Schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  mediaId: z.string().optional().nullable(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  enabled: z.boolean().optional(),
}).partial();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.service.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await prisma.service.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
