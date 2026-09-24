import { prisma } from "@/lib/prisma";
import SocialLinksManager from "@/components/admin/SocialLinksManager";

export default async function SocialLinksPage() {
  const items = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return (
    <div dir="rtl" className="font-vazir px-8 py-10">
      <h1 className="eng text-2xl mb-1">SOCIAL LINKS</h1>
      <p className="text-stone text-sm mb-8">
        شبکه‌های اجتماعی اضافی (اینستاگرام/واتساپ/تلگرام/ایمیل/تلفن از تنظیمات سایت مدیریت می‌شوند)
      </p>
      <SocialLinksManager initialItems={items} />
    </div>
  );
}
