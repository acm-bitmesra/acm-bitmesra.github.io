"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Menu, X, Search } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, AcmLogo } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 border-b",
        scrolled
          ? "border-border/80 bg-background/95 backdrop-blur-md shadow-xs"
          : "border-border/40 bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg shrink-0"
          aria-label="ACM BIT Mesra Homepage"
        >
          <AcmLogo className="h-9 w-9 sm:h-10 sm:w-10 group-hover:scale-105 transition-transform shrink-0" />
          <div className="flex flex-col justify-center">
            <span className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-none group-hover:text-primary transition-colors whitespace-nowrap">
              ACM BIT Mesra
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-muted-foreground leading-none mt-1 whitespace-nowrap">
              Student Chapter
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-0.5 lg:gap-1 shrink min-w-0"
          aria-label="Main Navigation"
        >
          {siteConfig.nav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md whitespace-nowrap transition-colors select-none",
                  isActive
                    ? "text-foreground bg-secondary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA + Search + Utility Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-2.5 shrink-0">
          {/* Search Trigger: Desktop with input style and shortcut */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden lg:flex items-center justify-between w-36 xl:w-44 h-9 px-2.5 rounded-lg border border-border/80 bg-secondary/30 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            title="Search site (Cmd+K)"
            aria-label="Search site"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Search...</span>
            </span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground shrink-0">
              ⌘K
            </kbd>
          </button>

          {/* Search Trigger: Tablet icon button (768px to 1023px) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex lg:hidden items-center justify-center h-9 w-9 rounded-lg border border-border/80 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            title="Search site (Cmd+K)"
            aria-label="Search site"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* External Socials (Visible on Large Desktop ≥ 1280px) */}
          <div className="hidden xl:flex items-center border-l border-border/70 pl-2 gap-1 text-muted-foreground shrink-0">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Organization"
              className="p-1.5 rounded-lg hover:text-foreground hover:bg-secondary transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-1.5 rounded-lg hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Primary Action Button (Whitespace nowrap strictly enforced) */}
          <Link
            href="/join"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-nowrap shrink-0"
          >
            Join ACM
          </Link>
        </div>

        {/* Mobile Hamburger & Quick Search Button (< 768px) */}
        <div className="flex md:hidden items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search site"
            className="flex items-center justify-center h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex items-center justify-center h-10 w-10 rounded-lg text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-label="Mobile Navigation Menu"
          aria-modal="true"
          className="md:hidden border-b border-border bg-background/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4"
        >
          <nav className="flex flex-col space-y-1">
            {siteConfig.nav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center min-h-[44px] px-3.5 py-2.5 text-base font-medium rounded-lg transition-colors whitespace-nowrap",
                    isActive
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Appearance
              </span>
              <ThemeToggle showLabel={true} />
            </div>

            <Link
              href="/join"
              className="w-full inline-flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Join ACM Chapter
            </Link>

            <div className="flex flex-wrap items-center justify-around gap-2 pt-2 text-muted-foreground border-t border-border/40">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs hover:text-foreground p-2"
              >
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs hover:text-foreground p-2"
              >
                <LinkedinIcon className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs hover:text-foreground p-2"
              >
                <InstagramIcon className="h-4 w-4" /> Instagram
              </a>
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="flex items-center gap-1.5 text-xs hover:text-foreground p-2"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
