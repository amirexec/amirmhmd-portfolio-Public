import { prisma } from "@/lib/prisma";
import IntroAnimation from "@/components/site/IntroAnimation";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Showreel from "@/components/site/Showreel";
import PortfolioGrid from "@/components/site/PortfolioGrid";
import Services from "@/components/site/Services";
import BehindTheScenes from "@/components/site/BehindTheScenes";
import Clients from "@/components/site/Clients";
import Testimonials from "@/components/site/Testimonials";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

// Defaults mirror the design preview so the site looks right before
// any admin content has been entered.
const defaults = {
  heroTagline: "«تصویر فقط دیده نمی‌شود؛ باید احساس شود.»",
  heroRoleLine: "FILMMAKER · VIDEO EDITOR · CREATIVE DIRECTOR",
  aboutHeading: "داستان من",
  aboutBody:
    "از پشت دوربین شروع کردم، اما چیزی که همیشه دنبالش بودم قاب نبود؛ احساس بود. سال‌هاست برای برندها و آدم‌هایی کار می‌کنم که یک تصویر ساده برایشان کافی نیست.",
  showreelTitle: "Showreel 2026",
  showreelDesc: "مجموعه‌ای فشرده از پروژه‌های اخیر — تبلیغات، تیزر و محتوای برند.",
};

export default async function HomePage() {
  const [content, projects, services, clients, testimonials, btsItems, settings, socialLinks] = await Promise.all([
    prisma.homepageContent.findUnique({ where: { id: "singleton" } }).catch(() => null),
    prisma.project
      .findMany({ where: { published: true }, orderBy: { order: "asc" }, take: 6, include: { category: true } })
      .catch(() => []),
    prisma.service.findMany({ where: { enabled: true }, orderBy: { order: "asc" } }).catch(() => []),
    prisma.client.findMany({ orderBy: { order: "asc" } }).catch(() => []),
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }).catch(() => []),
    prisma.bTSItem.findMany({ orderBy: { order: "asc" } }).catch(() => []),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }).catch(() => null),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }).catch(() => []),
  ]);

  // Resolve every media reference (clients/testimonials/services/BTS AND the
  // homepage content's hero/about/showreel images) in one batch query.
  const mediaIds = [
    ...clients.map((c) => c.logoId),
    ...testimonials.map((t) => t.photoId).filter((id): id is string => !!id),
    ...services.map((s) => s.mediaId).filter((id): id is string => !!id),
    ...btsItems.map((b) => b.mediaId),
    ...projects.map((p) => p.coverId).filter((id): id is string => !!id),
    content?.heroPortraitId,
    content?.aboutPortraitId,
    content?.showreelThumbId,
  ].filter((id): id is string => !!id);
  const mediaRows = mediaIds.length
    ? await prisma.media.findMany({ where: { id: { in: mediaIds } } }).catch(() => [])
    : [];
  const mediaById = new Map(mediaRows.map((m) => [m.id, m]));

  const data = { ...defaults, ...(content ?? {}) };

  return (
    <>
      <div className="grain" />
      <IntroAnimation />
      <Header />
      <Hero
        tagline={data.heroTagline}
        roleLine={data.heroRoleLine}
        portraitUrl={content?.heroPortraitId ? mediaById.get(content.heroPortraitId)?.url : null}
      />
      <About
        heading={data.aboutHeading}
        body={data.aboutBody}
        portraitUrl={content?.aboutPortraitId ? mediaById.get(content.aboutPortraitId)?.url : null}
      />
      <Showreel
        title={data.showreelTitle}
        description={data.showreelDesc}
        videoUrl={content?.showreelUrl ?? null}
        thumbnailUrl={content?.showreelThumbId ? mediaById.get(content.showreelThumbId)?.url : null}
      />
      <PortfolioGrid
        projects={projects.map((p) => ({ ...p, coverUrl: p.coverId ? mediaById.get(p.coverId)?.url : null }))}
      />
      <Services services={services} />
      <BehindTheScenes
        items={btsItems.map((b) => ({ ...b, media: mediaById.get(b.mediaId) ?? null }))}
      />
      <Clients
        clients={clients.map((c) => ({ ...c, logo: mediaById.get(c.logoId) ?? null }))}
      />
      <Testimonials
        testimonials={testimonials.map((t) => ({
          ...t,
          photo: t.photoId ? mediaById.get(t.photoId) ?? null : null,
        }))}
      />
      <Contact />
      <Footer
        instagramUrl={settings?.instagramUrl}
        whatsappUrl={settings?.whatsappUrl}
        telegramUrl={settings?.telegramUrl}
        email={settings?.email}
        phone={settings?.phone}
        socialLinks={socialLinks}
      />
    </>
  );
}
