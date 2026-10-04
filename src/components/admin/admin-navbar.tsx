import Link from "next/link";
import { AuthorizedMemberContext } from "@/lib/auth/session";
import { AdminSignOutButton } from "./sign-out-button";
import { PERMISSIONS } from "@/lib/permissions/constants";
import {
  ShieldCheck,
  FileText,
  Calendar,
  BookOpen,
  Bell,
  Users,
  LayoutDashboard,
  ExternalLink,
  Activity,
  Server,
} from "lucide-react";

interface AdminNavbarProps {
  context: AuthorizedMemberContext;
}

export function AdminNavbar({ context }: AdminNavbarProps) {
  const canManageMembers = context.permissions.includes(PERMISSIONS.ADMIN_MANAGE_MEMBERS);
  const canViewAudit = context.permissions.includes(PERMISSIONS.AUDIT_VIEW);
  const isSuperAdmin = context.role.hierarchyLevel === 0 || context.role.key === "SUPER_ADMIN";

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/blog", label: "Articles", icon: FileText },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/resources", label: "Resources", icon: BookOpen },
    { href: "/admin/announcements", label: "Announcements", icon: Bell },
  ];

  if (canManageMembers) {
    navLinks.push({ href: "/admin/members", label: "Roster", icon: Users });
  }

  if (canViewAudit || isSuperAdmin) {
    navLinks.push({ href: "/admin/audit", label: "Audit Log", icon: Activity });
  }

  if (isSuperAdmin) {
    navLinks.push({ href: "/admin/system", label: "System", icon: Server });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand & Chapter Tag */}
          <div className="flex items-center gap-5">
            <Link href="/admin" className="flex items-center gap-2.5 group shrink-0">
              <div className="h-7 w-7 rounded bg-[#E31B23] text-white font-bold flex items-center justify-center font-mono text-xs shadow-sm group-hover:bg-red-600 transition-colors">
                ACM
              </div>
              <div className="flex items-baseline gap-1.5 font-mono text-xs">
                <span className="font-semibold text-white group-hover:text-zinc-200">BITM</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400">COMMAND</span>
              </div>
            </Link>

            {/* Main Nav Links (Scrollable on tablet) */}
            <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-2.5 py-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
                  >
                    <Icon className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Member Details & Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1.5 rounded hover:bg-zinc-900 transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

            {/* Member Profile Badge */}
            <div className="flex items-center gap-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg px-2.5 py-1.5">
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
              <div className="hidden sm:block text-left font-mono">
                <div className="text-xs font-semibold text-white flex items-center gap-1">
                  <span>{context.member.name}</span>
                  {isSuperAdmin ? (
                    <span className="px-1 py-0.2 rounded bg-red-950 text-red-400 border border-red-800 text-[9px] font-bold">
                      ROOT
                    </span>
                  ) : (
                    <ShieldCheck className="h-3 w-3 text-[#E31B23]" />
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 truncate max-w-[130px]">
                  {context.role.displayName}
                </div>
              </div>
            </div>

            <AdminSignOutButton />
          </div>
        </div>

        {/* Mobile/Tablet Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-zinc-900 gap-1 font-mono text-xs scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-2.5 py-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
