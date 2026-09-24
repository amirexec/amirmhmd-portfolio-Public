import { prisma } from "@/lib/prisma";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  const photoIds = testimonials.map((t) => t.photoId).filter((id): id is string => !!id);
  const mediaRows = await prisma.media.findMany({ where: { id: { in: photoIds } } });
  const mediaById = Object.fromEntries(mediaRows.map((m) => [m.id, m]));

  return (
    <div dir="rtl" className="font-vazir px-8 py-10">
      <h1 className="eng text-2xl mb-1">TESTIMONIALS</h1>
      <p className="text-stone text-sm mb-8">نظرات مشتریان</p>
      <TestimonialsManager
        initialItems={testimonials.map((t) => ({
          ...t,
          photoPreview: t.photoId ? mediaById[t.photoId] ?? null : null,
        }))}
      />
    </div>
  );
}
