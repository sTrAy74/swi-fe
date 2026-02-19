"use client";

import Link from "next/link";
import { useAuthModal } from "../providers/AuthModalProvider";

export default function ProviderCTA() {
  const { openLogin } = useAuthModal();
  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-black">Are you a service provider?</h3>
        <p className="text-black/70 mt-1">Join the platform to showcase your expertise and get matched with customers.</p>
      </div>
      <div className="flex gap-2">
        <button onClick={openLogin} className="rounded-full border border-black/10 hover:bg-black/5 px-4 py-2 text-black">Login</button>
        <Link href="/services/register" className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-white inline-flex items-center justify-center">Register</Link>
      </div>
    </div>
  );
}


