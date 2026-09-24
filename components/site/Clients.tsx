type MediaItem = { url: string };
type ClientItem = { id: string; name: string; url: string | null; logo: MediaItem | null };

export default function Clients({ clients }: { clients: ClientItem[] }) {
  if (!clients.length) return null;

  return (
    <section className="px-6 md:px-14 py-24 border-t border-line">
      <p className="text-center text-stone text-sm mb-10">برندهایی که به من اعتماد کرده‌اند</p>
      <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
        {clients.map((c) => {
          const content = c.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.logo.url}
              alt={c.name}
              className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
          ) : (
            <span className="eng text-stone text-sm">{c.name}</span>
          );
          return c.url ? (
            <a key={c.id} href={c.url} target="_blank" rel="noreferrer">
              {content}
            </a>
          ) : (
            <span key={c.id}>{content}</span>
          );
        })}
      </div>
    </section>
  );
}
