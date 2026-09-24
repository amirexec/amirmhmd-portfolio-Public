"use client";
import { useEffect, useState } from "react";

// One short, orchestrated reveal on first load — AMIRMHMD / BAGHERI / cut to
// the homepage. Respects prefers-reduced-motion by skipping straight through.
export default function IntroAnimation() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setHide(true);
      return;
    }
    const t = setTimeout(() => setHide(true), 1650);
    return () => clearTimeout(t);
  }, []);

  if (hide) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-void flex items-center justify-center flex-col transition-opacity duration-700"
      aria-hidden="true"
    >
      <div className="eng text-[clamp(2.6rem,10vw,6rem)] tracking-[0.12em] text-ivory animate-[introWord_1.1s_ease_forwards]">
        AMIRMHMD
      </div>
      <div className="eng text-[clamp(2.6rem,10vw,6rem)] tracking-[0.12em] text-red -mt-2 animate-[introWord_1.1s_ease_forwards_0.65s]">
        BAGHERI
      </div>
      <div className="w-0 h-px bg-red mt-6 animate-[introRule_0.5s_ease_forwards_1.3s]" />
      <style jsx>{`
        @keyframes introWord {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes introRule {
          to { width: 64px; }
        }
      `}</style>
    </div>
  );
}
