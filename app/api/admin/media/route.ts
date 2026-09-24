import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/storage";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(media);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const altText = (formData.get("altText") as string) || null;

  if (!file) {
    return NextResponse.json({ error: "فایلی ارسال نشده است." }, { status: 400 });
  }

  const MAX_BYTES = 100 * 1024 * 1024; // 100MB
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "حجم فایل بیش از حد مجاز است." }, { status: 400 });
  }

  const contentType = file.type || "application/octet-stream";
  const type = contentType.startsWith("image/")
    ? "IMAGE"
    : contentType.startsWith("video/")
    ? "VIDEO"
    : contentType === "application/pdf"
    ? "PDF"
    : null;

  if (!type) {
    return NextResponse.json({ error: "نوع فایل پشتیبانی نمی‌شود." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { key, url } = await uploadFile(buffer, file.name, contentType);

  const media = await prisma.media.create({
    data: { type, key, url, altText },
  });

  return NextResponse.json(media, { status: 201 });
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await req.json();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ error: "یافت نشد." }, { status: 404 });

  await deleteFile(media.key).catch(() => {});
  await prisma.media.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
