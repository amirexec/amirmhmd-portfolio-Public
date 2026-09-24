import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const projects = await prisma.project
    .findMany({ where: { published: true }, select: { id: true, updatedAt: true } })
    .catch(() => []);

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
