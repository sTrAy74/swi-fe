"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken, getToken } from "../../lib/auth/token";
import type { LoginResponseUser } from "../../types/auth";

type AuthState = {
  user: LoginResponseUser | null;
  token: string | null;
};

interface AuthContextValue extends AuthState {
  setAuth: (auth: AuthState) => void;
  logout: () => void;
}

const STORAGE_USER_KEY = "swi_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponseUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const t = getToken();
      setTokenState(t);
      const raw = typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_USER_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {
    }
  }, []);

  const setAuth = useCallback((auth: AuthState) => {
    setTokenState(auth.token);
    setUser(auth.user);
    try {
      if (auth.user) {
        window.sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(auth.user));
      } else {
        window.sessionStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch {
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAuth({ token: null, user: null });
    router.push("/");
  }, [setAuth, router]);

  const value = useMemo(() => ({ user, token, setAuth, logout }), [user, token, setAuth, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


