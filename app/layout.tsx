import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BIO/ACC AI Assistant",
  description: "Your AI guide to biotechnology acceleration and DeSci",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  metadataBase: new URL('https://bioacc.meme'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BIO/ACC AI",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "BIO/ACC AI Assistant",
    description: "Your AI guide to biotechnology acceleration and DeSci",
    siteName: "BIO/ACC AI",
    url: "https://bioacc.meme",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIO/ACC AI Assistant",
    description: "Your AI guide to biotechnology acceleration and DeSci",
    creator: "@BIOACC_SOL_CTO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
