import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import AuthModal from "../components/AuthModal";
import { ToastProvider } from "../components/providers/ToastProvider";
import { AuthProvider } from "../components/providers/AuthProvider";
import { AuthModalProvider } from "../components/providers/AuthModalProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SolarWealthIndia",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  description:
    "Turn your roof into a wealth generator. Get ₹1.08 lakh subsidy with PM Suryaghar Yojana, save ~₹2,400/month, and grow long-term wealth. Join our expert webinar.",
  openGraph: {
    title: "SolarWealthIndia - Rooftop Solar with Subsidy",
    description:
      "Get ₹1.08 lakh subsidy, cut bills, and grow wealth from your rooftop.",
    type: "website",
    url: "https://solarwealthindia.com",
    
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <AuthProvider>
            <AuthModalProvider>
              <Header />
              {children}
              <FloatingWhatsApp />
              <AuthModal />
            </AuthModalProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
