import Link from "next/link";
import { getAuthorizedMember } from "@/lib/auth/session";
import {
  getAdminMetrics,
  getAdminPosts,
  getRecentAuditLogs,
} from "@/db/queries/admin-blog";
import { getAllChapterEvents } from "@/db/queries/events";
import { getAllChapterResources } from "@/db/queries/resources";
import { getActiveChapterAnnouncements } from "@/db/queries/announcements";
import { getSystemHealthReport } from "@/db/queries/system";
import { formatDate } from "@/lib/date";
import { PERMISSIONS } from "@/lib/permissions/constants";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  BookOpen,
  Calendar,
  FileText,
  Home,
  ImageIcon,
  Lock,
  PenSquare,
  Server,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

function ActionCard({
  href,
  title,
  description,
  icon: Icon,
  accent = "default",
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accent?: "red" | "default";
}) {
  return (
    <Link
      href={href}
      className={
        "group rounded-xl border p-4 transition " +
        (accent === "red"
          ? "border-red-900/50 bg-red-950/10 hover:border-red-700/60 hover:bg-red-950/20"
          : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/70")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border " +
            (accent === "red"
              ? "border-red-900/50 bg-red-950/30 text-red-400"
              : "border-zinc-800 bg-zinc-900 text-zinc-400")
          }
        >
          <Icon className="h-4 w-4" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-zinc-700 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-400" />
      </div>
      <div className="mt-4 text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs leading-5 text-zinc-500">{description}</div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const context = (await getAuthorizedMember())!;
  const [
    metrics,
    allPosts,
    auditLogs,
    events,
    resources,
    announcements,
    systemHealth,
  ] = await Promise.all([
    getAdminMetrics(),
    getAdminPosts("ALL"),
    getRecentAuditLogs(8),
    getAllChapterEvents(),
    getAllChapterResources(),
    getActiveChapterAnnouncements(),
    getSystemHealthReport(),
  ]);

  const pendingReview = allPosts.filter((post) => post.status === "IN_REVIEW");
  const upcomingEvents = events
    .filter((event) => event.status === "UPCOMING" || event.status === "ONGOING")
    .slice(0, 4);

  const canBlog = context.permissions.includes(PERMISSIONS.BLOG_CREATE);
  const canEvents = context.permissions.includes(PERMISSIONS.EVENTS_CREATE);
  const canMedia = context.permissions.includes(PERMISSIONS.MEDIA_UPLOAD);
  const canHomepage = context.permissions.includes(PERMISSIONS.HOMEPAGE_UPDATE);
  const canMembers = context.permissions.includes(PERMISSIONS.MEMBERS_VIEW);
  const canAudit = context.permissions.includes(PERMISSIONS.AUDIT_VIEW);
  const isSuperAdmin =
    context.role.hierarchyLevel === 0 || context.role.key === "SUPER_ADMIN";

  const attentionCount = pendingReview.length;
  const healthOk =
    systemHealth.status === "healthy" ||
    systemHealth.status === "HEALTHY" ||
    systemHealth.status === "ok" ||
    systemHealth.status === "OK";

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[radial-gradient(circle_at_top_right,rgba(227,27,35,0.10),transparent_30%),#0a0a0a]">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              ACM BIT Mesra · Operations
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Good to see you, {context.member.name.split(" ")[0]}.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Manage the chapter website, editorial queue, events, people, and governance from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {canBlog && (
              <Link
                href="/admin/blog/new"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#E31B23] px-3.5 text-xs font-semibold text-white transition hover:bg-red-600"
              >
                <PenSquare className="h-3.5 w-3.5" />
                Write article
              </Link>
            )}
            <Link
              href="/admin/events"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-900"
            >
              <Calendar className="h-3.5 w-3.5 text-zinc-500" />
              Events
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-white"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              Live site
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-zinc-800/80 sm:grid-cols-4">
          <div className="border-r border-zinc-800/80 p-4 sm:p-5">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-zinc-600">
              Articles
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-white">{metrics.total}</div>
            <div className="mt-1 text-[11px] text-zinc-500">{metrics.published} published</div>
          </div>
          <div className="border-r border-zinc-800/80 p-4 sm:p-5">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-zinc-600">
              In review
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-white">{metrics.inReview}</div>
            <div className="mt-1 text-[11px] text-zinc-500">editorial queue</div>
          </div>
          <div className="border-r border-zinc-800/80 p-4 sm:p-5">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-zinc-600">
              Events
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-white">{events.length}</div>
            <div className="mt-1 text-[11px] text-zinc-500">{upcomingEvents.length} upcoming / live</div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-zinc-600">
              Members
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-white">{systemHealth.metrics.activeMembers}</div>
            <div className="mt-1 text-[11px] text-zinc-500">active roster</div>
          </div>
        </div>
      </section>

      {attentionCount > 0 && (
        <section className="rounded-xl border border-amber-900/50 bg-amber-950/10 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-900/60 bg-amber-950/30 text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-amber-200">
                  {attentionCount} {attentionCount === 1 ? "item needs" : "items need"} your attention
                </div>
                <div className="mt-1 text-xs leading-5 text-amber-200/60">
                  Articles are waiting in the editorial review queue.
                </div>
              </div>
            </div>
            <Link
              href="/admin/blog?status=IN_REVIEW"
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-amber-800/70 bg-amber-950/40 px-3 text-xs font-mono text-amber-200 hover:bg-amber-950/70"
            >
              Review queue
              <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Quick actions</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Common operations, optimized for keyboard, desktop, and touch.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  bubbles: true,
                }),
              );
            }}
            className="hidden items-center gap-1.5 rounded-md border border-zinc-800 px-2.5 py-1.5 font-mono text-[10px] text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 sm:inline-flex"
          >
            <Zap className="h-3 w-3" />
            Command menu
            <kbd className="rounded border border-zinc-800 bg-zinc-950 px-1 text-[9px]">⌘K</kbd>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {canBlog && (
            <ActionCard
              href="/admin/blog/new"
              title="Create article"
              description="Draft a technical tutorial, dispatch, or chapter note."
              icon={FileText}
              accent="red"
            />
          )}
          {canEvents && (
            <ActionCard
              href="/admin/events"
              title="Manage events"
              description="Create, update, schedule, and publish chapter events."
              icon={Calendar}
            />
          )}
          {canMedia && (
            <ActionCard
              href="/admin/media"
              title="Upload media"
              description="Add posters, gallery images, and reusable assets."
              icon={ImageIcon}
            />
          )}
          {canHomepage && (
            <ActionCard
              href="/admin/homepage"
              title="Edit homepage"
              description="Update featured sections, announcements, and calls to action."
              icon={Home}
            />
          )}
          {canMembers && (
            <ActionCard
              href="/admin/members"
              title="Manage people"
              description="Review the verified chapter roster and current roles."
              icon={Users}
            />
          )}
          {canAudit && (
            <ActionCard
              href="/admin/audit"
              title="Review audit trail"
              description="Inspect administrative actions, actors, outcomes, and request context."
              icon={Activity}
            />
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)]">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Upcoming & live</h2>
              <p className="mt-1 text-xs text-zinc-500">The next chapter activities currently visible to operators.</p>
            </div>
            <Link href="/admin/events" className="text-[11px] font-mono text-zinc-500 hover:text-white">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/70">
            {upcomingEvents.length === 0 ? (
              <div className="px-5 py-10 text-center text-xs text-zinc-600">
                No upcoming or live events are scheduled.
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href="/admin/events"
                  className="flex items-center gap-4 px-4 py-4 transition hover:bg-zinc-900/50 sm:px-5"
                >
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 font-mono">
                    <span className="text-[9px] uppercase text-zinc-600">Event</span>
                    <Calendar className="mt-0.5 h-3.5 w-3.5 text-zinc-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{event.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                      <span>{event.category}</span>
                      <span className="text-zinc-700">•</span>
                      <span>{formatDate(event.startDate.toISOString().slice(0, 10))}</span>
                      <span className="text-zinc-700">•</span>
                      <span>{event.status}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-700" />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Recent activity</h2>
              <p className="mt-1 text-xs text-zinc-500">Latest recorded administrative actions.</p>
            </div>
            {canAudit && (
              <Link href="/admin/audit" className="text-[11px] font-mono text-zinc-500 hover:text-white">
                Audit →
              </Link>
            )}
          </div>
          <div className="space-y-2 p-3">
            {auditLogs.length === 0 ? (
              <div className="px-2 py-8 text-center text-xs text-zinc-600">No activity recorded yet.</div>
            ) : (
              auditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="flex gap-3 rounded-lg border border-zinc-800/70 bg-zinc-900/40 p-3">
                  <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 flex items-center justify-center">
                    <Activity className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="truncate text-xs font-semibold text-zinc-200">{log.action}</span>
                      <span className="font-mono text-[9px] text-zinc-600">
                        {formatDate(log.createdAt.toISOString())}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      {log.memberName || "System"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-white">System health</h2>
            <span
              className={
                "ml-auto inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[9px] uppercase " +
                (healthOk
                  ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-400"
                  : "border-amber-900/60 bg-amber-950/30 text-amber-400")
              }
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {healthOk ? "Healthy" : String(systemHealth.status)}
            </span>
          </div>
          <div className="mt-5 space-y-3">
            <MetricRow label="Database latency" value={systemHealth.dbLatencyMs + " ms"} />
            <MetricRow label="Active sessions" value={String(systemHealth.metrics.activeSessions)} />
            <MetricRow label="Allowlist accounts" value={String(systemHealth.allowlist.size)} />
            <MetricRow label="Active members" value={String(systemHealth.metrics.activeMembers)} />
          </div>
          {isSuperAdmin && (
            <Link
              href="/admin/system"
              className="mt-5 inline-flex items-center text-xs font-mono text-zinc-500 hover:text-white"
            >
              Open system diagnostics
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-white">Broadcasts</h2>
            <span className="ml-auto rounded-full border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[9px] text-zinc-500">
              {announcements.length} live
            </span>
          </div>
          <div className="mt-4 space-y-2">
            {announcements.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-800 p-4 text-xs text-zinc-600">
                No active announcements.
              </div>
            ) : (
              announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="rounded-lg border border-zinc-800/70 bg-zinc-900/40 p-3">
                  <div className="text-xs font-medium text-white">{announcement.title}</div>
                  <div className="mt-1 line-clamp-2 text-[11px] leading-5 text-zinc-500">
                    {announcement.message}
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/admin/announcements" className="mt-4 inline-flex text-xs font-mono text-zinc-500 hover:text-white">
            Manage announcements →
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-white">Knowledge hub</h2>
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-white">{resources.length}</div>
              <div className="mt-1 text-xs text-zinc-500">curated resources</div>
            </div>
            <Link
              href="/admin/resources"
              className="inline-flex min-h-9 items-center rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Manage
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-600">
            <div className="rounded-md border border-zinc-800/70 bg-zinc-900/30 px-2.5 py-2">DSA</div>
            <div className="rounded-md border border-zinc-800/70 bg-zinc-900/30 px-2.5 py-2">Systems</div>
            <div className="rounded-md border border-zinc-800/70 bg-zinc-900/30 px-2.5 py-2">Open source</div>
            <div className="rounded-md border border-zinc-800/70 bg-zinc-900/30 px-2.5 py-2">AI / ML</div>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-2 border-t border-zinc-800/70 pt-5 text-[10px] font-mono text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <span>{context.role.displayName} · ACM BIT Mesra Admin Console</span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Server-side authorization
          </span>
          <span className="hidden text-zinc-800 sm:inline">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3 w-3" />
            Audited actions
          </span>
        </div>
      </footer>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-zinc-500">{label}</span>
      <span className="font-mono text-zinc-200">{value}</span>
    </div>
  );
}

