"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "#hero", label: "خانه" },
  { href: "#about", label: "درباره من" },
  { href: "#work", label: "نمونه‌کارها" },
  { href: "#services", label: "خدمات" },
  { href: "#contact", label: "تماس" },
];

export default function Header() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-[var(--safe-t)] left-0 right-0 z-40 flex items-center justify-between transition-all duration-300 px-6 md:px-14 ${
        compact
          ? "bg-black/85 backdrop-blur-md py-3 border-b border-line"
          : "py-6 border-b border-transparent"
      }`}
    >
      <Link href="/" className="eng text-lg text-ivory">
        AMIR<span className="text-red font-normal">MHMD</span>
      </Link>
      <nav className="hidden md:flex gap-8">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-stone hover:text-ivory text-sm transition-colors relative group"
          >
            {l.label}
            <span className="absolute -bottom-1 right-0 h-px w-0 bg-red group-hover:w-full transition-all" />
          </a>
        ))}
      </nav>
      <button
        aria-label="منو"
        className="md:hidden w-10 h-10 border border-line rounded-sm text-ivory"
      >
        ☰
      </button>
    </header>
  );
}
