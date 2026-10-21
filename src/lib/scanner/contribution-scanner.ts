import { db } from "@/db";
import {
  contributionCandidates,
  contributionScanJobs,
  eventLeaderboards,
  eventRegistrations,
  connectedAccounts,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { ConnectedProvider } from "@/db/schema/students";

export interface ScanResult {
  jobId: string;
  totalParticipants: number;
  candidatesFound: number;
  leaderboardCount: number;
  status: "COMPLETED" | "FAILED";
  error?: string;
}

export async function runContributionScan(
  eventId: string,
  adminMemberId?: string
): Promise<ScanResult> {
  const jobId = `scan_${eventId.slice(0, 8)}_${Date.now().toString(36)}`;
  const now = new Date();

  // 1. Create scan job record
  await db.insert(contributionScanJobs).values({
    id: jobId,
    eventId,
    status: "RUNNING",
    startedAt: now,
    scanConfig: {
      allowedRepos: ["acm-bitmesra/acm-bitmesra.github.io"],
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
      acceptedStates: ["OPEN", "MERGED", "CLOSED"],
      requireMerged: false,
    },
    totalCandidatesFound: 0,
    createdAt: now,
  });

  try {
    // 2. Fetch all registered users for this event
    const registrations = await db.query.eventRegistrations.findMany({
      where: and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.status, "REGISTERED")
      ),
    });

    const userIds = registrations.map((r) => r.userId);
    if (userIds.length === 0) {
      await db
        .update(contributionScanJobs)
        .set({
          status: "COMPLETED",
          finishedAt: new Date(),
          totalCandidatesFound: 0,
        })
        .where(eq(contributionScanJobs.id, jobId));

      return {
        jobId,
        totalParticipants: 0,
        candidatesFound: 0,
        leaderboardCount: 0,
        status: "COMPLETED",
      };
    }

    // 3. Fetch connected GitHub accounts for participants
    const githubAccounts = await db.query.connectedAccounts.findMany({
      where: and(
        eq(connectedAccounts.provider, "GITHUB" as ConnectedProvider),
        eq(connectedAccounts.isVerified, true)
      ),
    });

    const userToGhHandle = new Map<string, string>();
    for (const acc of githubAccounts) {
      if (userIds.includes(acc.userId)) {
        userToGhHandle.set(acc.userId, acc.handle);
      }
    }

    let candidatesCount = 0;
    const scoresByUser = new Map<
      string,
      {
        displayName: string;
        githubUsername: string;
        totalScore: number;
        mergedPrs: number;
        earliestTimestamp: number;
      }
    >();

    // 4. Discover candidate PRs for each connected GitHub user
    for (const [userId, ghHandle] of userToGhHandle.entries()) {
      const searchUrl = `https://api.github.com/search/issues?q=type:pr+author:${encodeURIComponent(
        ghHandle
      )}+org:acm-bitmesra`;

      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ACM-BIT-Mesra-Scanner",
      };

      let prItems: Array<{
        id: number;
        number: number;
        html_url: string;
        title: string;
        state: string;
        pull_request?: { merged_at?: string | null };
        labels?: Array<{ name: string }>;
        created_at: string;
        repository_url?: string;
      }> = [];

      try {
        const res = await fetch(searchUrl, { headers });
        if (res.ok) {
          const data = await res.json();
          prItems = data.items || [];
        }
      } catch (err) {
        console.warn(`GitHub API search failed for handle ${ghHandle}:`, err);
      }

      let userScore = 0;
      let userMergedPrs = 0;
      let minTimestamp = Infinity;

      for (const pr of prItems) {
        const labelNames = (pr.labels || []).map((l) => l.name.toLowerCase());
        if (labelNames.includes("spam") || labelNames.includes("invalid")) {
          continue;
        }

        let prPoints = 10;
        const isMerged = Boolean(pr.pull_request?.merged_at || pr.state === "closed");
        if (isMerged) {
          prPoints += 20;
          userMergedPrs++;
        }
        if (labelNames.includes("hacktoberfest-accepted") || labelNames.includes("accepted")) {
          prPoints += 15;
        }
        if (labelNames.includes("difficulty:hard")) {
          prPoints += 30;
        } else if (labelNames.includes("difficulty:medium")) {
          prPoints += 15;
        } else if (labelNames.includes("difficulty:easy")) {
          prPoints += 5;
        }

        userScore += prPoints;
        const prTime = new Date(pr.created_at).getTime();
        if (prTime < minTimestamp) minTimestamp = prTime;

        const candidateId = `cand_${eventId.slice(0, 8)}_${userId.slice(0, 8)}_${pr.number}`;
        await db
          .insert(contributionCandidates)
          .values({
            id: candidateId,
            jobId,
            eventId,
            userId,
            githubUsername: ghHandle,
            prNumber: pr.number,
            prTitle: pr.title.slice(0, 200),
            prUrl: pr.html_url,
            repoOwner: "acm-bitmesra",
            repoName: "acm-bitmesra.github.io",
            prState: isMerged ? "MERGED" : pr.state.toUpperCase(),
            isMerged,
            prCreatedAt: new Date(pr.created_at),
            prMergedAt: pr.pull_request?.merged_at ? new Date(pr.pull_request.merged_at) : null,
            labels: labelNames,
            reviewStatus: isMerged ? "APPROVED" : "PENDING",
            assignedScore: prPoints,
            reviewerNotes: `Automated scan evaluation (Job ${jobId})`,
            reviewedBy: adminMemberId || null,
            reviewedAt: now,
            createdAt: now,
          })
          .onConflictDoUpdate({
            target: [
              contributionCandidates.eventId,
              contributionCandidates.repoOwner,
              contributionCandidates.repoName,
              contributionCandidates.prNumber,
            ],
            set: {
              jobId,
              isMerged,
              assignedScore: prPoints,
              reviewStatus: isMerged ? "APPROVED" : "PENDING",
            },
          });

        candidatesCount++;
      }

      scoresByUser.set(userId, {
        displayName: ghHandle,
        githubUsername: ghHandle,
        totalScore: userScore,
        mergedPrs: userMergedPrs,
        earliestTimestamp: minTimestamp === Infinity ? Date.now() : minTimestamp,
      });
    }

    // 5. Deterministic Tie-Breaking & Standings Generation
    const rankedUsers = Array.from(scoresByUser.entries()).sort((a, b) => {
      if (b[1].totalScore !== a[1].totalScore) {
        return b[1].totalScore - a[1].totalScore;
      }
      if (b[1].mergedPrs !== a[1].mergedPrs) {
        return b[1].mergedPrs - a[1].mergedPrs;
      }
      return a[1].earliestTimestamp - b[1].earliestTimestamp;
    });

    const standings = rankedUsers.map(([userId, stats], idx) => ({
      rank: idx + 1,
      userId,
      displayName: stats.displayName,
      githubUsername: stats.githubUsername,
      totalScore: stats.totalScore,
      approvedContributionsCount: stats.mergedPrs,
      tieBreakerScore: stats.mergedPrs * 100,
    }));

    // 6. Snapshot Official Leaderboard
    const leaderboardId = `lb_${eventId.slice(0, 8)}_${Date.now().toString(36)}`;
    await db.insert(eventLeaderboards).values({
      id: leaderboardId,
      eventId,
      snapshotVersion: 1,
      isPublished: true,
      standings,
      publishedBy: adminMemberId || null,
      publishedAt: new Date(),
      createdAt: new Date(),
    });

    // 7. Complete Scan Job
    await db
      .update(contributionScanJobs)
      .set({
        status: "COMPLETED",
        finishedAt: new Date(),
        totalCandidatesFound: candidatesCount,
      })
      .where(eq(contributionScanJobs.id, jobId));

    return {
      jobId,
      totalParticipants: userIds.length,
      candidatesFound: candidatesCount,
      leaderboardCount: standings.length,
      status: "COMPLETED",
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Scan job error:", err);

    await db
      .update(contributionScanJobs)
      .set({
        status: "FAILED",
        finishedAt: new Date(),
        error: errorMsg,
      })
      .where(eq(contributionScanJobs.id, jobId));

    return {
      jobId,
      totalParticipants: 0,
      candidatesFound: 0,
      leaderboardCount: 0,
      status: "FAILED",
      error: errorMsg,
    };
  }
}
