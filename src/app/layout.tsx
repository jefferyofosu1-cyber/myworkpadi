import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskGH – Professional Home Services in Ghana",
  description:
    "Book trusted, vetted professionals for cleaning, plumbing, electrical, and more. Ghana's #1 task marketplace.",
  keywords: ["home services", "Ghana", "tasker", "cleaning", "plumbing", "booking"],
  openGraph: {
    title: "TaskGH – Professional Home Services in Ghana",
    description: "Book trusted professionals for any home task.",
    type: "website",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-white text-slate-900">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
