import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { getChapterEventBySlug } from "@/db/queries/events";
import {
  getEventLeaderboard,
  getUserEventRegistration,
} from "@/db/queries/event-registrations";
import { getConnectedAccountByProvider } from "@/db/queries/students";
import { db } from "@/db";
import { contributionCandidates } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ authenticated: false, registered: false });
  }

  try {
    const { slug } = await params;
    const event = await getChapterEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const [reg, ghAccount, leaderboard] = await Promise.all([
      getUserEventRegistration(event.id, session.user.id),
      getConnectedAccountByProvider(session.user.id, "github"),
      getEventLeaderboard(event.id),
    ]);

    let userCandidates: Array<typeof contributionCandidates.$inferSelect> = [];
    try {
      userCandidates = await db
        .select()
        .from(contributionCandidates)
        .where(
          and(
            eq(contributionCandidates.eventId, event.id),
            eq(contributionCandidates.userId, session.user.id)
          )
        );
    } catch {
      userCandidates = [];
    }

    const userStanding = leaderboard?.standings?.find(
      (s) => s.userId === session.user.id
    );

    const approvedCount = userCandidates.filter(
      (c) => c.reviewStatus === "APPROVED"
    ).length;

    const calculatedScore = userCandidates
      .filter((c) => c.reviewStatus === "APPROVED")
      .reduce((acc, c) => acc + (c.assignedScore || 0), 0);

    const ghMeta = (ghAccount?.metadata || {}) as Record<string, unknown>;

    return NextResponse.json({
      authenticated: true,
      registered: Boolean(reg && reg.status !== "CANCELLED"),
      registration: reg,
      event: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        status: event.status,
      },
      githubAccount: ghAccount
        ? {
            handle: ghAccount.handle,
            profileUrl: ghAccount.profileUrl,
            isVerified: ghAccount.isVerified,
            avatarUrl: ghMeta.avatarUrl || null,
          }
        : null,
      stats: {
        contributionsCount: userCandidates.length,
        approvedCount,
        totalScore: userStanding?.totalScore ?? calculatedScore,
        rank: userStanding?.rank || null,
      },
    });
  } catch (error) {
    console.error("Error fetching event status:", error);
    return NextResponse.json({ error: "Failed to fetch event status" }, { status: 500 });
  }
}
