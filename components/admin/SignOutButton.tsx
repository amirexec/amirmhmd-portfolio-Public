"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="w-full text-right text-sm text-stone hover:text-red transition-colors px-3 py-2"
    >
      خروج
    </button>
  );
}
