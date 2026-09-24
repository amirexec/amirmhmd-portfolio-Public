import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const InquirySchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  description: z.string().min(10),
  preferredContact: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = InquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "اطلاعات ارسال‌شده نامعتبر است.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const inquiry = await prisma.inquiry.create({ data: parsed.data });
  return NextResponse.json({ id: inquiry.id }, { status: 201 });
}
