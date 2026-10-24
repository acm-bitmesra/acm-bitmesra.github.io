import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { getChapterEventBySlug } from "@/db/queries/events";
import {
  getUserEventRegistration,
  getUserContributions,
  deleteUserContribution,
} from "@/db/queries/event-registrations";
import { getConnectedAccountByProvider } from "@/db/queries/students";
import { db } from "@/db";
import { contributionCandidates } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { recordAuditEvent } from "@/lib/auth/audit";

const GITHUB_PR_REGEX =
  /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/pull\/([0-9]+)(?:[#/?].*)?$/i;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const event = await getChapterEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const contributions = await getUserContributions(event.id, session.user.id);
    return NextResponse.json({ contributions });
  } catch (error) {
    console.error("Error fetching user contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch user contributions" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in with your university account." },
      { status: 401 }
    );
  }

  try {
    const { slug } = await params;
    const event = await getChapterEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 1. Verify user is registered for the event
    const registration = await getUserEventRegistration(event.id, session.user.id);
    if (!registration || registration.status === "CANCELLED") {
      return NextResponse.json(
        {
          error:
            "You must be registered for this event before submitting pull requests. Please click 'Register' first.",
        },
        { status: 403 }
      );
    }

    // 2. Parse request body
    const body = await req.json().catch(() => ({}));
    const rawPrUrl = typeof body?.prUrl === "string" ? body.prUrl.trim() : "";
    const notes = typeof body?.notes === "string" ? body.notes.trim() : "";

    if (!rawPrUrl) {
      return NextResponse.json(
        { error: "Please enter a valid GitHub pull request URL." },
        { status: 400 }
      );
    }

    // 3. Validate GitHub PR URL format
    const match = rawPrUrl.match(GITHUB_PR_REGEX);
    if (!match) {
      return NextResponse.json(
        {
          error:
            "Invalid GitHub pull request URL. Example format: https://github.com/acm-bitmesra/NexHound/pull/1",
        },
        { status: 400 }
      );
    }

    const repoOwner = match[1];
    const repoName = match[2];
    const prNumber = parseInt(match[3], 10);
    const canonicalPrUrl = `https://github.com/${repoOwner}/${repoName}/pull/${prNumber}`;

    if (isNaN(prNumber) || prNumber <= 0) {
      return NextResponse.json(
        { error: "Invalid pull request number in URL." },
        { status: 400 }
      );
    }

    // 4. Check for duplicate PR in this event
    const [existing] = await db
      .select()
      .from(contributionCandidates)
      .where(
        and(
          eq(contributionCandidates.eventId, event.id),
          eq(contributionCandidates.repoOwner, repoOwner),
          eq(contributionCandidates.repoName, repoName),
          eq(contributionCandidates.prNumber, prNumber)
        )
      )
      .limit(1);

    if (existing) {
      if (existing.userId !== session.user.id) {
        return NextResponse.json(
          {
            error: `This pull request (${repoOwner}/${repoName}#${prNumber}) has already been submitted by another participant.`,
          },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          {
            error: `You have already submitted this pull request. Current status: ${existing.reviewStatus} (${existing.assignedScore} pts).`,
          },
          { status: 409 }
        );
      }
    }

    // 5. Fetch connected GitHub account if available
    const ghAccount = await getConnectedAccountByProvider(session.user.id, "github");
    const regAnswers = (registration.customAnswers || {}) as Record<string, unknown>;
    const userGhHandle =
      ghAccount?.handle || (regAnswers.githubHandle as string | undefined);

    // 6. Query GitHub REST API to verify PR existence and retrieve metadata
    let prData: {
      title: string;
      state: string;
      merged: boolean;
      mergedAt: Date | null;
      createdAt: Date;
      author: string;
      labels: string[];
    } | null = null;

    try {
      const ghApiUrl = `https://api.github.com/repos/${encodeURIComponent(
        repoOwner
      )}/${encodeURIComponent(repoName)}/pulls/${prNumber}`;

      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ACM-BIT-Mesra-App",
      };

      if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      }

      const ghRes = await fetch(ghApiUrl, { headers });

      if (ghRes.ok) {
        const json = await ghRes.json();
        const isMerged = Boolean(json.merged_at || json.merged);
        prData = {
          title: json.title || `PR #${prNumber}`,
          state: isMerged ? "MERGED" : (json.state?.toUpperCase() || "OPEN"),
          merged: isMerged,
          mergedAt: json.merged_at ? new Date(json.merged_at) : null,
          createdAt: json.created_at ? new Date(json.created_at) : new Date(),
          author: json.user?.login || "",
          labels: (json.labels || []).map((l: { name: string }) =>
            l.name.toLowerCase()
          ),
        };
      } else if (ghRes.status === 404) {
        return NextResponse.json(
          {
            error: `Pull request #${prNumber} was not found on GitHub. Please check the URL and ensure the repository is public.`,
          },
          { status: 404 }
        );
      } else {
        console.warn(
          `GitHub API responded with status ${ghRes.status} for ${ghApiUrl}`
        );
      }
    } catch (fetchErr) {
      console.warn("GitHub API fetch error:", fetchErr);
    }

    // Safe fallback if GitHub API was unreachable or rate-limited
    const finalPrData = prData || {
      title: `Pull Request #${prNumber} (${repoName})`,
      state: "OPEN",
      merged: false,
      mergedAt: null,
      createdAt: new Date(),
      author: userGhHandle || "developer",
      labels: [],
    };

    // 7. Verify ownership if connected GitHub handle is known
    if (userGhHandle && finalPrData.author && finalPrData.author !== "developer") {
      if (finalPrData.author.toLowerCase() !== userGhHandle.toLowerCase()) {
        return NextResponse.json(
          {
            error: `The author of this pull request (@${finalPrData.author}) does not match your registered GitHub account (@${userGhHandle}). You can only submit pull requests created by your own account.`,
          },
          { status: 403 }
        );
      }
    }

    // 8. Reject spam / invalid contributions
    if (
      finalPrData.labels.includes("spam") ||
      finalPrData.labels.includes("invalid")
    ) {
      return NextResponse.json(
        {
          error:
            "This pull request has been tagged as 'spam' or 'invalid' by repository maintainers and cannot be submitted.",
        },
        { status: 400 }
      );
    }

    // 9. Calculate initial rubric score
    let calculatedScore = 10; // Base PR points
    if (finalPrData.merged) {
      calculatedScore += 20; // Merged bonus
    }
    if (
      finalPrData.labels.includes("hacktoberfest-accepted") ||
      finalPrData.labels.includes("accepted")
    ) {
      calculatedScore += 15;
    }
    if (finalPrData.labels.includes("difficulty:hard")) {
      calculatedScore += 30;
    } else if (finalPrData.labels.includes("difficulty:medium")) {
      calculatedScore += 15;
    } else if (finalPrData.labels.includes("difficulty:easy")) {
      calculatedScore += 5;
    }

    const candidateId = `cand_${event.id.slice(0, 6)}_${session.user.id.slice(
      0,
      6
    )}_${repoName.slice(0, 8)}_${prNumber}_${Date.now().toString(36)}`;

    const candidateUsername =
      userGhHandle || finalPrData.author || "developer";

    const candidateNotes = notes
      ? `Manual submission: ${notes.slice(0, 500)}`
      : "Manually submitted by participant";

    const newCandidate = {
      id: candidateId,
      jobId: null,
      eventId: event.id,
      userId: session.user.id,
      githubUsername: candidateUsername,
      prNumber,
      prTitle: finalPrData.title.slice(0, 200),
      prUrl: canonicalPrUrl,
      repoOwner,
      repoName,
      prState: finalPrData.state,
      isMerged: finalPrData.merged,
      prCreatedAt: finalPrData.createdAt,
      prMergedAt: finalPrData.mergedAt,
      labels: finalPrData.labels,
      reviewStatus: finalPrData.merged
        ? ("APPROVED" as const)
        : ("PENDING" as const),
      assignedScore: calculatedScore,
      reviewerNotes: candidateNotes,
      createdAt: new Date(),
    };

    await db.insert(contributionCandidates).values(newCandidate);

    await recordAuditEvent({
      action: "CONTRIBUTION_SUBMITTED",
      targetType: "EVENT",
      targetId: event.id,
      details: {
        prUrl: canonicalPrUrl,
        prNumber,
        repo: `${repoOwner}/${repoName}`,
        score: calculatedScore,
        isMerged: finalPrData.merged,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pull request submitted successfully!",
        candidate: newCandidate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contribution PR:", error);
    return NextResponse.json(
      { error: "Failed to submit pull request. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const event = await getChapterEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("id");

    if (!candidateId) {
      return NextResponse.json(
        { error: "Missing candidate id parameter" },
        { status: 400 }
      );
    }

    const result = await deleteUserContribution(
      event.id,
      session.user.id,
      candidateId
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to remove pull request" },
        { status: 404 }
      );
    }

    await recordAuditEvent({
      action: "CONTRIBUTION_DELETED",
      targetType: "EVENT",
      targetId: event.id,
      details: { candidateId },
    });

    return NextResponse.json({
      success: true,
      message: "Pull request removed successfully",
    });
  } catch (error) {
    console.error("Error deleting contribution:", error);
    return NextResponse.json(
      { error: "Failed to delete contribution" },
      { status: 500 }
    );
  }
}
