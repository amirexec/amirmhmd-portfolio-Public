"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) setError("ایمیل یا رمز عبور نادرست است.");
    else router.push("/admin");
  }

  return (
    <div dir="rtl" className="min-h-screen bg-black text-ivory flex items-center justify-center px-6 font-vazir">
      <form onSubmit={onSubmit} className="w-full max-w-sm border border-line rounded-sm p-8">
        <h1 className="eng text-2xl mb-1">ADMIN</h1>
        <p className="text-stone text-sm mb-6">ورود به پنل مدیریت</p>
        <label className="block text-sm mb-1.5">ایمیل یا نام کاربری</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 mb-4 outline-none focus:border-red"
          required
        />
        <label className="block text-sm mb-1.5">رمز عبور</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border border-line rounded-sm px-3 py-2.5 mb-6 outline-none focus:border-red"
          required
        />
        {error && <p className="text-red text-sm mb-4">{error}</p>}
        <button className="w-full bg-red rounded-sm py-2.5 hover:bg-[#8c121c] transition-colors">
          ورود
        </button>
      </form>
    </div>
  );
}
