import { db } from "@/db";
import {
  academicBatches,
  chapterEvents,
  connectedAccounts,
  contributionCandidates,
  eventLeaderboards,
  eventRegistrations,
  eventTeamMembers,
  eventTeams,
  studentProfiles,
  user,
} from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import type { CandidateReviewStatus, RegistrationStatus } from "@/db/schema/event-registrations";

export async function getUserRegistrationsWithEvents(userId: string) {
  try {
    const registrations = await db
      .select({
        id: eventRegistrations.id,
        eventId: eventRegistrations.eventId,
        userId: eventRegistrations.userId,
        status: eventRegistrations.status,
        teamId: eventRegistrations.teamId,
        registeredAt: eventRegistrations.registeredAt,
        checkedInAt: eventRegistrations.checkedInAt,
        event: {
          id: chapterEvents.id,
          slug: chapterEvents.slug,
          title: chapterEvents.title,
          category: chapterEvents.category,
          startDate: chapterEvents.startDate,
          endDate: chapterEvents.endDate,
          location: chapterEvents.location,
          status: chapterEvents.status,
        },
      })
      .from(eventRegistrations)
      .innerJoin(chapterEvents, eq(eventRegistrations.eventId, chapterEvents.id))
      .where(eq(eventRegistrations.userId, userId))
      .orderBy(desc(eventRegistrations.registeredAt));

    const results = [];
    for (const reg of registrations) {
      let team = null;
      if (reg.teamId) {
        const [t] = await db
          .select()
          .from(eventTeams)
          .where(eq(eventTeams.id, reg.teamId))
          .limit(1);

        if (t) {
          const members = await db
            .select({
              id: eventTeamMembers.id,
              role: eventTeamMembers.role,
              user: {
                name: user.name,
                email: user.email,
              },
            })
            .from(eventTeamMembers)
            .innerJoin(user, eq(eventTeamMembers.userId, user.id))
            .where(eq(eventTeamMembers.teamId, t.id));

          team = {
            ...t,
            members,
          };
        }
      }

      results.push({
        ...reg,
        team,
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    return [];
  }
}

export async function getUserEventRegistration(eventId: string, userId: string) {
  try {
    const [reg] = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.userId, userId)
        )
      )
      .limit(1);

    if (!reg) return null;

    let team = null;
    if (reg.teamId) {
      const [t] = await db
        .select()
        .from(eventTeams)
        .where(eq(eventTeams.id, reg.teamId))
        .limit(1);

      if (t) {
        const members = await db
          .select({
            id: eventTeamMembers.id,
            role: eventTeamMembers.role,
            user: {
              name: user.name,
              email: user.email,
            },
          })
          .from(eventTeamMembers)
          .innerJoin(user, eq(eventTeamMembers.userId, user.id))
          .where(eq(eventTeamMembers.teamId, t.id));

        team = {
          ...t,
          members,
        };
      }
    }

    return {
      ...reg,
      team,
    };
  } catch (error) {
    console.error("Error fetching user event registration:", error);
    return null;
  }
}

export async function getEventRegistrations(eventId: string) {
  try {
    const registrations = await db
      .select({
        id: eventRegistrations.id,
        eventId: eventRegistrations.eventId,
        userId: eventRegistrations.userId,
        status: eventRegistrations.status,
        teamId: eventRegistrations.teamId,
        customAnswers: eventRegistrations.customAnswers,
        notes: eventRegistrations.notes,
        registeredAt: eventRegistrations.registeredAt,
        checkedInAt: eventRegistrations.checkedInAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(eventRegistrations)
      .innerJoin(user, eq(eventRegistrations.userId, user.id))
      .where(eq(eventRegistrations.eventId, eventId))
      .orderBy(desc(eventRegistrations.registeredAt));

    if (registrations.length === 0) return [];

    const userIds = registrations.map((r) => r.userId);
    const teamIds = registrations.map((r) => r.teamId).filter(Boolean) as string[];

    // Batch query student profiles
    const profiles = await db
      .select({
        userId: studentProfiles.userId,
        slug: studentProfiles.slug,
        displayName: studentProfiles.displayName,
        department: studentProfiles.department,
        academicProgram: studentProfiles.academicProgram,
        batchId: studentProfiles.batchId,
        portfolioBlocks: studentProfiles.portfolioBlocks,
      })
      .from(studentProfiles)
      .where(inArray(studentProfiles.userId, userIds));

    const profileMap = new Map<string, (typeof profiles)[number]>();
    for (const p of profiles) {
      profileMap.set(p.userId, p);
    }

    // Batch query batches
    const batchIds = profiles.map((p) => p.batchId).filter(Boolean) as string[];
    const batches =
      batchIds.length > 0
        ? await db
            .select({
              id: academicBatches.id,
              label: academicBatches.label,
              endYear: academicBatches.endYear,
            })
            .from(academicBatches)
            .where(inArray(academicBatches.id, batchIds))
        : [];
    const batchMap = new Map<string, (typeof batches)[number]>();
    for (const b of batches) {
      batchMap.set(b.id, b);
    }

    // Batch query connected accounts
    const accounts = await db
      .select({
        userId: connectedAccounts.userId,
        provider: connectedAccounts.provider,
        handle: connectedAccounts.handle,
        profileUrl: connectedAccounts.profileUrl,
        isVerified: connectedAccounts.isVerified,
      })
      .from(connectedAccounts)
      .where(inArray(connectedAccounts.userId, userIds));

    const accountsMap = new Map<string, typeof accounts>();
    for (const a of accounts) {
      const list = accountsMap.get(a.userId) || [];
      list.push(a);
      accountsMap.set(a.userId, list);
    }

    // Batch query teams
    const teams =
      teamIds.length > 0
        ? await db
            .select()
            .from(eventTeams)
            .where(inArray(eventTeams.id, teamIds))
        : [];
    const teamMap = new Map<string, (typeof teams)[number]>();
    for (const t of teams) {
      teamMap.set(t.id, t);
    }

    return registrations.map((reg) => {
      const profile = profileMap.get(reg.userId);
      const batch = profile?.batchId ? batchMap.get(profile.batchId) : null;
      const userAccounts = accountsMap.get(reg.userId) || [];
      const team = reg.teamId ? teamMap.get(reg.teamId) || null : null;

      // Extract phone/contact number
      const settingsBlock = profile?.portfolioBlocks?.find(
        (b) => b.type === "settings"
      );
      const settings = (settingsBlock?.content || {}) as { contactNo?: string };
      const contactNo =
        (reg.customAnswers?.contactNo as string) ||
        (reg.customAnswers?.phone as string) ||
        (reg.customAnswers?.phoneNumber as string) ||
        settings.contactNo ||
        "";

      // Extract GitHub handle
      const ghAccount = userAccounts.find((a) => a.provider === "github");
      const githubHandle =
        (reg.customAnswers?.githubHandle as string) ||
        ghAccount?.handle ||
        "";

      return {
        ...reg,
        contactNo,
        githubHandle,
        profile: profile
          ? {
              slug: profile.slug,
              displayName: profile.displayName,
              department: profile.department,
              academicProgram: profile.academicProgram,
              batch: batch?.label || null,
            }
          : null,
        connectedAccounts: userAccounts,
        team,
      };
    });
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return [];
  }
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: RegistrationStatus,
  notes?: string
) {
  const [updated] = await db
    .update(eventRegistrations)
    .set({
      status,
      checkedInAt: status === "CHECKED_IN" ? new Date() : undefined,
      notes: notes !== undefined ? notes : undefined,
    })
    .where(eq(eventRegistrations.id, registrationId))
    .returning();
  return updated;
}

export async function registerForEvent(
  eventId: string,
  userId: string,
  customAnswers?: Record<string, unknown>,
  teamId?: string
) {
  const regId = `reg_${eventId.slice(0, 8)}_${userId.slice(0, 8)}_${Date.now().toString(36)}`;
  const now = new Date();

  return await db
    .insert(eventRegistrations)
    .values({
      id: regId,
      eventId,
      userId,
      status: "REGISTERED",
      teamId,
      customAnswers: customAnswers || {},
      registeredAt: now,
    })
    .onConflictDoUpdate({
      target: [eventRegistrations.eventId, eventRegistrations.userId],
      set: {
        status: "REGISTERED",
        teamId,
        customAnswers: customAnswers || {},
      },
    });
}

export async function cancelRegistration(eventId: string, userId: string) {
  return await db
    .update(eventRegistrations)
    .set({
      status: "CANCELLED",
    })
    .where(
      and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.userId, userId)
      )
    );
}

export async function createEventTeam(eventId: string, leaderUserId: string, name: string) {
  const teamId = `team_${eventId.slice(0, 8)}_${Date.now().toString(36)}`;
  const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const now = new Date();

  const [createdTeam] = await db
    .insert(eventTeams)
    .values({
      id: teamId,
      eventId,
      name,
      joinCode,
      leaderUserId,
      createdAt: now,
    })
    .returning();

  const memberId = `tm_${teamId.slice(0, 8)}_${leaderUserId.slice(0, 8)}`;
  await db.insert(eventTeamMembers).values({
    id: memberId,
    teamId,
    userId: leaderUserId,
    role: "LEADER",
    joinedAt: now,
  });

  await registerForEvent(eventId, leaderUserId, {}, teamId);

  return createdTeam;
}

export async function joinEventTeam(joinCode: string, userId: string) {
  const [team] = await db
    .select()
    .from(eventTeams)
    .where(eq(eventTeams.joinCode, joinCode.trim().toUpperCase()))
    .limit(1);

  if (!team) {
    throw new Error("Invalid team code. Please verify with your team leader.");
  }

  const [existingMember] = await db
    .select()
    .from(eventTeamMembers)
    .where(
      and(
        eq(eventTeamMembers.teamId, team.id),
        eq(eventTeamMembers.userId, userId)
      )
    )
    .limit(1);

  if (existingMember) {
    return team;
  }

  const memberId = `tm_${team.id.slice(0, 8)}_${userId.slice(0, 8)}`;
  await db.insert(eventTeamMembers).values({
    id: memberId,
    teamId: team.id,
    userId,
    role: "MEMBER",
    joinedAt: new Date(),
  });

  await registerForEvent(team.eventId, userId, {}, team.id);

  return team;
}

export async function checkInAttendee(registrationId: string) {
  return await db
    .update(eventRegistrations)
    .set({
      checkedInAt: new Date(),
      status: "CHECKED_IN",
    })
    .where(eq(eventRegistrations.id, registrationId));
}

export async function getEventLeaderboard(eventId: string) {
  try {
    const [lb] = await db
      .select()
      .from(eventLeaderboards)
      .where(
        and(
          eq(eventLeaderboards.eventId, eventId),
          eq(eventLeaderboards.isPublished, true)
        )
      )
      .orderBy(desc(eventLeaderboards.snapshotVersion))
      .limit(1);

    return lb || null;
  } catch (error) {
    console.error("Error fetching event leaderboard:", error);
    return null;
  }
}

export async function getContributionCandidates(eventId: string) {
  try {
    return await db
      .select()
      .from(contributionCandidates)
      .where(eq(contributionCandidates.eventId, eventId))
      .orderBy(desc(contributionCandidates.prCreatedAt));
  } catch (error) {
    console.error("Error fetching contribution candidates:", error);
    return [];
  }
}

export async function updateCandidateReview(
  candidateId: string,
  reviewStatus: CandidateReviewStatus,
  assignedScore: number,
  reviewerNotes?: string,
  reviewedBy?: string
) {
  return await db
    .update(contributionCandidates)
    .set({
      reviewStatus,
      assignedScore,
      reviewerNotes,
      reviewedBy,
      reviewedAt: new Date(),
    })
    .where(eq(contributionCandidates.id, candidateId));
}

export interface UserAcmRankingInfo {
  rank: number;
  totalParticipants: number;
  eventTitle: string;
  eventSlug: string;
  approvedPrs: number;
  totalPrs: number;
  totalScore: number;
  tier: string;
}

export async function getUserAcmRankings(userId: string): Promise<UserAcmRankingInfo | null> {
  try {
    const userRegs = await getUserRegistrationsWithEvents(userId);
    if (!userRegs || userRegs.length === 0) return null;

    // Prioritize hacktoberfest-2026 or first active registration
    const activeReg = userRegs.find((r) => r.event.slug === "hacktoberfest-2026") || userRegs[0];
    if (!activeReg) return null;

    const [allRegs, candidates] = await Promise.all([
      getEventRegistrations(activeReg.event.id),
      getContributionCandidates(activeReg.event.id),
    ]);

    const rawScores = allRegs.map((reg) => {
      const userCandidates = candidates.filter((c) => c.userId === reg.userId);
      const approvedCandidates = userCandidates.filter((c) => c.reviewStatus === "APPROVED");
      const totalScore = approvedCandidates.reduce((acc, c) => acc + (c.assignedScore || 0), 0);
      return {
        userId: reg.userId,
        totalScore,
        approvedPrs: approvedCandidates.length,
        totalPrs: userCandidates.length,
        registeredAt: new Date(reg.registeredAt).getTime(),
      };
    });

    rawScores.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.approvedPrs !== a.approvedPrs) return b.approvedPrs - a.approvedPrs;
      if (b.totalPrs !== a.totalPrs) return b.totalPrs - a.totalPrs;
      return a.registeredAt - b.registeredAt;
    });

    const userIndex = rawScores.findIndex((s) => s.userId === userId);
    if (userIndex === -1) return null;

    const userStanding = rawScores[userIndex];
    const rank = userIndex + 1;

    let tier = "Contender";
    if (rank === 1) tier = "Grandmaster #1";
    else if (rank <= 3) tier = "Top 3 Podium";
    else if (rank <= 10) tier = "Top 10 Finalist";
    else tier = "Active Competitor";

    return {
      rank,
      totalParticipants: allRegs.length,
      eventTitle: activeReg.event.title,
      eventSlug: activeReg.event.slug,
      approvedPrs: userStanding.approvedPrs,
      totalPrs: userStanding.totalPrs,
      totalScore: userStanding.totalScore,
      tier,
    };
  } catch (error) {
    console.error("Error computing user ACM rankings:", error);
    return null;
  }
}

export async function getUserContributions(eventId: string, userId: string) {
  try {
    return await db
      .select()
      .from(contributionCandidates)
      .where(
        and(
          eq(contributionCandidates.eventId, eventId),
          eq(contributionCandidates.userId, userId)
        )
      )
      .orderBy(desc(contributionCandidates.createdAt));
  } catch (error) {
    console.error("Error fetching user contributions:", error);
    return [];
  }
}

export async function deleteUserContribution(
  eventId: string,
  userId: string,
  candidateId: string
) {
  try {
    const [existing] = await db
      .select()
      .from(contributionCandidates)
      .where(
        and(
          eq(contributionCandidates.id, candidateId),
          eq(contributionCandidates.eventId, eventId),
          eq(contributionCandidates.userId, userId)
        )
      )
      .limit(1);

    if (!existing) {
      return { success: false, error: "Candidate not found or unauthorized" };
    }

    await db
      .delete(contributionCandidates)
      .where(eq(contributionCandidates.id, candidateId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting contribution candidate:", error);
    return { success: false, error: "Database deletion failed" };
  }
}

