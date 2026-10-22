import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStudentProfileBySlug } from "@/db/queries/students";
import {
  getUserAcmRankings,
  getUserRegistrationsWithEvents,
} from "@/db/queries/event-registrations";
import {
  CheckCircle,
  Code2,
  ExternalLink,
  GraduationCap,
  Award,
  Mail,
  FileText,
  Trophy,
  Sparkles,
  BookOpen,
  FolderGit2,
  ArrowRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GithubIcon } from "@/components/ui/icons";
import { InteractiveStatsCard } from "@/components/profile/interactive-stats-card";
import type { PinnedProject, PersonalBlogPost, ProfileCustomSettings } from "@/db/schema/students";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getStudentProfileBySlug(slug);

  if (!profile) {
    return { title: "Profile Not Found | ACM BIT Mesra" };
  }

  const name = profile.displayName || profile.user.name || "Student Developer";
  const title = `${name} (@${profile.slug}) — BIT Mesra Student Developer`;
  const description =
    profile.bio ||
    `Verified BIT Mesra student developer profile of ${name} on the official ACM BIT Mesra platform.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://acmbitm.campsy.app/u/${profile.slug}`,
      siteName: "ACM BIT Mesra",
      images: profile.user.image ? [{ url: profile.user.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// Map human skill names to skillicons.dev slug identifiers
function mapSkillToIcon(skill: string): string {
  const s = skill.toLowerCase().trim();
  const map: Record<string, string> = {
    typescript: "ts",
    ts: "ts",
    javascript: "js",
    js: "js",
    python: "python",
    py: "python",
    rust: "rust",
    rs: "rust",
    react: "react",
    "react.js": "react",
    next: "nextjs",
    "next.js": "nextjs",
    nextjs: "nextjs",
    node: "nodejs",
    "node.js": "nodejs",
    nodejs: "nodejs",
    tailwind: "tailwind",
    tailwindcss: "tailwind",
    postgres: "postgres",
    postgresql: "postgres",
    mongodb: "mongodb",
    mongo: "mongodb",
    redis: "redis",
    cloudflare: "cloudflare",
    docker: "docker",
    git: "git",
    github: "github",
    linux: "linux",
    vscode: "vscode",
    "c++": "cpp",
    cpp: "cpp",
    c: "c",
    java: "java",
    go: "go",
    golang: "go",
    html: "html",
    css: "css",
    graphql: "graphql",
    mysql: "mysql",
    aws: "aws",
    kubernetes: "kubernetes",
    k8s: "kubernetes",
    svelte: "svelte",
    vue: "vue",
    angular: "angular",
    flutter: "flutter",
    dart: "dart",
  };
  return map[s] || "";
}

export default async function StudentPublicProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const profile = await getStudentProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const [registrations, acmRanking] = await Promise.all([
    getUserRegistrationsWithEvents(profile.userId),
    getUserAcmRankings(profile.userId),
  ]);

  const activeEvents = registrations.filter(
    (r) => r.status === "CHECKED_IN" || r.status === "COMPLETED" || r.status === "REGISTERED"
  );

  // Extract blocks
  const blocks = profile.portfolioBlocks || [];
  const projectsBlock = blocks.find((b) => b.type === "projects");
  const pinnedProjects: PinnedProject[] = Array.isArray(projectsBlock?.content)
    ? (projectsBlock.content as PinnedProject[])
    : [];

  const blogsBlock = blocks.find((b) => b.type === "blogs");
  const personalBlogs: PersonalBlogPost[] = Array.isArray(blogsBlock?.content)
    ? (blogsBlock.content as PersonalBlogPost[])
    : [];

  const settingsBlock = blocks.find((b) => b.type === "settings");
  const settings: ProfileCustomSettings = (settingsBlock?.content || {}) as ProfileCustomSettings;

  // Connected Accounts
  const ghAccount = profile.connectedAccounts.find((a) => a.provider === "github");
  const cfAccount = profile.connectedAccounts.find((a) => a.provider === "codeforces");
  const otherAccounts = profile.connectedAccounts.filter(
    (a) => a.provider !== "github" && a.provider !== "codeforces"
  );

  const ghMeta = (ghAccount?.metadata || {}) as Record<string, unknown>;
  const cfMeta = (cfAccount?.metadata || {}) as Record<string, unknown>;

  const theme = profile.theme || "minimal";
  const isTerminal = theme === "terminal";
  const isEditorial = theme === "editorial";

  // Skill icons generation
  const validIconSlugs = (profile.skills || [])
    .map(mapSkillToIcon)
    .filter(Boolean);
  const uniqueIconSlugs = Array.from(new Set(validIconSlugs)).slice(0, 18);
  const skillIconsUrl =
    uniqueIconSlugs.length > 0
      ? `https://skillicons.dev/icons?i=${uniqueIconSlugs.join(",")}&perline=9`
      : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* OFFICIAL ACM CHAPTER STANDINGS & RANKING BANNER */}
      {acmRanking && (
        <section className="rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/[0.08] via-card to-background p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shrink-0">
                <Trophy className="h-7 w-7 text-amber-300" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                    ACM Chapter Standings
                  </span>
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    {acmRanking.tier}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Rank #{acmRanking.rank} · {acmRanking.eventTitle}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {acmRanking.totalScore} Points · {acmRanking.approvedPrs} Approved Contributions · Out of {acmRanking.totalParticipants} registered student developers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href={`/events/${acmRanking.eventSlug}/rankings`}
                className="btn-press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
              >
                <Trophy className="h-3.5 w-3.5 text-amber-300" />
                <span>View Live Leaderboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* HERO SECTION */}
      <section
        className={`rounded-2xl border p-6 sm:p-8 transition-all ${
          isTerminal
            ? "border-zinc-800 bg-zinc-950/80 shadow-none font-mono"
            : isEditorial
            ? "border-border bg-card shadow-sm font-serif"
            : "border-border bg-card shadow-sm"
        }`}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {profile.user.image ? (
              <img
                src={profile.user.image}
                alt={profile.displayName || profile.slug}
                className="h-24 w-24 object-cover shrink-0 rounded-2xl border border-border shadow-sm"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center font-bold text-3xl shrink-0 rounded-2xl bg-primary/10 text-primary border border-border">
                {(profile.displayName || "U").charAt(0).toUpperCase()}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {profile.displayName || profile.user.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Verified Student
                </span>

                {/* ACM Rank Capsule */}
                {acmRanking ? (
                  <Link
                    href={`/events/${acmRanking.eventSlug}/rankings`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                  >
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    <span>ACM Rank #{acmRanking.rank}</span>
                  </Link>
                ) : (
                  <Link
                    href="/events/hacktoberfest-2026/rankings"
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary border border-border px-2.5 py-0.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>ACM Chapter Developer</span>
                  </Link>
                )}
              </div>

              <div className="font-mono text-xs text-muted-foreground">
                @{profile.slug}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>
                    {profile.department || "Computer Science & Engineering"}
                    {profile.batch ? ` · ${profile.batch.label}` : ""}
                  </span>
                </span>

                {settings.showEmail && profile.user.email && (
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Mail className="h-3 w-3" />
                    <span>{profile.user.email}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {settings.resumeUrl && (
            <a
              href={settings.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-muted"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Download Resume</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6 border-t border-border/80 pt-5 text-sm leading-relaxed text-muted-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {profile.bio}
            </ReactMarkdown>
          </div>
        )}
      </section>

      {/* PRIORITY 1 & 2: VERIFIED GITHUB & CODEFORCES STRIP */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Award className="h-3.5 w-3.5 text-primary" />
          <span>Verified Developer Profiles</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* GitHub Verified Card */}
          {ghAccount ? (
            <a
              href={ghAccount.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <GithubIcon className="h-7 w-7 text-foreground shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                    <span>@{ghAccount.handle}</span>
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      OAuth Verified
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    {String(ghMeta.publicRepos || 0)} Repositories · {String(ghMeta.followers || 0)} Followers
                  </div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          ) : null}

          {/* Codeforces Card */}
          {cfAccount ? (
            <a
              href={cfAccount.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Code2 className="h-7 w-7 text-foreground shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                    <span>{cfAccount.handle}</span>
                    <span className="rounded bg-secondary px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase">
                      {String(cfMeta.rank || "contender")}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    Rating: <strong className="text-foreground">{String(cfMeta.rating || 0)}</strong> (Max: {String(cfMeta.maxRating || 0)})
                  </div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          ) : null}
        </div>

        {/* Other Platform Accounts Grid */}
        {otherAccounts.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 pt-1">
            {otherAccounts.map((acc) => {
              const providerLabels: Record<string, string> = {
                portfolio: "Portfolio",
                leetcode: "LeetCode",
                codechef: "CodeChef",
                hashnode: "Hashnode",
                devto: "DEV.to",
                peerlist: "Peerlist",
                notionfolio: "Notionfolio",
                gitlab: "GitLab",
                codepen: "CodePen",
                linkedin: "LinkedIn",
              };

              const label = providerLabels[acc.provider] || acc.provider.toUpperCase();
              return (
                <a
                  key={acc.id}
                  href={acc.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-all group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                      {label}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground truncate">
                      @{acc.handle}
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 group-hover:text-foreground" />
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* DYNAMIC SKILL ICONS SVG BAR (DEFAULT OFF) */}
      {settings.showSkillIcons === true && skillIconsUrl && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Technical Stack & Tools</span>
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground">skillicons.dev</span>
          </div>

          <div className="flex justify-center py-2 overflow-x-auto">
            <img
              src={skillIconsUrl}
              alt="Tech stack icons"
              className="max-w-full h-auto"
              loading="lazy"
            />
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
              {profile.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-foreground border border-border/80"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* INTERACTIVE GITHUB STATS & PROFILE SUMMARY CARDS (DEFAULT OFF) */}
      {settings.showGithubStats === true && ghAccount && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <GithubIcon className="h-3.5 w-3.5 text-foreground" />
              <span>Verified GitHub Metrics & Code Statistics</span>
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground">Live Telemetry</span>
          </div>

          <InteractiveStatsCard
            handle={ghAccount.handle}
            theme={theme}
            publicRepos={Number(ghMeta.publicRepos || 0)}
            followers={Number(ghMeta.followers || 0)}
            isTerminal={isTerminal}
          />
        </section>
      )}

      {/* PINNED TOP PROJECTS SECTION */}
      {pinnedProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FolderGit2 className="h-3.5 w-3.5 text-primary" />
              <span>Featured Engineering Projects</span>
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground">
              {pinnedProjects.length} Pinned
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {pinnedProjects.map((p) => (
              <div
                key={p.id}
                className="flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-all"
              >
                {p.showImage && p.imageUrl && (
                  <div className="relative h-44 w-full overflow-hidden border-b border-border bg-muted">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-foreground">{p.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {p.description}
                    </p>

                    {p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] font-medium text-secondary-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                    {p.repoUrl && (
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PERSONAL BLOGS SECTION (PROFILE ONLY) */}
      {personalBlogs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>Personal Articles & Notes</span>
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground">
              {personalBlogs.length} Published
            </span>
          </div>

          <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {personalBlogs.map((b) => (
              <div key={b.id} className="p-5 hover:bg-muted/30 transition-colors space-y-2">
                <div className="flex items-baseline justify-between gap-4">
                  <Link
                    href={`/u/${profile.slug}/blog/${b.slug}`}
                    className="font-bold text-sm text-foreground hover:text-primary transition-colors hover:underline"
                  >
                    {b.title}
                  </Link>
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                    {new Date(b.publishedAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {b.excerpt}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap gap-1">
                    {b.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-muted px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/u/${profile.slug}/blog/${b.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-xs text-primary hover:underline"
                  >
                    <span>Read article ({b.readingTimeMinutes || 2} min)</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CHAPTER HACKATHONS & PARTICIPATION HISTORY */}
      {activeEvents.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>Chapter Hackathons & Event Participation</span>
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activeEvents.map((r) => (
              <Link
                key={r.id}
                href={`/events/${r.event.slug}`}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-all group"
              >
                <div>
                  <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                    {r.event.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {r.team ? `Team: ${r.team.name}` : "Individual Track"} · {r.status}
                  </div>
                </div>
                <span className="font-mono text-xs text-primary group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
