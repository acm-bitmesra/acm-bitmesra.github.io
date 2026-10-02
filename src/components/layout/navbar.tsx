"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Menu, X, Search } from "lucide-react";
import { GithubIcon, LinkedinIcon, AcmLogo } from "@/components/ui/icons";

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
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

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 border-b",
        scrolled
          ? "border-border/60 bg-background/90 backdrop-blur-md shadow-sm"
          : "border-transparent bg-background/50 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <AcmLogo className="h-9 w-9 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              ACM BIT Mesra
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Student Chapter
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {siteConfig.nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "text-foreground bg-secondary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA + Utility Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 h-9 px-3 rounded-md border border-border/80 bg-secondary/40 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Search site (Cmd+K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Search...</span>
            <kbd className="pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          {/* External Socials */}
          <div className="flex items-center border-l border-border pl-2 gap-1 text-muted-foreground">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Organization"
              className="p-2 rounded-md hover:text-foreground hover:bg-secondary transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-md hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>

          {/* Primary Action Button */}
          <Link
            href="/join"
            className="ml-2 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Join ACM
          </Link>
        </div>

        {/* Mobile Hamburger & Quick Search Button */}
        <div className="flex md:hidden items-center gap-1">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-md text-foreground hover:bg-secondary focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col space-y-1">
            {siteConfig.nav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-base font-medium rounded-md transition-colors",
                    isActive
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-border flex flex-col gap-3">
            <Link
              href="/join"
              className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Join ACM Chapter
            </Link>

            <div className="flex items-center justify-around pt-2 text-muted-foreground">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs hover:text-foreground"
              >
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs hover:text-foreground"
              >
                <LinkedinIcon className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="flex items-center gap-1 text-xs hover:text-foreground"
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
