import Link from "next/link";
import { AuthorizedMemberContext } from "@/lib/auth/session";
import { AdminSignOutButton } from "./sign-out-button";
import { PERMISSIONS } from "@/lib/permissions/constants";
import {
  ShieldCheck,
  FileText,
  PenSquare,
  Users,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";

interface AdminNavbarProps {
  context: AuthorizedMemberContext;
}

export function AdminNavbar({ context }: AdminNavbarProps) {
  const canManageMembers = context.permissions.includes(PERMISSIONS.ADMIN_MANAGE_MEMBERS);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand & Chapter Tag */}
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="h-7 w-7 rounded bg-[#E31B23] text-white font-bold flex items-center justify-center font-mono text-xs shadow-sm">
                ACM
              </div>
              <div className="flex items-baseline gap-1.5 font-mono text-xs">
                <span className="font-semibold text-white group-hover:text-zinc-200">BITM</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400">CONSOLE</span>
              </div>
            </Link>

            {/* Main Nav Links */}
            <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-zinc-400" />
                <span>Overview</span>
              </Link>
              <Link
                href="/admin/blog"
                className="px-3 py-1.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
              >
                <FileText className="h-3.5 w-3.5 text-zinc-400" />
                <span>Articles</span>
              </Link>
              <Link
                href="/admin/blog/new"
                className="px-3 py-1.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
              >
                <PenSquare className="h-3.5 w-3.5 text-primary" />
                <span>Write Article</span>
              </Link>
              {canManageMembers && (
                <Link
                  href="/admin/members"
                  className="px-3 py-1.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
                >
                  <Users className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Chapter Roster</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Right Member Details & Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1.5 rounded hover:bg-zinc-900 transition-colors"
            >
              <span>View Public Blog</span>
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
                  <ShieldCheck className="h-3 w-3 text-[#E31B23]" />
                </div>
                <div className="text-[10px] text-zinc-400 truncate max-w-[140px]">
                  {context.role.displayName}
                </div>
              </div>
            </div>

            <AdminSignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
