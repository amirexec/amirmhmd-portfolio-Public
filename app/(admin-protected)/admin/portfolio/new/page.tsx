import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="px-8 py-10">
      <div dir="rtl" className="font-vazir mb-8">
        <h1 className="eng text-2xl mb-1">NEW PROJECT</h1>
        <p className="text-stone text-sm">افزودن پروژه جدید به نمونه‌کارها</p>
      </div>
      <ProjectForm categories={categories} />
    </div>
  );
}
