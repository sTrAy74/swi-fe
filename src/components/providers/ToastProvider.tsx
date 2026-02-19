"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  timeoutMs?: number;
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant, options?: { title?: string; timeoutMs?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, variant: ToastVariant = "info", options?: { title?: string; timeoutMs?: number }) => {
    const id = Math.random().toString(36).slice(2);
    const timeoutMs = options?.timeoutMs ?? 3000;
    const item: ToastItem = { id, message, variant, title: options?.title, timeoutMs };
    setToasts((prev) => [...prev, item]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, timeoutMs);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-2 sm:right-4 z-[100] space-y-2 w-[90vw] sm:w-80">
        {toasts.map((t) => (
          <div key={t.id} className={getToastClass(t.variant)}>
            {t.title && <div className="font-semibold mb-0.5">{t.title}</div>}
            <div className="text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function getToastClass(variant: ToastVariant) {
  const base = "rounded-md shadow-lg px-4 py-3 text-white";
  switch (variant) {
    case "success":
      return `${base} bg-emerald-600`;
    case "error":
      return `${base} bg-red-600`;
    case "warning":
      return `${base} bg-amber-600`;
    case "info":
    default:
      return `${base} bg-slate-800`;
  }
}


