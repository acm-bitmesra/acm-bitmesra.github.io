import Link from "next/link";
import { getAuthorizedMember } from "@/lib/auth/session";
import { getAdminMetrics, getAdminPosts, getRecentAuditLogs } from "@/db/queries/admin-blog";
import { formatDate } from "@/lib/date";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  PenSquare,
  ArrowRight,
  Shield,
  Activity,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const context = (await getAuthorizedMember())!;
  const [metrics, recentPosts, auditLogs] = await Promise.all([
    getAdminMetrics(),
    getAdminPosts("ALL"),
    getRecentAuditLogs(8),
  ]);

  const pendingReview = recentPosts.filter((p) => p.status === "IN_REVIEW");

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <Shield className="h-3.5 w-3.5" />
            <span>Chapter Operations Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Editorial Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Logged in as <span className="text-zinc-200 font-semibold">{context.member.name}</span> ({context.role.displayName}). Managing ACM BIT Mesra knowledge publications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white font-medium text-xs transition-colors shadow-sm cursor-pointer"
          >
            <PenSquare className="h-4 w-4" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/blog?status=PUBLISHED"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400">Published</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-white group-hover:text-emerald-400 transition-colors">
            {metrics.published}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-mono">Live on acmbitm.campsy.app</div>
        </Link>

        <Link
          href="/admin/blog?status=IN_REVIEW"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400">In Review</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-white group-hover:text-amber-400 transition-colors">
            {metrics.inReview}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-mono">Awaiting editorial check</div>
        </Link>

        <Link
          href="/admin/blog?status=DRAFT"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400">Drafts</span>
            <FileText className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-white group-hover:text-sky-400 transition-colors">
            {metrics.drafts}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-mono">In-progress authoring</div>
        </Link>

        <Link
          href="/admin/members"
          className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400">Roster Authors</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-3 text-3xl font-bold font-mono text-white group-hover:text-indigo-400 transition-colors">
            {metrics.totalAuthors}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 font-mono">Active chapter members</div>
        </Link>
      </div>

      {/* Main Split: Pending Reviews & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Submissions / Recent Articles (2 Cols) */}
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

          {/* Recent Articles Table Preview */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Recent Articles</h3>
                <p className="text-xs text-zinc-400">All authored chapter posts across drafts, review, and publication.</p>
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
              {recentPosts.slice(0, 6).map((post) => (
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

        {/* Right Column: Audit Logs & Editorial Standards (1 Col) */}
        <div className="space-y-6">
          {/* Chapter Audit Log Feed */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Activity className="h-4 w-4 text-[#E31B23]" />
              <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                Audit Trail
              </h3>
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

          {/* Editorial Standards Notice */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-3 text-xs text-zinc-400">
            <div className="font-mono text-[11px] text-zinc-200 font-semibold uppercase flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              ACM BIT Mesra Editorial Standards
            </div>
            <ul className="space-y-2 list-disc list-inside text-zinc-400 text-[11px] leading-relaxed">
              <li>Every article published represents the ACM BIT Mesra student chapter.</li>
              <li>Author snapshots permanently record the member&apos;s current chapter title upon publication.</li>
              <li>Include reproducible code examples, system diagrams, and original analysis where applicable.</li>
              <li>Always preview Markdown rendering prior to submitting for review.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
