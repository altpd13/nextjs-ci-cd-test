import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Header } from "@/src/widgets/Header";
import { ThemeProvider } from "@/src/entities/theme";
import { Footer } from "@/src/widgets/Footer";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Verification",
  description: "Don't trust, just verify.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} flex flex-col h-full bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-white text-black from-gray-50 to-gray-100`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            {/* <Footer /> */}
          </ThemeProvider>
      </body>
    </html>
  );
}
