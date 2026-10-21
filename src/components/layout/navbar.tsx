"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Mail } from "@animateicons/react/lucide";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  AcmLogo,
} from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSession } from "@/lib/auth/auth-client";

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { data: sessionData, isPending: isSessionPending } = useSession();
  const user = sessionData?.user;

  React.useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="ACM BIT Mesra homepage"
          className="group flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AcmLogo className="h-9 w-9 shrink-0 transition-transform group-hover:scale-[1.02]" />
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-bold leading-5 tracking-[-0.015em] text-foreground sm:text-base">
              ACM BIT Mesra
            </span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Student Chapter
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {siteConfig.nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative min-h-11 px-3.5 text-sm font-medium text-muted-foreground transition-colors after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active && "font-semibold text-foreground after:scale-x-100"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search site"
            title="Search site (⌘K)"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Search className="h-5 w-5" />
          </button>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {!isSessionPending && user ? (
            <Link
              href="/dashboard"
              className="hidden min-h-9 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:inline-flex shadow-sm"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Student"}
                  className="h-5 w-5 rounded-full object-cover border border-border"
                />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </span>
              )}
              <span>Dashboard</span>
            </Link>
          ) : !isSessionPending ? (
            <>
              <Link
                href="/login"
                className="hidden min-h-9 items-center justify-center rounded-md px-3 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
              >
                Log in
              </Link>

              <Link
                href="/login?callbackUrl=/dashboard"
                className="hidden min-h-9 items-center justify-center rounded-md bg-primary px-3.5 text-xs sm:text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
              >
                Sign up
              </Link>
            </>
          ) : null}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 py-2" aria-label="Mobile navigation">
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center border-b border-border text-base font-medium text-muted-foreground transition-colors hover:text-foreground",
                    active && "font-semibold text-primary"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="mx-auto max-w-7xl px-4 pb-6 pt-4 sm:px-6">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Appearance
              </span>
              <ThemeToggle showLabel />
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {!isSessionPending && user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Student"}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px] font-bold text-primary-foreground">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span>Open Student Dashboard</span>
                </Link>
              ) : !isSessionPending ? (
                <>
                  <Link
                    href="/login"
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/login?callbackUrl=/dashboard"
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Sign up
                  </Link>
                </>
              ) : null}
            </div>

            <div className="mt-5 flex items-center gap-4 text-muted-foreground">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACM BIT Mesra on GitHub"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <GithubIcon className="h-4 w-4 shrink-0" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACM BIT Mesra on LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <LinkedinIcon className="h-4 w-4 shrink-0" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACM BIT Mesra on Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <InstagramIcon className="h-4 w-4 shrink-0" />
              </a>
              <a
                href={`mailto:${siteConfig.social.email}`}
                aria-label={`Email ${siteConfig.social.email}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail className="h-4 w-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
