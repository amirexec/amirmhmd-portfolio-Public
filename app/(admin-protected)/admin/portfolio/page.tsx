import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PortfolioTable from "@/components/admin/PortfolioTable";

export default async function PortfolioListPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { category: true },
  });

  return (
    <div dir="rtl" className="font-vazir px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="eng text-2xl mb-1">PORTFOLIO</h1>
          <p className="text-stone text-sm">مدیریت پروژه‌های نمونه‌کار</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="px-5 py-2.5 rounded-sm bg-red text-ivory text-sm hover:bg-[#8c121c] transition-colors"
        >
          + پروژه جدید
        </Link>
      </div>

      <PortfolioTable projects={projects} />
    </div>
  );
}
