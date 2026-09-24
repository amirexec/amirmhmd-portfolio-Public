import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const ReorderSchema = z.object({
  orderedIds: z.array(z.string()).min(1),
});

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const parsed = ReorderSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "ترتیب نامعتبر است." }, { status: 400 });
  }

  await prisma.$transaction(
    parsed.data.orderedIds.map((id, index) =>
      prisma.project.update({ where: { id }, data: { order: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
