import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://acmbitm.campsy.app"),
  title: {
    default: "ACM BIT Mesra — Computing, Coding & Innovation",
    template: "%s | ACM BIT Mesra",
  },
  description:
    "Official website of ACM Student Chapter, Birla Institute of Technology, Mesra. A computing community empowering students through competitive programming, software development, hackathons, open source, and collaborative learning.",
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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-red-500/20 selection:text-red-200">
        {children}
      </body>
    </html>
  );
}
