import Link from "next/link";
import { getAuthSession } from "@/lib/auth/session";
import { getConnectedAccounts, getStudentProfileByUserId } from "@/db/queries/students";
import { getUserAcmRankings, getUserRegistrationsWithEvents } from "@/db/queries/event-registrations";
import {
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  Trophy,
  Globe,
  BookOpen,
  PenSquare,
  Code2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

export default async function DashboardOverviewPage() {
  const session = await getAuthSession();
  if (!session?.user) return null;

  const [profile, connectedAccounts, registrations, acmRanking] = await Promise.all([
    getStudentProfileByUserId(session.user.id),
    getConnectedAccounts(session.user.id),
    getUserRegistrationsWithEvents(session.user.id),
    getUserAcmRankings(session.user.id),
  ]);

  const ghAccount = connectedAccounts.find((a) => a.provider === "github");
  const cfAccount = connectedAccounts.find((a) => a.provider === "codeforces");

  const ghMeta = (ghAccount?.metadata || {}) as Record<string, unknown>;
  const cfMeta = (cfAccount?.metadata || {}) as Record<string, unknown>;

  const isHacktoberfestRegistered = registrations.some(
    (r) => r.event.slug === "hacktoberfest-2026" && r.status !== "CANCELLED"
  );

  // Extract pinned projects count and blogs count from profileBlocks
  const blocks = profile?.portfolioBlocks || [];
  const projectsBlock = blocks.find((b) => b.type === "projects");
  const pinnedProjects = Array.isArray(projectsBlock?.content) ? projectsBlock.content : [];

  const blogsBlock = blocks.find((b) => b.type === "blogs");
  const personalBlogs = Array.isArray(blogsBlock?.content) ? blogsBlock.content : [];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <header className="border-b border-border pb-6 sm:pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <span>Student Developer Platform</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">Overview</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
              Welcome, {session.user.name}
            </h1>
            <p className="max-w-[64ch] text-sm leading-6 text-muted-foreground sm:text-base">
              Manage your verified university identity, event participation, evaluated open-source contributions, and personal portfolio site.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {profile?.slug && (
              <Link
                href={`/u/${profile.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Public Site</span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </Link>
            )}
            <Link
              href="/dashboard/profile"
              className="btn-press inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <span>Edit Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Typographic Metric Strip (Homepage StatsStrip layout) */}
      <section className="border-y border-border bg-secondary/10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 my-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="py-1">
            <div className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              {acmRanking ? `#${acmRanking.rank}` : "—"}
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              ACM Chapter Standing
            </div>
            <p className="mt-1 max-w-[28ch] text-xs text-muted-foreground">
              {acmRanking ? `${acmRanking.totalScore} pts (${acmRanking.approvedPrs} approved PRs)` : "Compete in live chapter events"}
            </p>
          </div>

          <div className="py-1 border-l border-border pl-5 sm:pl-7">
            <div className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              {registrations.length}
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              Active Registrations
            </div>
            <p className="mt-1 max-w-[28ch] text-xs text-muted-foreground">
              {isHacktoberfestRegistered ? "Hacktoberfest 2026 registered" : "Explore upcoming contests"}
            </p>
          </div>

          <div className="py-1 lg:border-l lg:border-border lg:pl-7">
            <div className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              {connectedAccounts.length} / 2
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              Verified Connections
            </div>
            <p className="mt-1 max-w-[28ch] text-xs text-muted-foreground">
              {ghAccount ? `@${ghAccount.handle} linked` : "Connect GitHub to sync PRs"}
            </p>
          </div>

          <div className="py-1 border-l border-border pl-5 sm:pl-7">
            <div className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              {personalBlogs.length}
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              Published Articles
            </div>
            <p className="mt-1 max-w-[28ch] text-xs text-muted-foreground">
              Personal BlockNote writing studio
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Active Event & Challenge Participation */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
              Chapter Events & Competitions
            </h2>
            <p className="text-xs text-muted-foreground">
              Official hackathons, coding contests, and open-source challenges.
            </p>
          </div>

          <Link
            href="/dashboard/events"
            className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>All Registrations</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Ruled Event Item (matching EventCard /events styling) */}
        <div className="rounded-lg border border-border bg-card p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Competitive Open Source
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {isHacktoberfestRegistered ? "Registration Confirmed" : "Registration Open"}
              </span>
            </div>

            {acmRanking && (
              <span className="font-mono text-xs font-bold text-foreground">
                Rank #{acmRanking.rank} · {acmRanking.totalScore} pts
              </span>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
              Hacktoberfest 2026
            </h3>
            <p className="mt-1.5 max-w-[70ch] text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Official ACM BIT Mesra month-long open-source festival. Submit pull requests to eligible chapter repositories and recommended projects. Initial points update automatically, and final rankings will be evaluated manually by the judges based on PR quality and merge targets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border text-xs">
            <Link
              href="/events/hacktoberfest-2026/rankings"
              className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Live Standings & Rankings</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/events/hacktoberfest-2026"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <span>Event Details & Rules</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Developer Accounts & Integrations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
              Developer Account Integrations
            </h2>
            <p className="text-xs text-muted-foreground">
              Connect external developer profiles to evaluate contributions and algorithmic metrics.
            </p>
          </div>

          <Link
            href="/dashboard/settings"
            className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Manage Accounts</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* GitHub Connection */}
          <div className="rounded-lg border border-border bg-card p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GithubIcon className="h-4 w-4 text-foreground" />
                  <span className="text-sm font-semibold text-foreground">GitHub</span>
                </div>
                {ghAccount ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Not Linked
                  </span>
                )}
              </div>

              {ghAccount ? (
                <div className="space-y-1">
                  <div className="font-mono text-sm font-semibold text-foreground">
                    @{ghAccount.handle}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {String(ghMeta.publicRepos || 0)} Public Repositories · {String(ghMeta.followers || 0)} Followers
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Link your GitHub account to enable automatic evaluation for Hacktoberfest and display repository cards on your profile.
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-border">
              <Link
                href="/dashboard/settings"
                className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>{ghAccount ? "Configure GitHub Sync" : "Connect GitHub Account"}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Codeforces Connection */}
          <div className="rounded-lg border border-border bg-card p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-foreground" />
                  <span className="text-sm font-semibold text-foreground">Codeforces</span>
                </div>
                {cfAccount ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Optional
                  </span>
                )}
              </div>

              {cfAccount ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
                    <span>{cfAccount.handle}</span>
                    <span className="text-xs font-normal text-muted-foreground capitalize">
                      ({String(cfMeta.rank || "unrated")})
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Rating: <span className="font-mono font-semibold text-foreground">{String(cfMeta.rating || 0)}</span> (Max {String(cfMeta.maxRating || 0)})
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Add your Codeforces handle to display competitive programming ratings, contest badges, and rank stats.
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-border">
              <Link
                href="/dashboard/settings"
                className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>{cfAccount ? "Update Codeforces Handle" : "Connect Codeforces"}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Student Mini-Site & Blog Studio */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
              Developer Profile & Blog Studio
            </h2>
            <p className="text-xs text-muted-foreground">
              Your public portfolio URL, pinned projects, and technical writing studio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/blog/write"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              <PenSquare className="h-3 w-3" />
              <span>Write Article</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <span>Profile Settings</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Public URL
              </span>
              <div className="font-mono text-xs font-semibold text-foreground truncate mt-1">
                {profile?.slug ? `/u/${profile.slug}` : "Not claimed"}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Design Theme
              </span>
              <div className="text-xs font-semibold text-foreground capitalize mt-1">
                {profile?.theme === "duolingo" ? "Modern Clean" : (profile?.theme || "Modern Clean")}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Pinned Projects
              </span>
              <div className="font-mono text-xs font-semibold text-foreground mt-1">
                {pinnedProjects.length} Projects
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Blog Studio
              </span>
              <div className="font-mono text-xs font-semibold text-foreground mt-1">
                {personalBlogs.length} Articles
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/blog"
                className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
              >
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Open Blog Studio</span>
              </Link>
              <Link
                href="/dashboard/profile"
                className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
              >
                <span>Edit Portfolio Blocks</span>
              </Link>
            </div>

            {profile?.slug && (
              <Link
                href={`/u/${profile.slug}`}
                target="_blank"
                className="font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>View Live Site</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
