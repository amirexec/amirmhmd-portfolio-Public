import { prisma } from "@/lib/prisma";
import ContractsManager from "@/components/admin/ContractsManager";

export default async function ContractsPage() {
  const [contracts, projects] = await Promise.all([
    prisma.contract.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.project.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
  ]);

  return (
    <div dir="rtl" className="font-vazir px-8 py-10">
      <h1 className="eng text-2xl mb-1">CONTRACTS</h1>
      <p className="text-stone text-sm mb-8">قراردادها و وضعیت آن‌ها</p>
      <ContractsManager initialItems={contracts} projects={projects} />
    </div>
  );
}
