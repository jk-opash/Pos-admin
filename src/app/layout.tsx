import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import StoreProvider from "@/components/providers/StoreProvider";

export const metadata: Metadata = {
  title: "POS Platform Admin",
  description: "Universal Business Management Platform",
};

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased bg-brand-bg text-brand-dark`}
        suppressHydrationWarning
      >
        <StoreProvider>{children}</StoreProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
