import "./globals.css";

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter as FontSans } from "next/font/google";

import { cn } from "../lib/utils";

import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/menu/navbar";
import { ActionList } from "@/components/menu/action-list";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-between pt-4">
          {children}
        </main>
        <Toaster />
        <ActionList />
        <Analytics />
      </body>
    </html>
  );
}
