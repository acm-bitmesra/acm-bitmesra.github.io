"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Settings,
  Calendar,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  LogOut,
  Trophy,
  Globe,
  BookOpen,
} from "lucide-react";
import { AcmLogo } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { signOut } from "@/lib/auth/auth-client";

interface DashboardShellProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  profileSlug?: string | null;
  isAuthorizedAdmin?: boolean;
  children: React.ReactNode;
}

export function DashboardShell({
  user,
  profileSlug,
  isAuthorizedAdmin,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      window.location.href = "/";
    } catch {
      window.location.href = "/login";
    }
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/dashboard/profile",
      label: "Profile & Mini-Site",
      icon: User,
      exact: false,
    },
    {
      href: "/dashboard/blog",
      label: "Blog Studio",
      icon: BookOpen,
      exact: false,
    },
    {
      href: "/dashboard/settings",
      label: "Connected Accounts",
      icon: Settings,
      exact: false,
    },
    {
      href: "/dashboard/events",
      label: "Registered Events",
      icon: Calendar,
      exact: false,
    },
  ];

  const isActive = (itemHref: string, exact: boolean) => {
    if (exact) return pathname === itemHref;
    return pathname.startsWith(itemHref);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col pb-20 md:pb-8">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 backdrop-blur-md px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <AcmLogo className="h-8 w-8 shrink-0 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight text-foreground">
                ACM BIT Mesra
              </span>
              <span className="font-mono text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                Student Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {profileSlug && (
            <Link
              href={`/u/${profileSlug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted shadow-sm"
            >
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>View Live Mini-Site</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
          )}

          {isAuthorizedAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Admin Center</span>
            </Link>
          )}

          <ThemeToggle />

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2 border-l border-border pl-2 sm:pl-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Student"}
                className="h-8 w-8 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary border border-border">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden text-left lg:block">
              <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                <span className="truncate max-w-[120px]">{user.name}</span>
                <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
              </div>
              <div className="font-mono text-[10px] text-muted-foreground truncate max-w-[140px]">
                {user.email}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              title="Sign Out"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid: Sidebar + Content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 md:flex-row">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-64 shrink-0 space-y-4">
          <nav className="flex flex-col gap-1 rounded-xl border border-border bg-card p-2 shadow-sm">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Hacktoberfest 2026 Promo Box */}
          <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>Hacktoberfest 2026</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Registrations are officially open! Submit your PRs and track your rank on the live leaderboard.
            </p>
            <div className="pt-1 flex flex-col gap-1.5">
              <Link
                href="/events/hacktoberfest-2026"
                className="inline-flex items-center gap-1 font-semibold text-[11px] text-primary hover:underline"
              >
                <span>View Event Challenge</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/events/hacktoberfest-2026/rankings"
                className="inline-flex items-center gap-1 font-semibold text-[11px] text-amber-600 dark:text-amber-400 hover:underline"
              >
                <span>Live Standings & Leaderboard</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Identity Verification Card */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Student Credential
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Verified BIT Mesra Student</span>
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground truncate">
              {user.email}
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar (Ultra-clean phone UX) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background/95 backdrop-blur-md px-2 md:hidden shadow-lg"
        aria-label="Mobile dashboard navigation"
      >
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                active
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-primary scale-110" : "text-muted-foreground"}`} />
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
