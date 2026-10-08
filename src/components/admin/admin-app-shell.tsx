"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthorizedMemberContext } from "@/lib/auth/session";
import { PERMISSIONS, type Permission } from "@/lib/permissions/constants";
import {
  LayoutDashboard, Home, FileText, Calendar, BookOpen, Image as ImageIcon,
  Award, Bell, Users, GraduationCap, Shield, History, Activity, ShieldAlert,
  BarChart3, Globe, ArrowRightLeft, Settings, Server, HeartPulse, ExternalLink,
  Search, Menu, X, PanelLeftClose, PanelLeftOpen, Plus, ChevronRight, Command,
  UserRound,
} from "lucide-react";
import { AdminSignOutButton } from "./sign-out-button";
import { AdminCommandPalette } from "./admin-command-palette";

interface AdminAppShellProps {
  context: AuthorizedMemberContext;
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: Permission;
  requiresSuperAdmin?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/homepage", label: "Homepage", icon: Home, permission: PERMISSIONS.HOMEPAGE_VIEW },
      { href: "/admin/content", label: "Pages", icon: FileText, permission: PERMISSIONS.PAGES_VIEW },
      { href: "/admin/blog", label: "Articles", icon: FileText, permission: PERMISSIONS.BLOG_VIEW },
      { href: "/admin/events", label: "Events", icon: Calendar, permission: PERMISSIONS.EVENTS_VIEW },
      { href: "/admin/resources", label: "Resources", icon: BookOpen, permission: PERMISSIONS.RESOURCES_VIEW },
      { href: "/admin/gallery", label: "Gallery", icon: ImageIcon, permission: PERMISSIONS.GALLERY_VIEW },
      { href: "/admin/media", label: "Media", icon: ImageIcon, permission: PERMISSIONS.MEDIA_VIEW },
      { href: "/admin/sponsors", label: "Sponsors", icon: Award, permission: PERMISSIONS.SPONSORS_VIEW },
      { href: "/admin/announcements", label: "Announcements", icon: Bell, permission: PERMISSIONS.ANNOUNCEMENTS_MANAGE },
    ],
  },
  {
    title: "People",
    items: [
      { href: "/admin/team", label: "Executive Team", icon: Users, permission: PERMISSIONS.TEAM_VIEW },
      { href: "/admin/alumni", label: "Alumni", icon: GraduationCap, permission: PERMISSIONS.ALUMNI_VIEW },
      { href: "/admin/members", label: "Chapter Members", icon: Users, permission: PERMISSIONS.MEMBERS_VIEW },
      { href: "/admin/roles", label: "Roles & RBAC", icon: Shield, permission: PERMISSIONS.ROLES_VIEW, requiresSuperAdmin: true },
    ],
  },
  {
    title: "Governance",
    items: [
      { href: "/admin/terms", label: "Terms & Handover", icon: History, permission: PERMISSIONS.CONTENT_MANAGE },
      { href: "/admin/audit", label: "Audit Logs", icon: Activity, permission: PERMISSIONS.AUDIT_VIEW },
      { href: "/admin/security", label: "Security", icon: ShieldAlert, permission: PERMISSIONS.SECURITY_VIEW },
    ],
  },
  {
    title: "Growth",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3, permission: PERMISSIONS.ANALYTICS_VIEW },
      { href: "/admin/seo", label: "SEO & Social", icon: Globe, permission: PERMISSIONS.SEO_VIEW },
      { href: "/admin/redirects", label: "Redirects", icon: ArrowRightLeft, permission: PERMISSIONS.REDIRECTS_VIEW },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings, permission: PERMISSIONS.SETTINGS_VIEW },
      { href: "/admin/system", label: "System Health", icon: Server, permission: PERMISSIONS.SYSTEM_MANAGE },
      { href: "/admin/system/content-health", label: "Content Health", icon: HeartPulse, permission: PERMISSIONS.CONTENT_MANAGE },
    ],
  },
];

function isItemVisible(item: NavItem, context: AuthorizedMemberContext, isSuperAdmin: boolean) {
  if (item.requiresSuperAdmin && !isSuperAdmin) return false;
  if (!item.permission) return true;
  return context.permissions.includes(item.permission);
}

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin" || pathname === "/admin/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AdminAppShell({ context, children }: AdminAppShellProps) {
  const pathname = usePathname();
  const isSuperAdmin =
    context.role.hierarchyLevel === 0 || context.role.key === "SUPER_ADMIN";

  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const [mobileSearch, setMobileSearch] = React.useState("");

  React.useEffect(() => {
    try {
      setSidebarCollapsed(
        window.localStorage.getItem("acm-admin-sidebar-collapsed") === "1",
      );
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(
        "acm-admin-sidebar-collapsed",
        sidebarCollapsed ? "1" : "0",
      );
    } catch {}
  }, [sidebarCollapsed]);

  React.useEffect(() => {
    setMobileDrawerOpen(false);
    setMobileSearch("");
  }, [pathname]);

  React.useEffect(() => {
    if (!mobileDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileDrawerOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileDrawerOpen]);

  const visibleSections = React.useMemo(
    () =>
      NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          isItemVisible(item, context, isSuperAdmin),
        ),
      })).filter((section) => section.items.length > 0),
    [context, isSuperAdmin],
  );

  const visibleMobileItems = React.useMemo(() => {
    const normalized = mobileSearch.trim().toLowerCase();
    return visibleSections
      .flatMap((section) =>
        section.items.map((item) => ({ ...item, section: section.title })),
      )
      .filter(
        (item) =>
          !normalized || item.label.toLowerCase().includes(normalized),
      );
  }, [mobileSearch, visibleSections]);

  const mobileBottomTabs = [
    { href: "/admin", label: "Home", icon: LayoutDashboard },
    { href: "/admin/blog", label: "Articles", icon: FileText, permission: PERMISSIONS.BLOG_VIEW },
    { href: "/admin/events", label: "Events", icon: Calendar, permission: PERMISSIONS.EVENTS_VIEW },
    { href: "/admin/members", label: "People", icon: Users, permission: PERMISSIONS.MEMBERS_VIEW },
  ].filter(
    (item) =>
      !item.permission || context.permissions.includes(item.permission),
  );

  return (
    <div className="min-h-screen bg-[#070707] text-foreground antialiased">
      <AdminCommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#090909]/95 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-2 px-3 sm:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => {
                if (window.matchMedia("(max-width: 1023px)").matches) {
                  setMobileDrawerOpen(true);
                } else {
                  setSidebarCollapsed((collapsed) => !collapsed);
                }
              }}
              aria-label="Open administration navigation"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/70 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <button
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-900 hover:text-white lg:inline-flex"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            <Link href="/admin" className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E31B23] font-mono text-[10px] font-bold text-white shadow-[0_0_20px_rgba(227,27,35,0.18)]">
                ACM
              </div>
              <div className="hidden min-w-0 sm:block">
                <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-white">
                  <span>BIT Mesra</span>
                  <span className="text-zinc-700">/</span>
                  <span className="text-zinc-500">ADMIN</span>
                </div>
                <div className="truncate text-[10px] text-zinc-600">
                  Chapter operations console
                </div>
              </div>
            </Link>
          </div>

          <div className="mx-auto hidden w-full max-w-xl md:block">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="mx-auto flex h-9 w-full max-w-lg items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 text-left text-xs text-zinc-500 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-300"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                <span>Search admin, content, people…</span>
              </span>
              <kbd className="rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                ⌘ K
              </kbd>
            </button>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Search administration"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition hover:bg-zinc-800 hover:text-white md:hidden"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href="/admin/blog/new"
              className="hidden h-9 items-center gap-1.5 rounded-lg bg-[#E31B23] px-3 text-xs font-semibold text-white transition hover:bg-red-600 sm:inline-flex"
            >
              <Plus className="h-3.5 w-3.5" />
              Create
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-mono text-zinc-500 transition hover:bg-zinc-900 hover:text-white lg:inline-flex"
            >
              Live site
              <ExternalLink className="h-3 w-3" />
            </Link>

            <Link
              href="/admin/profile"
              aria-label="Open admin profile"
              className="group flex h-9 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-1.5 sm:px-2.5"
            >
              <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 text-[10px] font-semibold text-white">
                {context.user.image ? (
                  <img src={context.user.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  context.member.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden text-left md:block">
                <div className="flex items-center gap-1 text-[11px] font-semibold leading-none text-white">
                  <span className="max-w-28 truncate">{context.member.name.split(" ")[0]}</span>
                  {isSuperAdmin && (
                    <span className="rounded border border-red-900 bg-red-950/70 px-1 py-px font-mono text-[8px] text-red-400">
                      ROOT
                    </span>
                  )}
                </div>
                <div className="mt-1 max-w-32 truncate text-[9px] text-zinc-500">
                  {context.role.displayName}
                </div>
              </div>
            </Link>

            <AdminSignOutButton />
          </div>
        </div>

      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <aside
          className={`sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 flex-col border-r border-zinc-800/70 bg-[#090909] lg:flex ${
            sidebarCollapsed ? "w-[68px]" : "w-[248px]"
          }`}
        >
          <div className="flex-1 overflow-y-auto px-2.5 py-4">
            {visibleSections.map((section) => (
              <div key={section.title} className="mb-5">
                {!sidebarCollapsed && (
                  <div className="px-2 pb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    {section.title}
                  </div>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActivePath(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={sidebarCollapsed ? item.label : undefined}
                        aria-current={active ? "page" : undefined}
                        className={`group flex h-9 items-center gap-2.5 rounded-lg px-2.5 font-mono text-[11px] transition ${
                          active
                            ? "bg-zinc-800 text-white shadow-sm"
                            : "text-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-200"
                        } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                      >
                        <Icon
                          className={`h-3.5 w-3.5 shrink-0 ${
                            active ? "text-red-500" : "text-zinc-600 group-hover:text-zinc-300"
                          }`}
                        />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                        {!sidebarCollapsed && active && (
                          <ChevronRight className="ml-auto h-3 w-3 text-zinc-600" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800/70 p-2.5">
            <Link
              href="/admin/profile"
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-zinc-500 transition hover:bg-zinc-900 hover:text-white ${
                sidebarCollapsed ? "justify-center px-0" : ""
              }`}
            >
              <UserRound className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <div className="truncate text-[11px] font-medium text-zinc-300">
                    {context.member.name}
                  </div>
                  <div className="truncate font-mono text-[9px] text-zinc-600">
                    {context.role.displayName}
                  </div>
                </div>
              )}
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden bg-[#070707]">
          <div className="mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-8">
            {children}
          </div>
        </main>
      </div>

      <nav
        aria-label="Mobile primary navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-[#090909]/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around gap-1">
          {mobileBottomTabs.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={"flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 font-mono text-[9px] transition " + (active ? "bg-zinc-800 text-white" : "text-zinc-500")}
              >
                <Icon className={"h-4 w-4 " + (active ? "text-red-500" : "")} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 font-mono text-[9px] text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
          >
            <Menu className="h-4 w-4" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 right-0 flex w-[min(92vw,390px)] flex-col border-l border-zinc-800 bg-[#090909] shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Admin navigation
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  ACM BIT Mesra
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-zinc-900 p-3">
              <label className="flex h-10 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3">
                <Search className="h-3.5 w-3.5 text-zinc-600" />
                <input
                  value={mobileSearch}
                  onChange={(event) => setMobileSearch(event.target.value)}
                  placeholder="Filter sections…"
                  className="min-w-0 flex-1 bg-transparent font-mono text-xs text-white outline-none placeholder:text-zinc-600"
                />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {mobileSearch.trim() ? (
                <div className="space-y-1.5">
                  {visibleMobileItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActivePath(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-xs font-mono ${
                          active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                        <span className="ml-auto text-[9px] uppercase tracking-widest text-zinc-600">
                          {item.section}
                        </span>
                      </Link>
                    );
                  })}
                  {visibleMobileItems.length === 0 && (
                    <div className="rounded-lg border border-dashed border-zinc-800 p-6 text-center font-mono text-xs text-zinc-600">
                      No matching admin section.
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {visibleSections.map((section) => (
                    <section key={section.title}>
                      <div className="px-1 pb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                        {section.title}
                      </div>
                      <div className="grid gap-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const active = isActivePath(pathname, item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileDrawerOpen(false)}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-mono ${
                                active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                              }`}
                            >
                              <Icon className={`h-4 w-4 ${active ? "text-red-500" : "text-zinc-600"}`} />
                              <span>{item.label}</span>
                              {active && (
                                <span className="ml-auto text-[9px] uppercase tracking-widest text-red-500">
                                  Current
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-zinc-800 bg-zinc-950/80 p-3">
              <div className="mb-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setCommandPaletteOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-[11px] font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <Command className="h-3.5 w-3.5" />
                  Command
                </button>
                <Link
                  href="/admin/profile"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-[11px] font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <UserRound className="h-3.5 w-3.5" />
                  Profile
                </Link>
              </div>
              <div className="flex items-center justify-between px-1 text-[9px] font-mono uppercase tracking-widest text-zinc-600">
                <span>Production Console</span>
                <span>Secure session</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
