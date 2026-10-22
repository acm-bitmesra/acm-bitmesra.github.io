import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapterEventBySlug } from "@/db/queries/events";
import {
  getContributionCandidates,
  getEventLeaderboard,
  getEventRegistrations,
} from "@/db/queries/event-registrations";
import { db } from "@/db";
import { connectedAccounts, studentProfiles } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { siteConfig } from "@/config/site";
import { Trophy, ArrowLeft, ExternalLink, Info } from "lucide-react";
import { RankingsTable, type ParticipantStanding } from "./rankings-table";
import { events } from "@/data/events";

interface RankingsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RankingsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const staticEvent = events.find((e) => e.slug === slug);
  const title = staticEvent ? staticEvent.title : "Event";

  return {
    title: `${title} — Live Rankings & Standings | ACM BIT Mesra`,
    description: `Official live standings, rankings, and evaluated GitHub open-source contributions for ${title} at ACM BIT Mesra.`,
    openGraph: {
      title: `${title} — Live Leaderboard | ACM BIT Mesra`,
      description: `View real-time participant standings, approved pull requests, and scores for ${title}.`,
      url: `${siteConfig.url}/events/${slug}/rankings`,
      siteName: "ACM BIT Mesra",
    },
  };
}

export default async function EventRankingsPage({ params }: RankingsPageProps) {
  const { slug } = await params;
  const event = await getChapterEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const [leaderboard, registrations, candidates] = await Promise.all([
    getEventLeaderboard(event.id),
    getEventRegistrations(event.id),
    getContributionCandidates(event.id),
  ]);

  const userIds = registrations.map((r) => r.userId);

  let profiles: Array<typeof studentProfiles.$inferSelect> = [];
  let userConnectedAccounts: Array<typeof connectedAccounts.$inferSelect> = [];

  if (userIds.length > 0) {
    try {
      [profiles, userConnectedAccounts] = await Promise.all([
        db
          .select()
          .from(studentProfiles)
          .where(inArray(studentProfiles.userId, userIds)),
        db
          .select()
          .from(connectedAccounts)
          .where(inArray(connectedAccounts.userId, userIds)),
      ]);
    } catch (err) {
      console.error("Error fetching auxiliary user records for leaderboard:", err);
    }
  }

  // 1. Build Standings List
  let standings: ParticipantStanding[] = [];

  if (leaderboard && leaderboard.isPublished && leaderboard.standings.length > 0) {
    // Use published snapshot
    standings = leaderboard.standings.map((s, idx) => {
      const reg = registrations.find((r) => r.userId === s.userId);
      const prof = profiles.find((p) => p.userId === s.userId);
      const ghAcc = userConnectedAccounts.find(
        (a) => a.userId === s.userId && a.provider === "github"
      );

      const userCandidates = candidates.filter((c) => c.userId === s.userId);

      return {
        rank: s.rank || idx + 1,
        userId: s.userId,
        displayName: s.displayName || reg?.user.name || "Student Developer",
        email: reg?.user.email || "",
        image: reg?.user.image || null,
        slug: prof?.slug || null,
        githubHandle: s.githubUsername || ghAcc?.handle || null,
        githubProfileUrl: ghAcc?.profileUrl || (s.githubUsername ? `https://github.com/${s.githubUsername}` : null),
        isGithubVerified: Boolean(ghAcc?.isVerified),
        totalPrs: userCandidates.length,
        approvedPrs: s.approvedContributionsCount || userCandidates.filter((c) => c.reviewStatus === "APPROVED").length,
        totalScore: s.totalScore,
        registeredAt: reg?.registeredAt?.toISOString() || new Date().toISOString(),
        award: s.award || null,
      };
    });
  } else {
    // Generate real-time provisional standings from registrations and evaluated candidates
    const rawList = registrations.map((reg) => {
      const prof = profiles.find((p) => p.userId === reg.userId);
      const ghAcc = userConnectedAccounts.find(
        (a) => a.userId === reg.userId && a.provider === "github"
      );
      const userCandidates = candidates.filter((c) => c.userId === reg.userId);
      const approvedCandidates = userCandidates.filter(
        (c) => c.reviewStatus === "APPROVED"
      );

      const totalScore = approvedCandidates.reduce(
        (acc, c) => acc + (c.assignedScore || 0),
        0
      );

      // Check if custom answers contain stored githubHandle
      const customGhHandle =
        (reg.customAnswers as Record<string, unknown>)?.githubHandle as string | undefined;

      const githubHandle = ghAcc?.handle || customGhHandle || null;

      return {
        userId: reg.userId,
        displayName: prof?.displayName || reg.user.name || "Student Developer",
        email: reg.user.email,
        image: reg.user.image || null,
        slug: prof?.slug || null,
        githubHandle,
        githubProfileUrl: ghAcc?.profileUrl || (githubHandle ? `https://github.com/${githubHandle}` : null),
        isGithubVerified: Boolean(ghAcc?.isVerified),
        totalPrs: userCandidates.length,
        approvedPrs: approvedCandidates.length,
        totalScore,
        registeredAt: reg.registeredAt.toISOString(),
      };
    });

    // Sort: score desc, approvedPrs desc, totalPrs desc, registeredAt asc
    rawList.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.approvedPrs !== a.approvedPrs) return b.approvedPrs - a.approvedPrs;
      if (b.totalPrs !== a.totalPrs) return b.totalPrs - a.totalPrs;
      return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
    });

    standings = rawList.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }

  // Summary Metrics
  const totalParticipants = registrations.length;
  const totalPrs = candidates.length;
  const approvedPrs = candidates.filter((c) => c.reviewStatus === "APPROVED").length;
  const topScore = standings[0]?.totalScore || 0;

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to {event.title}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {leaderboard?.isPublished ? "Official Standings" : "Live Real-Time Standings"}
            </span>
          </div>
        </div>

        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>Leaderboard & Rankings</span>
          </div>
          <h1 className="text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-foreground sm:text-5xl">
            {event.title} Standings
          </h1>
          <p className="mt-3 max-w-[68ch] text-base leading-7 text-muted-foreground sm:text-lg">
            Live rankings of verified student developers based on evaluated open-source contributions, merged pull requests, and chapter technical rubrics.
          </p>
        </div>

        {/* Evaluation Disclaimer Banner */}
        <div className="rounded-xl border border-border bg-secondary/10 p-4 sm:p-5 flex items-start gap-3.5">
          <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-foreground">
              Evaluation & Scoring Notice
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              This is not the final evaluation. These scores and positions represent preliminary automated tracking. The final evaluation will be conducted manually by the judges depending upon the quality of the PR, difficulty, and where you have merged it.
            </p>
          </div>
        </div>

        {/* Homepage-aligned Metric Strip */}
        <section className="border-y border-border bg-secondary/10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 my-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="py-2">
              <div className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                {totalParticipants}
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">Registered Developers</div>
              <p className="mt-1 max-w-[28ch] text-xs text-muted-foreground">Verified BIT Mesra students competing</p>
            </div>
            <div className="py-2 border-l border-border pl-5 sm:pl-7">
              <div className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                {totalPrs}
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">Pull Requests</div>
              <p className="mt-1 max-w-[28ch] text-xs text-muted-foreground">Submitted across eligible repositories</p>
            </div>
            <div className="py-2 lg:border-l lg:border-border lg:pl-7">
              <div className="text-3xl font-semibold tracking-[-0.03em] text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                {approvedPrs}
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">Approved Contributions</div>
              <p className="mt-1 max-w-[28ch] text-xs text-muted-foreground">Merged & evaluated by maintainers</p>
            </div>
            <div className="py-2 border-l border-border pl-5 sm:pl-7">
              <div className="text-3xl font-semibold tracking-[-0.03em] text-primary sm:text-4xl">
                {topScore} <span className="text-sm font-normal text-muted-foreground">pts</span>
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">Top Score</div>
              <p className="mt-1 max-w-[28ch] text-xs text-muted-foreground">Current leaderboard leader score</p>
            </div>
          </div>
        </section>

        {/* Live Rankings Table Component */}
        <RankingsTable
          eventSlug={event.slug}
          eventTitle={event.title}
          isPublished={Boolean(leaderboard?.isPublished)}
          publishedAt={leaderboard?.publishedAt?.toISOString() || null}
          standings={standings}
        />

        {/* Footer Guidance Section */}
        <div className="rounded-xl border border-border bg-card/60 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">
            How are rankings and points evaluated?
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Automated metrics provide live tracking of submitted and merged PRs during the event. Please note that this is not the final evaluation. Final scores and standings will be evaluated manually by the judges based on the quality of the PR, difficulty of the contribution, and where you have merged it.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 pt-4 border-t border-border text-xs">
            <Link
              href={`/events/${event.slug}`}
              className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View event rules & guidelines</span>
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href="https://github.com/acm-bitmesra"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <span>Explore ACM Repositories</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
