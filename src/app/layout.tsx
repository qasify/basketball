'use client';

import { Poppins, Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  adjustFontFallback: false,
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  adjustFontFallback: false,
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en">
      <body
        className={`${poppins.className} ${inter.className} antialiased ${isAuthPage ? '' : 'flex'}`}
      >
        {!isAuthPage && <Sidebar />}
        <div className={`flex flex-col h-[100vh] overflow-auto ${isAuthPage ? 'w-full' : 'flex-1'}`}>
          {!isAuthPage && <Header />}
          {children}
        </div>
      </body>
    </html>
  );
}
