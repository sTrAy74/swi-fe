"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./providers/AuthProvider";
import { useAuthModal } from "./providers/AuthModalProvider";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { openLogin, openRegister } = useAuthModal();
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  const headerBg = isHome && !isScrolled  ?  "bg-transparent" : "bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/60";





  return (
    <header className={`fixed top-0 z-50 w-full text-white transition-colors ${headerBg}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="h-8 w-8 rounded overflow-hidden shrink-0">
            <Image 
              src="/favicon.png" 
              alt="SolarWealthIndia Logo" 
              width={32}
              height={32}
              className="h-full w-full object-contain"
              unoptimized
            />
          </div>
          <span className="text-sm sm:text-base font-semibold tracking-wide">SolarWealthIndia</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm text-white/85">
          <a href="/services" className="hover:text-white whitespace-nowrap">Services</a>
          <a href="/#why-now" className="hover:text-white whitespace-nowrap">Why Now</a>
          <a href="/#support" className="hover:text-white whitespace-nowrap">Govt Support</a>
          <a href="/#faqs" className="hover:text-white whitespace-nowrap">FAQs</a>
          <a href="/#calculator" className="hover:text-white whitespace-nowrap">Calculator</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={profileRef}>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((v) => !v)}
            >
              <span className="sr-only">Open profile</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.971 0-9 2.239-9 5v3h18v-3c0-2.761-4.029-5-9-5z"/>
              </svg>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md bg-white text-slate-900 shadow-lg overflow-hidden z-50">
                {user ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm">
                      <div className="font-semibold">{user.email}</div>
                      <div className="text-xs text-slate-600 capitalize">Role: {user.role}</div>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100" onClick={() => { setProfileOpen(false); logout(); }}>Logout</button>
                  </div>
                ) : (
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100" onClick={() => { openLogin(); setProfileOpen(false); }}>Login</button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100" onClick={() => { openRegister(); setProfileOpen(false); }}>Register</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <a
            href="https://wa.me/+919910894406"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm h-10 px-3 sm:px-4 font-medium shadow-md"
          >
            Talk on WhatsApp
          </a>
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10 hover:bg-white/20"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              {menuOpen ? (
                <path fillRule="evenodd" d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.36-4.361a1 1 0 111.415 1.415L13.414 10.586l4.36 4.36a1 1 0 11-1.415 1.415L12 12l-4.36 4.361a1 1 0 11-1.415-1.415l4.361-4.36-4.361-4.36a1 1 0 010-1.415z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zM3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15A.75.75 0 013.75 12zm0 6.75a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="lg:hidden absolute top-16 left-0 right-0 border-t border-white/10 bg-black/85 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <nav className="grid gap-3 text-sm">
            <a href="/services" className="hover:text-white whitespace-nowrap">Services</a>
            <a href="/#why-now" className="hover:text-white whitespace-nowrap">Why Now</a>
            <a href="/#support" className="hover:text-white whitespace-nowrap">Govt Support</a>
          <a href="/#faqs" className="hover:text-white whitespace-nowrap">FAQs</a>
          <a href="/#calculator" className="hover:text-white whitespace-nowrap">Calculator</a>
              
              {!user && (
                <>
                  <button className="text-left block py-3 px-2 text-white hover:text-emerald-400 hover:bg-white/10 rounded transition-colors" onClick={() => { openLogin(); closeMenu(); }}>Login</button>
                  <button className="text-left block py-3 px-2 text-white hover:text-emerald-400 hover:bg-white/10 rounded transition-colors" onClick={() => { openRegister(); closeMenu(); }}>Register</button>
                </>
              )}
              {user && (
                <button className="text-left block py-3 px-2 text-white hover:text-emerald-400 hover:bg-white/10 rounded transition-colors" onClick={() => { logout(); closeMenu(); }}>Logout</button>
              )}
            </nav>
            <div className="mt-4 pt-4 border-t border-white/20">
              <a
                href="https://wa.me/+919910894406"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 px-6 font-semibold shadow-lg"
                onClick={closeMenu}
              >
                Talk on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


