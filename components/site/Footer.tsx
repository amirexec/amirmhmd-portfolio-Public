type SocialLinkItem = { id: string; platform: string; url: string };

export default function Footer({
  instagramUrl,
  whatsappUrl,
  telegramUrl,
  email,
  phone,
  socialLinks = [],
}: {
  instagramUrl?: string | null;
  whatsappUrl?: string | null;
  telegramUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  socialLinks?: SocialLinkItem[];
}) {
  const links = [
    instagramUrl && { label: "Instagram", href: instagramUrl },
    whatsappUrl && { label: "WhatsApp", href: whatsappUrl },
    telegramUrl && { label: "Telegram", href: telegramUrl },
    ...socialLinks.map((s) => ({ label: s.platform, href: s.url })),
  ].filter((l): l is { label: string; href: string } => !!l);

  return (
    <footer
      className="px-6 md:px-14 pt-14 text-center text-stone text-sm border-t border-line"
      style={{ paddingBottom: "calc(2.4rem + var(--safe-b))" }}
    >
      <span className="eng block text-ivory text-lg mb-1.5">AMIRMHMD BAGHERI</span>
      <p className="mb-6">فیلمساز · تدوین‌گر · کارگردان خلاق</p>

      {(links.length > 0 || email || phone) && (
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6 eng" dir="ltr">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="hover:text-ivory transition-colors">
              {l.label}
            </a>
          ))}
          {email && (
            <a href={`mailto:${email}`} className="hover:text-ivory transition-colors">
              {email}
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="hover:text-ivory transition-colors">
              {phone}
            </a>
          )}
        </div>
      )}

      <p className="text-xs">© {new Date().getFullYear()} Amirmhmd Bagheri</p>
    </footer>
  );
}
