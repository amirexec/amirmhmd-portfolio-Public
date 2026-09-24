import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const Schema = z.object({
  title: z.string().min(1),
  clientName: z.string().optional(),
  projectId: z.string().optional().nullable(),
  pdfMediaId: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "SENT", "SIGNED", "ARCHIVED"]).optional(),
  notes: z.string().optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const items = await prisma.contract.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const item = await prisma.contract.create({ data: parsed.data });
  return NextResponse.json(item, { status: 201 });
}
