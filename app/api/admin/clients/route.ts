import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const Schema = z.object({
  name: z.string().min(1),
  logoId: z.string().min(1),
  url: z.string().optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const items = await prisma.client.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const maxOrder = await prisma.client.aggregate({ _max: { order: true } });
  const item = await prisma.client.create({
    data: { ...parsed.data, order: (maxOrder._max.order ?? -1) + 1 },
  });
  return NextResponse.json(item, { status: 201 });
}
