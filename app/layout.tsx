import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "shopblox | shopify... but for roblox",
  description: "browse and buy from roblox groups all in one place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="bg-black text-zinc-500 lowercase h-screen"
        style={{ "--header-height": "88px" } as React.CSSProperties}
      >
        <Navigation />
        <div className="min-w-screen flex items-center justify-center">
          <main className="min-w-screen flex flex-col items-center">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
