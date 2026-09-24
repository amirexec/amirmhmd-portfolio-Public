import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// This is the dashboard shell (§16). The full CRUD screens for Portfolio,
// Services, Clients, Testimonials, Inquiries, Contracts, Media, and Settings
// are the next build slice — this establishes the protected layout and
// real counts pulled from the DB.
export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const [projects, published, inquiries, clients] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.client.count(),
  ]);

  const stats = [
    { label: "کل پروژه‌ها", value: projects },
    { label: "پروژه‌های منتشرشده", value: published },
    { label: "درخواست‌های جدید", value: inquiries },
    { label: "برندها", value: clients },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-black text-ivory font-vazir px-8 py-10">
      <h1 className="eng text-2xl mb-1">DASHBOARD</h1>
      <p className="text-stone text-sm mb-10">
        خوش آمدید{session?.user?.name ? `، ${session.user.name}` : ""}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-line rounded-sm p-5">
            <b className="eng text-3xl block">{s.value}</b>
            <span className="text-stone text-sm">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
