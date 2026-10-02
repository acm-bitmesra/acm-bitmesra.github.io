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
  },
  twitter: {
    card: "summary_large_image",
    title: "ACM BIT Mesra — Computing, Coding & Innovation",
    description: siteConfig.description,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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
