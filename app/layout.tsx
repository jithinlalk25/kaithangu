import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kaithangu — a hand to hold, right now",
  description:
    "A zero-typing, multi-modal recovery companion for people navigating substance use disorders and the families who care for them. Built for the minute when cognitive load is highest.",
  applicationName: "Kaithangu",
  keywords: [
    "recovery",
    "substance use disorder",
    "de-addiction",
    "caregiver support",
    "Kerala",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0f4f4a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-full">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
