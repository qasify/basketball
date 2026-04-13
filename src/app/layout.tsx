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

import ProtectedRoute from "@/components/ProtectedRoute";
import { QueryProvider } from "@/components/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${poppins.className} ${inter.className} antialiased ${isAuthPage ? '' : 'flex'}`}
      >
        {isAuthPage ? (
          <div className="flex flex-col h-[100vh] overflow-auto w-full">
            {children}
          </div>
        ) : (
          <QueryProvider>
            <div className="flex w-full h-[100vh]">
              <Sidebar />
              <div className="flex flex-col h-full overflow-auto flex-1">
                <Header />
                <ProtectedRoute>
                  {children}
                </ProtectedRoute>
              </div>
            </div>
          </QueryProvider>
        )}
      </body>
    </html>
  );
}