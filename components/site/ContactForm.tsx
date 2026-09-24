"use client";
import { useState } from "react";

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  description: "",
  preferredContact: "",
};

const PROJECT_TYPES = ["تیزر تبلیغاتی", "فیلمبرداری", "تدوین", "محتوای شبکه‌های اجتماعی", "سایر"];
const CONTACT_METHODS = ["تماس تلفنی", "واتساپ", "ایمیل", "تلگرام"];

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function set<K extends keyof typeof EMPTY>(key: K, v: string) {
    setForm((prev) => ({ ...prev, [key]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-16">
        <p className="eng text-red text-sm mb-3">THANK YOU</p>
        <p className="text-xl">درخواست شما ثبت شد — به‌زودی باهات تماس می‌گیرم.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <input
          required
          placeholder="نام و نام‌خانوادگی *"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="bg-transparent border border-line rounded-sm px-4 py-3 outline-none focus:border-red transition-colors"
        />
        <input
          required
          placeholder="شماره تماس *"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="bg-transparent border border-line rounded-sm px-4 py-3 outline-none focus:border-red transition-colors"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <input
          type="email"
          placeholder="ایمیل (اختیاری)"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          className="bg-transparent border border-line rounded-sm px-4 py-3 outline-none focus:border-red transition-colors"
        />
        <input
          placeholder="برند / شرکت (اختیاری)"
          value={form.company}
          onChange={(e) => set("company", e.target.value)}
          className="bg-transparent border border-line rounded-sm px-4 py-3 outline-none focus:border-red transition-colors"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <select
          value={form.projectType}
          onChange={(e) => set("projectType", e.target.value)}
          className="bg-black border border-line rounded-sm px-4 py-3 outline-none focus:border-red transition-colors text-stone"
        >
          <option value="">نوع پروژه</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          placeholder="بودجه تخمینی (اختیاری)"
          value={form.budget}
          onChange={(e) => set("budget", e.target.value)}
          className="bg-transparent border border-line rounded-sm px-4 py-3 outline-none focus:border-red transition-colors"
        />
      </div>
      <textarea
        required
        rows={4}
        placeholder="درباره پروژه‌ات بگو *"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        className="w-full bg-transparent border border-line rounded-sm px-4 py-3 outline-none focus:border-red transition-colors resize-none mb-4"
      />
      <div className="mb-6">
        <p className="text-stone text-sm mb-2">روش ارتباطی ترجیحی</p>
        <div className="flex flex-wrap gap-2">
          {CONTACT_METHODS.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => set("preferredContact", m)}
              className={`px-3.5 py-2 rounded-sm text-sm border transition-colors ${
                form.preferredContact === m ? "border-red text-red" : "border-line text-stone hover:text-ivory"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {status === "error" && (
        <p className="text-red text-sm mb-4">ارسال ناموفق بود، لطفاً دوباره تلاش کن.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-4 rounded-sm bg-red text-ivory hover:bg-[#8c121c] hover:shadow-[0_0_26px_rgba(163,22,33,0.35)] transition-all disabled:opacity-50"
      >
        {status === "sending" ? "در حال ارسال..." : "ارسال درخواست"}
      </button>
    </form>
  );
}
