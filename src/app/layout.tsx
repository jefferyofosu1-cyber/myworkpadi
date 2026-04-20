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
  metadataBase: new URL("https://www.taskgh.com"),
  title: "TaskGH – Professional Home Services in Ghana",
  description:
    "Book trusted, vetted professionals for cleaning, plumbing, electrical, and more. Ghana's #1 task marketplace.",
  keywords: ["home services", "Ghana", "tasker", "cleaning", "plumbing", "booking"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TaskGH – Professional Home Services in Ghana",
    description: "Book trusted professionals for any home task.",
    url: "https://www.taskgh.com",
    siteName: "TaskGH",
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskGH – Professional Home Services in Ghana",
    description: "Book trusted professionals for any home task.",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('taskgh-theme');
                let root = document.documentElement;
                if (!theme || theme === 'system') {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                root.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
