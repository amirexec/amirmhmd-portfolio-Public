import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const UpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "REJECTED"]).optional(),
  adminNotes: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const parsed = UpdateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "داده نامعتبر است." }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(inquiry);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await prisma.inquiry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
