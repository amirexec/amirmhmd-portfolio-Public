import type { ReactNode } from "react";
import Link from "next/link";
import SignOutButton from "@/components/admin/SignOutButton";

const NAV_BUILT = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/homepage", label: "صفحه اصلی / درباره من / Showreel" },
  { href: "/admin/portfolio", label: "نمونه‌کارها" },
  { href: "/admin/services", label: "خدمات" },
  { href: "/admin/clients", label: "برندها" },
  { href: "/admin/testimonials", label: "نظرات مشتریان" },
  { href: "/admin/inquiries", label: "درخواست‌ها" },
  { href: "/admin/bts", label: "پشت صحنه" },
  { href: "/admin/contracts", label: "قراردادها" },
  { href: "/admin/social-links", label: "شبکه‌های اجتماعی" },
  { href: "/admin/settings", label: "تنظیمات سایت" },
];

// Listed per the brief's full admin nav (§14) — anything beyond the ones
// above is an upcoming build slice.
const NAV_UPCOMING: string[] = [];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-black text-ivory font-vazir flex">
      <aside className="w-64 shrink-0 border-l border-line p-6 hidden md:flex md:flex-col">
        <Link href="/admin" className="eng text-lg mb-8">
          AMIR<span className="text-red font-normal">MHMD</span>
        </Link>
        <nav className="flex flex-col gap-1 text-sm">
          {NAV_BUILT.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-sm text-ivory hover:bg-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {NAV_UPCOMING.length > 0 && <div className="h-px bg-line my-3" />}
          {NAV_UPCOMING.map((label) => (
            <span
              key={label}
              className="px-3 py-2 rounded-sm text-stone/50 cursor-not-allowed flex items-center justify-between"
              title="در اسلایس بعدی ساخته می‌شود"
            >
              {label}
              <span className="text-[10px] border border-line rounded-sm px-1.5 py-0.5">
                به‌زودی
              </span>
            </span>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
