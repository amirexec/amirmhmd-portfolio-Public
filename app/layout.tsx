import type { Metadata } from "next";
import { Vazirmatn, Bebas_Neue } from "next/font/google";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-vazir",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings
    .findUnique({ where: { id: "singleton" } })
    .catch(() => null);

  const ogImage = settings?.socialPreviewId
    ? await prisma.media.findUnique({ where: { id: settings.socialPreviewId } }).catch(() => null)
    : null;
  const faviconUrl = settings?.faviconMediaId
    ? (await prisma.media.findUnique({ where: { id: settings.faviconMediaId } }).catch(() => null))?.url
    : undefined;

  return {
    title: settings?.seoTitle ?? "امیرمحمد باقری — فیلمساز و کارگردان خلاق",
    description: settings?.seoDescription ?? "فیلمساز، تدوین‌گر و کارگردان خلاق",
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
    openGraph: {
      title: settings?.seoTitle ?? "امیرمحمد باقری",
      description: settings?.seoDescription ?? undefined,
      images: ogImage ? [ogImage.url] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${bebas.variable}`}>
      <body className="bg-black text-ivory font-vazir antialiased">
        {children}
      </body>
    </html>
  );
}
