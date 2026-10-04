import Link from "next/link";
import { getAuthorizedMember } from "@/lib/auth/session";
import { getAdminMetrics, getAdminPosts, getRecentAuditLogs } from "@/db/queries/admin-blog";
import { getAllChapterEvents } from "@/db/queries/events";
import { getAllChapterResources } from "@/db/queries/resources";
import { getActiveChapterAnnouncements } from "@/db/queries/announcements";
import { getSystemHealthReport } from "@/db/queries/system";
import { formatDate } from "@/lib/date";
import {
  FileText,
  AlertTriangle,
  Users,
  PenSquare,
  ArrowRight,
  Shield,
  Activity,
  Calendar,
  BookOpen,
  Bell,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const context = (await getAuthorizedMember())!;
  const [metrics, recentPosts, auditLogs, events, resources, announcements, systemHealth] =
    await Promise.all([
      getAdminMetrics(),
      getAdminPosts("ALL"),
      getRecentAuditLogs(8),
      getAllChapterEvents(),
      getAllChapterResources(),
      getActiveChapterAnnouncements(),
      getSystemHealthReport(),
    ]);

  const pendingReview = recentPosts.filter((p) => p.status === "IN_REVIEW");
  const upcomingEvents = events.filter((e) => e.status === "UPCOMING" || e.status === "ONGOING");
  const isSuperAdmin = context.role.hierarchyLevel === 0 || context.role.key === "SUPER_ADMIN";

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <Shield className="h-3.5 w-3.5" />
            <span>Command Center · Zero-Trust RBAC Enforced</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Chapter Operations & Governance
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Operator: <span className="text-zinc-200 font-semibold">{context.member.name}</span> ({context.role.displayName}). Authority Tier: <span className="text-emerald-400 font-mono font-semibold">Level {context.role.hierarchyLevel}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white font-medium text-xs transition-colors shadow-sm cursor-pointer"
          >
            <PenSquare className="h-4 w-4" />
            <span>Write Article</span>
          </Link>
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-medium text-xs transition-colors cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-zinc-400" />
            <span>Manage Events</span>
          </Link>
          <Link
            href="/admin/announcements"
            className="inline-flex items-center gap-2 py-2 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-medium text-xs transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4 text-zinc-400" />
            <span>Banners</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/blog"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400">Articles</span>
            <FileText className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-white group-hover:text-emerald-400 transition-colors">
            {metrics.total}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-mono">
            {metrics.published} published · {metrics.inReview} review · {metrics.drafts} drafts
          </div>
        </Link>

        <Link
          href="/admin/events"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400">Events & Contests</span>
            <Calendar className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-white group-hover:text-sky-400 transition-colors">
            {events.length}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-mono">
            {upcomingEvents.length} active/upcoming scheduled
          </div>
        </Link>

        <Link
          href="/admin/resources"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400">Knowledge Hub</span>
            <BookOpen className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-white group-hover:text-amber-400 transition-colors">
            {resources.length}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-mono">
            Curated roadmaps & technical guides
          </div>
        </Link>

        <Link
          href="/admin/members"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400">Chapter Roster</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-white group-hover:text-indigo-400 transition-colors">
            {systemHealth.metrics.activeMembers}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-mono">
            Active verified chapter members
          </div>
        </Link>
      </div>

      {/* Main Split: Pending Reviews & Live Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* In Review Alert if any */}
          {pendingReview.length > 0 && (
            <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold uppercase">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Submissions Requiring Editorial Review ({pendingReview.length})</span>
                </div>
              </div>
              <div className="divide-y divide-zinc-800/80">
                {pendingReview.map((post) => (
                  <div key={post.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white hover:underline">
                        <Link href={`/admin/blog/${post.id}/edit`}>{post.title}</Link>
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        By {post.createdByMember.name} · {post.category}
                      </p>
                    </div>
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="px-3 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-mono transition-colors shrink-0"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Announcements Strip */}
          {announcements.length > 0 && (
            <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-semibold uppercase">
                  <Bell className="h-4 w-4" />
                  <span>Active Broadcast Banners ({announcements.length})</span>
                </div>
                <Link
                  href="/admin/announcements"
                  className="text-xs font-mono text-blue-400 hover:underline"
                >
                  Manage Banners
                </Link>
              </div>
              <div className="space-y-2">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{ann.title}</div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1">{ann.message}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0">
                      LIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Articles Table Preview */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Recent Knowledge Articles</h3>
                <p className="text-xs text-zinc-400">Authored chapter dispatches, research notes, and tutorials.</p>
              </div>
              <Link
                href="/admin/blog"
                className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1 group"
              >
                <span>View all ({metrics.total})</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="divide-y divide-zinc-800/60">
              {recentPosts.slice(0, 5).map((post) => (
                <div key={post.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/30 transition-colors">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          post.status === "PUBLISHED"
                            ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400"
                            : post.status === "IN_REVIEW"
                            ? "bg-amber-950/40 border-amber-800/60 text-amber-400"
                            : post.status === "ARCHIVED"
                            ? "bg-zinc-900 border-zinc-800 text-zinc-500"
                            : "bg-sky-950/40 border-sky-800/60 text-sky-400"
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500 uppercase">{post.category}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white truncate max-w-md">
                      <Link href={`/admin/blog/${post.id}/edit`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h4>

                    <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
                      <span>{post.createdByMember.name}</span>
                      <span>·</span>
                      <span>{formatDate(post.updatedAt.toISOString())}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link
                      href={`/admin/blog/${post.id}/preview`}
                      className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      Preview
                    </Link>
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-white transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Governance, Diagnostics & Audit Logs (1 Col) */}
        <div className="space-y-6">
          {/* System Security & Zero-Trust Status */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#E31B23]" />
                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                  Security Matrix
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Database Status</span>
                <span className="text-emerald-400 font-semibold">{systemHealth.status} ({systemHealth.dbLatencyMs}ms)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Zero-Trust Model</span>
                <span className="text-zinc-200">Enforced</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Active Sessions</span>
                <span className="text-zinc-200">{systemHealth.metrics.activeSessions}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Allowlist Accounts</span>
                <span className="text-zinc-200">{systemHealth.allowlist.length} configured</span>
              </div>
            </div>

            {isSuperAdmin && (
              <div className="pt-2 border-t border-zinc-800">
                <Link
                  href="/admin/system"
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center justify-between"
                >
                  <span>Open System Diagnostics</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Chapter Audit Log Feed */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#E31B23]" />
                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                  Audit Trail
                </h3>
              </div>
              <Link href="/admin/audit" className="text-[11px] font-mono text-zinc-400 hover:text-white">
                View All
              </Link>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {auditLogs.length === 0 ? (
                <div className="text-zinc-500 py-2">No recorded actions yet.</div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-300">{log.action}</span>
                      <span className="text-zinc-500 text-[10px]">
                        {formatDate(log.createdAt.toISOString())}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      by <span className="text-white">{log.memberName || "System"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
