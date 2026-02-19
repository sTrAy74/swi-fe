"use client";

import { useEffect } from "react";
import { useAuthModal } from "./providers/AuthModalProvider";
import LoginForm from "./auth/LoginForm";
import RegisterCustomerForm from "./auth/RegisterCustomerForm";

export default function AuthModal() {
  const { modalType, closeModal } = useAuthModal();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    if (modalType) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalType, closeModal]);

  if (!modalType) return null;

  const title = modalType === "login" ? "Login" : "Register as Customer";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={closeModal}
      />
      
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h3>
          <button 
            onClick={closeModal} 
            className="rounded-full p-1.5 hover:bg-slate-100 transition-colors" 
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-500">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {modalType === "login" ? (
            <LoginForm onSuccess={closeModal} />
          ) : (
            <RegisterCustomerForm onSuccess={closeModal} />
          )}
        </div>
      </div>
    </div>
  );
}
