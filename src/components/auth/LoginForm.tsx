"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/api/auth";
import type { LoginPayload, LoginResponse } from "../../types/auth";
import { useToast } from "../providers/ToastProvider";
import { useAuth } from "../providers/AuthProvider";
import { getApiErrorMessage } from "../../lib/api/errors";

export default function LoginForm({ onSuccess }: { onSuccess?: (res: LoginResponse) => void }) {
  const router = useRouter();
  const toast = useToast();
  const { setAuth } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!identifier || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const payload: LoginPayload = { identifier, password };
      const res = await login(payload);
      setAuth({ token: res.jwt, user: res.user });
      toast.show("Login successful", "success");
      onSuccess?.(res);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Login failed");
      setError(message);
      toast.show(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-slate-900">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-500"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-500"
          placeholder="••••••"
          required
        />
      </div>
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-emerald-600 text-white py-2 sm:py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}


