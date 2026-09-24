export default function Hero({
  tagline,
  roleLine,
  portraitUrl,
}: {
  tagline: string;
  roleLine: string;
  portraitUrl?: string | null;
}) {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-end px-6 md:px-14 pt-32 pb-24 overflow-hidden"
    >
      <div
        className="absolute inset-y-0 left-0 right-auto w-[58%] max-w-[900px]"
        style={{
          background: portraitUrl
            ? `linear-gradient(180deg, rgba(12,10,9,0) 0%, rgba(12,10,9,0.55) 68%, #0c0a09 100%), url(${portraitUrl}) center/cover`
            : "radial-gradient(ellipse at 30% 20%, rgba(163,22,33,0.16), transparent 55%), linear-gradient(180deg, rgba(12,10,9,0) 0%, rgba(12,10,9,0.55) 68%, #0c0a09 100%), linear-gradient(100deg, #1b1613 0%, #241c19 38%, #171210 100%)",
          maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)",
        }}
        role="img"
        aria-label="پرتره امیرمحمد باقری"
      >
        {!portraitUrl && (
          <span className="absolute bottom-6 left-6 text-xs text-stone border border-dashed border-line px-3 py-1.5 rounded-sm">
            پرتره جایگزین — از پنل مدیریت قابل تغییر
          </span>
        )}
      </div>

      <div className="relative z-10 max-w-xl">
        <p className="eng text-red text-sm mb-4">{roleLine}</p>
        <h1 className="eng text-right text-[clamp(3.4rem,9vw,7.2rem)] leading-[0.92]">
          <span className="block">امیرمحمد</span>
          <span className="block text-red">باقری</span>
        </h1>
        <p className="mt-6 text-[clamp(1.1rem,2.4vw,1.4rem)] font-light max-w-[30ch] leading-relaxed">
          {tagline}
        </p>
        <p className="mt-3 text-stone text-sm">
          کارگردانی خلاق، فیلمبرداری و تدوین برای برندهایی که می‌خواهند دیده شوند.
        </p>
        <div className="flex gap-4 mt-10 flex-wrap">
          <a
            href="#work"
            className="px-7 py-3.5 rounded-sm bg-red border border-red text-ivory text-sm hover:bg-[#8c121c] hover:shadow-[0_0_26px_rgba(163,22,33,0.35)] transition-all"
          >
            مشاهده نمونه‌کارها
          </a>
          <a
            href="#contact"
            className="px-7 py-3.5 rounded-sm border border-line text-ivory text-sm hover:border-ivory transition-all"
          >
            شروع همکاری
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-11 bg-gradient-to-b from-stone to-transparent" />
    </section>
  );
}
