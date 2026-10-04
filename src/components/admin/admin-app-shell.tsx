"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthorizedMemberContext } from "@/lib/auth/session";
import { AdminSignOutButton } from "./sign-out-button";
import { AdminCommandPalette } from "./admin-command-palette";
import {
  LayoutDashboard,
  Home,
  FileText,
  Calendar,
  BookOpen,
  Image,
  Award,
  Bell,
  Users,
  GraduationCap,
  Shield,
  History,
  Activity,
  ShieldAlert,
  BarChart3,
  Globe,
  ArrowRightLeft,
  Settings,
  Server,
  HeartPulse,
  ExternalLink,
  Search,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface AdminAppShellProps {
  context: AuthorizedMemberContext;
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  requiresSuperAdmin?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AdminAppShell({ context, children }: AdminAppShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);

  const isSuperAdmin =
    context.role.hierarchyLevel === 0 || context.role.key === "SUPER_ADMIN";

  const navSections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "CONTENT",
      items: [
        { href: "/admin/homepage", label: "Homepage", icon: Home },
        { href: "/admin/blog", label: "Articles / Blog", icon: FileText },
        { href: "/admin/events", label: "Events & Contests", icon: Calendar },
        { href: "/admin/resources", label: "Resources", icon: BookOpen },
        { href: "/admin/gallery", label: "Gallery", icon: Image },
        { href: "/admin/media", label: "Media Library", icon: Image },
        { href: "/admin/sponsors", label: "Sponsors", icon: Award },
        { href: "/admin/announcements", label: "Announcements", icon: Bell },
      ],
    },
    {
      title: "PEOPLE",
      items: [
        { href: "/admin/team", label: "Executive Team", icon: Users },
        { href: "/admin/alumni", label: "Alumni", icon: GraduationCap },
        { href: "/admin/members", label: "Chapter Members", icon: Users },
        { href: "/admin/roles", label: "Roles & RBAC", icon: Shield, requiresSuperAdmin: true },
      ],
    },
    {
      title: "GOVERNANCE",
      items: [
        { href: "/admin/terms", label: "Terms & Handover", icon: History },
        { href: "/admin/audit", label: "Audit Logs", icon: Activity },
        { href: "/admin/security", label: "Security Platform", icon: ShieldAlert },
      ],
    },
    {
      title: "GROWTH",
      items: [
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/admin/seo", label: "SEO & Social", icon: Globe },
        { href: "/admin/redirects", label: "Redirects", icon: ArrowRightLeft },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { href: "/admin/settings", label: "Settings", icon: Settings },
        { href: "/admin/system", label: "System Health", icon: Server },
        { href: "/admin/system/content-health", label: "Content Health", icon: HeartPulse },
      ],
    },
  ];

  // Mobile Bottom Bar core tabs
  const mobileBottomTabs = [
    { href: "/admin/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/admin/blog", label: "Articles", icon: FileText },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/members", label: "Roster", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-foreground flex flex-col antialiased">
      {/* Command Palette */}
      <AdminCommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Brand & Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="h-7 w-7 rounded bg-[#E31B23] text-white font-bold flex items-center justify-center font-mono text-xs shadow-sm group-hover:bg-red-600 transition-colors">
                ACM
              </div>
              <div className="flex items-baseline gap-1.5 font-mono text-xs">
                <span className="font-semibold text-white group-hover:text-zinc-200">
                  BITM
                </span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400">COMMAND</span>
              </div>
            </Link>
          </div>

          {/* Center Search / Command Palette Trigger */}
          <div className="flex-1 max-w-sm mx-4 hidden sm:block">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between h-9 px-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 text-xs font-mono text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300" />
                <span>Command menu...</span>
              </span>
              <kbd className="inline-flex h-5 items-center gap-0.5 rounded border border-zinc-800 bg-zinc-900 px-1.5 font-mono text-[10px] text-zinc-400">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Profile & Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Open command palette"
              className="sm:hidden flex items-center justify-center h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open live website in new tab"
              title="View Public Website"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

            {/* Profile Pill */}
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-lg px-2.5 py-1 hover:border-zinc-700 transition-colors"
            >
              <div className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-white overflow-hidden shrink-0">
                {context.user.image ? (
                  <img
                    src={context.user.image}
                    alt={context.member.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  context.member.name.charAt(0)
                )}
              </div>
              <div className="hidden md:block text-left font-mono">
                <div className="text-xs font-semibold text-white flex items-center gap-1 leading-none">
                  <span>{context.member.name.split(" ")[0]}</span>
                  {isSuperAdmin && (
                    <span className="px-1 py-0.2 rounded bg-red-950 text-red-400 border border-red-800 text-[8px] font-bold">
                      ROOT
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <AdminSignOutButton />
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        <aside
          className={`hidden lg:flex flex-col border-r border-zinc-800/80 bg-zinc-950/60 transition-all duration-200 select-none ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                {!sidebarCollapsed && (
                  <div className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">
                    {section.title}
                  </div>
                )}
                {section.items.map((item) => {
                  if (item.requiresSuperAdmin && !isSuperAdmin) return null;
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin/dashboard" &&
                      pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all group ${
                        isActive
                          ? "bg-zinc-800 text-white font-semibold shadow-sm"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80"
                      } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive
                            ? "text-red-500"
                            : "text-zinc-500 group-hover:text-zinc-300"
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Section 17) */}
      <nav
        aria-label="Mobile Admin Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-2 py-1.5 flex items-center justify-around"
      >
        {mobileBottomTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/admin/dashboard" && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
                isActive ? "text-red-500 font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 mb-0.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}

        {/* 'More' Drawer Trigger */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
            mobileDrawerOpen ? "text-red-500 font-bold" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Menu className="h-4 w-4 shrink-0 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs bg-zinc-950 border-l border-zinc-800 p-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>ALL SECTIONS</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-5">
                {navSections.map((section) => (
                  <div key={section.title} className="space-y-1">
                    <div className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase px-1">
                      {section.title}
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {section.items.map((item) => {
                        if (item.requiresSuperAdmin && !isSuperAdmin) return null;
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileDrawerOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                              isActive
                                ? "bg-zinc-800 text-white font-semibold"
                                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                            }`}
                          >
                            <Icon className="h-4 w-4 text-zinc-500 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-500">
              <span>ACM BIT Mesra v2.0</span>
              <Link
                href="/admin/profile"
                onClick={() => setMobileDrawerOpen(false)}
                className="text-white hover:underline"
              >
                Profile →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
