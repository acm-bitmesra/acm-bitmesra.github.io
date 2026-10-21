import Link from "next/link";
import { getAuthSession } from "@/lib/auth/session";
import { getConnectedAccounts, getStudentProfileByUserId } from "@/db/queries/students";
import { getUserAcmRankings, getUserRegistrationsWithEvents } from "@/db/queries/event-registrations";
import {
  CheckCircle,
  ExternalLink,
  Code2,
  ArrowRight,
  Trophy,
  Sparkles,
  GraduationCap,
  Globe,
  BookOpen,
  PenSquare,
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
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "Student"}
                className="h-16 w-16 rounded-2xl border border-border object-cover shrink-0 shadow-sm"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary border border-border shrink-0">
                {(session.user.name || "U").charAt(0).toUpperCase()}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-[-0.03em] text-foreground sm:text-2xl">
                  {session.user.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-3 w-3" />
                  Verified BIT Mesra Student
                </span>

                {acmRanking && (
                  <Link
                    href={`/events/${acmRanking.eventSlug}/rankings`}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                  >
                    <Trophy className="h-3 w-3 text-amber-500" />
                    <span>ACM Rank #{acmRanking.rank}</span>
                  </Link>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {profile?.department || "Computer Science & Engineering"}
                  {profile?.batch ? ` · ${profile.batch.label}` : ""}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground/80">
                  {session.user.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {profile?.slug ? (
              <Link
                href={`/u/${profile.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted shadow-sm"
              >
                <Globe className="h-4 w-4 text-primary" />
                <span>acmbitm.campsy.app/u/{profile.slug}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </Link>
            ) : (
              <Link
                href="/dashboard/profile"
                className="btn-press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Claim Developer Mini-Site</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Grid: 4 Overview Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Hacktoberfest 2026 & ACM Standings */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Trophy className="h-4 w-4 text-amber-500" />
                Hacktoberfest
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isHacktoberfestRegistered
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                {isHacktoberfestRegistered ? (acmRanking ? `Rank #${acmRanking.rank}` : "Registered ✓") : "Open"}
              </span>
            </div>

            <div className="mt-3">
              <div className="font-bold text-sm text-foreground">Hacktoberfest 2026</div>
              <p className="mt-0.5 text-[11px] text-muted-foreground leading-normal">
                {isHacktoberfestRegistered
                  ? acmRanking
                    ? `Standing: Rank #${acmRanking.rank} with ${acmRanking.totalScore} pts (${acmRanking.approvedPrs} PRs approved).`
                    : "PR tracking active. Compete on the live leaderboard."
                  : "Challenge is live! Register using your GitHub account."}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-2.5">
            <Link
              href={isHacktoberfestRegistered ? "/events/hacktoberfest-2026/rankings" : "/events/hacktoberfest-2026"}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>{isHacktoberfestRegistered ? "View Live Leaderboard" : "Register Now"}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Card 2: GitHub Account */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <GithubIcon className="h-4 w-4 text-foreground" />
                GitHub
              </span>
              {ghAccount ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-2.5 w-2.5" />
                  Verified
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  Not Linked
                </span>
              )}
            </div>

            <div className="mt-3">
              {ghAccount ? (
                <div className="space-y-0.5">
                  <div className="font-mono text-sm font-bold text-foreground">
                    @{ghAccount.handle}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {String(ghMeta.publicRepos || 0)} Repos · {String(ghMeta.followers || 0)} Followers
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Connect GitHub to evaluate open-source contributions and PR stats.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-2.5">
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>{ghAccount ? "Manage Connection" : "Connect GitHub"}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Card 3: Codeforces */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Code2 className="h-4 w-4 text-foreground" />
                Codeforces
              </span>
              {cfAccount ? (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Verified
                </span>
              ) : (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  Optional
                </span>
              )}
            </div>

            <div className="mt-3">
              {cfAccount ? (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {cfAccount.handle}
                    </span>
                    <span className="rounded bg-secondary px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase">
                      {String(cfMeta.rank || "unrated")}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Rating: <span className="font-mono font-bold text-foreground">{String(cfMeta.rating || 0)}</span> (Max {String(cfMeta.maxRating || 0)})
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Add Codeforces handle to display algorithmic ratings on your profile.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-2.5">
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>{cfAccount ? "Manage Handle" : "Connect Codeforces"}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Card 4: Personal Blog Studio */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                Blog Studio
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] font-bold text-secondary-foreground">
                {personalBlogs.length} {personalBlogs.length === 1 ? "Post" : "Posts"}
              </span>
            </div>

            <div className="mt-3">
              <div className="font-bold text-sm text-foreground">BlockNote Articles</div>
              <p className="mt-0.5 text-[11px] text-muted-foreground leading-normal">
                {personalBlogs.length > 0
                  ? `Latest: ${personalBlogs[0].title}`
                  : "Write and publish technical articles on your profile using BlockNote."}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-2.5">
            <Link
              href="/dashboard/blog"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Manage Blog Studio</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mini-Site Customization Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">Developer Portfolio & Mini-Site</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize your design system, pin top projects, and publish personal blogs with BlockNote.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/blog/write"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-sm"
            >
              <PenSquare className="h-3.5 w-3.5 text-primary" />
              <span>Write Article</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="btn-press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span>Edit Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
          <div className="rounded-lg bg-muted/40 p-3 border border-border/80">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Design System</span>
            <div className="font-bold text-xs text-foreground capitalize mt-1">
              {profile?.theme === "duolingo" ? "Modern Clean" : (profile?.theme || "Minimal Notion")}
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 border border-border/80">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Pinned Projects</span>
            <div className="font-bold text-xs text-foreground mt-1">
              {pinnedProjects.length} Projects
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 border border-border/80">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Personal Blogs</span>
            <div className="font-bold text-xs text-foreground mt-1">
              {personalBlogs.length} Articles
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 border border-border/80">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Connected Platforms</span>
            <div className="font-bold text-xs text-foreground mt-1">
              {connectedAccounts.length} Platforms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
