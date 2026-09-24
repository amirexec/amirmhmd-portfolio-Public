import { prisma } from "@/lib/prisma";
import InquiriesManager from "@/components/admin/InquiriesManager";

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div dir="rtl" className="font-vazir px-8 py-10">
      <h1 className="eng text-2xl mb-1">INQUIRIES</h1>
      <p className="text-stone text-sm mb-8">درخواست‌های همکاری دریافت‌شده از سایت</p>
      <InquiriesManager initialItems={inquiries} />
    </div>
  );
}
