import { prisma } from "@/lib/prisma";
import ClientsManager from "@/components/admin/ClientsManager";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({ orderBy: { order: "asc" } });
  const mediaRows = await prisma.media.findMany({ where: { id: { in: clients.map((c) => c.logoId) } } });
  const mediaById = Object.fromEntries(mediaRows.map((m) => [m.id, m]));

  return (
    <div dir="rtl" className="font-vazir px-8 py-10">
      <h1 className="eng text-2xl mb-1">CLIENTS</h1>
      <p className="text-stone text-sm mb-8">برندهایی که به شما اعتماد کرده‌اند</p>
      <ClientsManager
        initialItems={clients.map((c) => ({ ...c, logoPreview: mediaById[c.logoId] ?? null }))}
      />
    </div>
  );
}
