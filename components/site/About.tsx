export default function About({
  heading,
  body,
  portraitUrl,
}: {
  heading: string;
  body: string;
  portraitUrl?: string | null;
}) {
  return (
    <section id="about" className="px-6 md:px-14 py-28 grid md:grid-cols-[0.9fr_1.1fr] gap-16 items-center">
      <div
        className="relative aspect-[3/4] rounded-sm border border-line overflow-hidden"
        style={{
          background: portraitUrl
            ? `url(${portraitUrl}) center/cover`
            : "linear-gradient(160deg,#1b1613,#241c19 60%,#100d0c)",
        }}
      >
        {!portraitUrl && (
          <span className="absolute bottom-4 right-4 text-xs text-stone border border-dashed border-line px-2.5 py-1.5 rounded-sm">
            قابل جایگزینی از پنل مدیریت
          </span>
        )}
      </div>
      <div>
        <p className="eng text-red text-sm">01 — ABOUT</p>
        <div className="w-14 h-px bg-red my-5" />
        <h2 className="text-[clamp(1.9rem,4vw,2.8rem)] font-bold mb-6">{heading}</h2>
        <p className="text-[#cfc8bd] leading-loose font-light max-w-[56ch] whitespace-pre-line">
          {body}
        </p>
        <div className="flex gap-10 mt-9 flex-wrap">
          <div>
            <b className="eng text-3xl block">120+</b>
            <span className="text-stone text-sm">پروژه تحویل‌شده</span>
          </div>
          <div>
            <b className="eng text-3xl block">40M+</b>
            <span className="text-stone text-sm">بازدید تولیدشده برای برندها</span>
          </div>
          <div>
            <b className="eng text-3xl block">8</b>
            <span className="text-stone text-sm">سال تجربه</span>
          </div>
        </div>
      </div>
    </section>
  );
}
