"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchModal } from "@/components/search/search-modal";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  React.useEffect(() => {
    if (isAdmin) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <div className="relative min-h-screen bg-background text-foreground flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {/* Skip to Content for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs"
      >
        Skip to main content
      </a>

      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
