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
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 backdrop-blur-md px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <AcmLogo className="h-8 w-8 shrink-0 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-tight text-foreground">
                ACM BIT Mesra
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                Student Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {profileSlug && (
            <Link
              href={`/u/${profileSlug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Public Profile</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
          )}

          {isAuthorizedAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Admin Center</span>
            </Link>
          )}

          <ThemeToggle />

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2 border-l border-border pl-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Student"}
                className="h-8 w-8 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground border border-border">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden text-left sm:block">
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
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Clean Horizontal Sub-Navigation Tabs */}
      <div className="border-b border-border bg-background/50">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                  active
                    ? "border-primary text-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Clean Sidebar + Content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 md:flex-row">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-60 shrink-0 space-y-6">
          <nav className="flex flex-col gap-1 border-r border-border pr-4">
            <span className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </span>
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Clean Institutional Identity Box */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Verified Identity
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>BIT Mesra Student</span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          {/* Clean Event Challenge Link */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Trophy className="h-3.5 w-3.5 text-primary" />
              <span>Hacktoberfest 2026</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Live registrations open. PRs are tracked for manual judging evaluation.
            </p>
            <div className="pt-1 flex flex-col gap-1 text-[11px]">
              <Link
                href="/events/hacktoberfest-2026"
                className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <span>Event Guidelines</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/events/hacktoberfest-2026/rankings"
                className="font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Live Standings</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background/95 backdrop-blur-md px-2 md:hidden"
        aria-label="Mobile dashboard navigation"
      >
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 px-3 text-[10px] transition-colors",
                active
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
