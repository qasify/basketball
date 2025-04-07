import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Basketball Manager",
  description: "Basketball manager application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} ${inter.className} antialiased flex`}
      >
        <Sidebar />
        <div className="flex flex-col h-[100vh] overflow-auto flex-1">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
