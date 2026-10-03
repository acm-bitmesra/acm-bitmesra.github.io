import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteLayout } from "@/components/layout/site-layout";
import { siteConfig } from "@/config/site";

export const viewport: Viewport = {
  themeColor: "#121214",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ACM BIT Mesra — Computing, Coding & Innovation",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "ACM",
    "ACM BIT Mesra",
    "BIT Mesra",
    "Birla Institute of Technology",
    "Competitive Programming",
    "ICPC",
    "Hack-A-Bit",
    "CodeZilla",
    "Open Source",
    "Developer Community",
    "Computer Science",
  ],
  authors: [{ name: "ACM Student's Chapter, BIT Mesra" }],
  creator: "ACM BIT Mesra",
  publisher: "ACM BIT Mesra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "ACM BIT Mesra — Computing, Coding & Innovation",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: "ACM BIT Mesra — Association for Computing Machinery Student Chapter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACM BIT Mesra — Computing, Coding & Innovation",
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-red-500/20 selection:text-red-200">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
