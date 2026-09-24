import { prisma } from "@/lib/prisma";
import BTSManager from "@/components/admin/BTSManager";

export default async function BTSPage() {
  const items = await prisma.bTSItem.findMany({ orderBy: { order: "asc" } });
  const mediaRows = await prisma.media.findMany({ where: { id: { in: items.map((i) => i.mediaId) } } });
  const mediaById = Object.fromEntries(mediaRows.map((m) => [m.id, m]));

  return (
    <div dir="rtl" className="font-vazir px-8 py-10">
      <h1 className="eng text-2xl mb-1">BEHIND THE SCENES</h1>
      <p className="text-stone text-sm mb-8">گالری پشت صحنه — فیلمبرداری، کارگردانی، تدوین</p>
      <BTSManager initialItems={items.map((i) => ({ ...i, media: mediaById[i.mediaId] ?? null }))} />
    </div>
  );
}
