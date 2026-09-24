import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const Schema = z.object({
  title: z.string().min(1).optional(),
  clientName: z.string().optional(),
  projectId: z.string().optional().nullable(),
  pdfMediaId: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "SENT", "SIGNED", "ARCHIVED"]).optional(),
  notes: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const item = await prisma.contract.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await prisma.contract.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
