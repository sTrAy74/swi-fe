"use client";

import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode; }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-start sm:items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden text-slate-900 max-h-[85vh] sm:max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <button onClick={onClose} className="rounded p-1 hover:bg-slate-100" aria-label="Close">
              ✕
            </button>
          </div>
          <div className="p-4 sm:p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}


