"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthModalType = "login" | "register" | null;

interface AuthModalContextValue {
  modalType: AuthModalType;
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined);

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<AuthModalType>(null);

  const openLogin = () => setModalType("login");
  const openRegister = () => setModalType("register");
  const closeModal = () => setModalType(null);

  return (
    <AuthModalContext.Provider value={{ modalType, openLogin, openRegister, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}
