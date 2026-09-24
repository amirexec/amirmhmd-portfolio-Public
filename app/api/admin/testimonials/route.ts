import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const Schema = z.object({
  clientName: z.string().min(1),
  company: z.string().optional(),
  photoId: z.string().optional().nullable(),
  quote: z.string().min(1),
  project: z.string().optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const maxOrder = await prisma.testimonial.aggregate({ _max: { order: true } });
  const item = await prisma.testimonial.create({
    data: { ...parsed.data, order: (maxOrder._max.order ?? -1) + 1 },
  });
  return NextResponse.json(item, { status: 201 });
}
