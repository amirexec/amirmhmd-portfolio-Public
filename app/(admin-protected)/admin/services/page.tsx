import { prisma } from "@/lib/prisma";
import ServicesManager from "@/components/admin/ServicesManager";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  const mediaIds = services.map((s) => s.mediaId).filter((id): id is string => !!id);
  const mediaRows = await prisma.media.findMany({ where: { id: { in: mediaIds } } });
  const mediaById = Object.fromEntries(mediaRows.map((m) => [m.id, m]));

  return (
    <div dir="rtl" className="font-vazir px-8 py-10">
      <h1 className="eng text-2xl mb-1">SERVICES</h1>
      <p className="text-stone text-sm mb-8">مدیریت خدمات نمایش داده‌شده در سایت</p>
      <ServicesManager
        initialItems={services.map((s) => ({
          ...s,
          mediaPreview: s.mediaId ? mediaById[s.mediaId] ?? null : null,
        }))}
      />
    </div>
  );
}
