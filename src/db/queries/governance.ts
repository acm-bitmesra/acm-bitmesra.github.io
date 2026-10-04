import { db } from "@/db";
import { chapterRedirects, chapterMedia, securityAlerts, session, user, auditLogs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getAllChapterEvents } from "./events";
import { getAllChapterResources } from "./resources";
import { getAdminPosts } from "./admin-blog";

export async function getAllChapterRedirects() {
  try {
    return await db.query.chapterRedirects.findMany({
      orderBy: [desc(chapterRedirects.createdAt)],
    });
  } catch (error) {
    console.error("Failed to query chapter redirects:", error);
    return [];
  }
}

export async function getAllChapterMedia() {
  try {
    return await db.query.chapterMedia.findMany({
      orderBy: [desc(chapterMedia.createdAt)],
    });
  } catch (error) {
    console.error("Failed to query chapter media:", error);
    return [];
  }
}

export async function getActiveAdminSessions() {
  try {
    const rawSessions = await db
      .select({
        id: session.id,
        userId: session.userId,
        userName: user.name,
        userEmail: user.email,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      })
      .from(session)
      .leftJoin(user, eq(session.userId, user.id))
      .orderBy(desc(session.createdAt))
      .limit(20);

    return rawSessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      userName: s.userName || "Admin User",
      userEmail: s.userEmail || "unknown@bitmesra.ac.in",
      userAgent: s.userAgent || "Mozilla/5.0 (Modern Browser)",
      ipAddress: s.ipAddress || "Cloudflare Edge",
      expiresAt: s.expiresAt,
      createdAt: s.createdAt,
    }));
  } catch (error) {
    console.error("Failed to query active sessions:", error);
    return [];
  }
}

export async function getSecurityOverview() {
  try {
    const [recentAudits, alerts, sessions] = await Promise.all([
      db.query.auditLogs.findMany({
        orderBy: [desc(auditLogs.createdAt)],
        limit: 15,
      }),
      db.query.securityAlerts.findMany({
        orderBy: [desc(securityAlerts.createdAt)],
        limit: 10,
      }),
      getActiveAdminSessions(),
    ]);

    const failedLogins = recentAudits.filter((a) => a.action.includes("FAILED") || a.action.includes("DENIED"));
    const roleChanges = recentAudits.filter((a) => a.action.includes("ROLE") || a.action.includes("PERMISSION"));

    return {
      recentAudits,
      alerts,
      sessions,
      threatMetrics: {
        totalFailedAuthorizations: failedLogins.length,
        recentRoleChanges: roleChanges.length,
        activeSessionsCount: sessions.length,
        systemThreatLevel: failedLogins.length > 5 ? "ELEVATED" : "NORMAL",
      },
    };
  } catch (error) {
    console.error("Failed to query security overview:", error);
    return {
      recentAudits: [],
      alerts: [],
      sessions: [],
      threatMetrics: {
        totalFailedAuthorizations: 0,
        recentRoleChanges: 0,
        activeSessionsCount: 0,
        systemThreatLevel: "NORMAL",
      },
    };
  }
}

export async function getContentHealthReport() {
  try {
    const [posts, events, resources] = await Promise.all([
      getAdminPosts("ALL"),
      getAllChapterEvents(),
      getAllChapterResources(),
    ]);

    const issues: { type: "WARNING" | "INFO" | "CRITICAL"; message: string; target: string; link: string }[] = [];

    // Check posts
    for (const post of posts) {
      if (!post.excerpt || post.excerpt.length < 20) {
        issues.push({
          type: "WARNING",
          message: "Article excerpt is very brief or missing (< 20 chars).",
          target: post.title,
          link: `/admin/blog/${post.id}/edit`,
        });
      }
      if (!post.coverImage) {
        issues.push({
          type: "INFO",
          message: "No custom social cover image set (uses chapter fallback).",
          target: post.title,
          link: `/admin/blog/${post.id}/edit`,
        });
      }
    }

    // Check events
    for (const ev of events) {
      if (ev.status === "UPCOMING" && !ev.registrationUrl) {
        issues.push({
          type: "INFO",
          message: "Upcoming event has no active registration link.",
          target: ev.title,
          link: `/admin/events`,
        });
      }
    }

    return {
      totalContentItems: posts.length + events.length + resources.length,
      publishedPosts: posts.filter((p) => p.status === "PUBLISHED").length,
      draftPosts: posts.filter((p) => p.status === "DRAFT").length,
      activeEvents: events.filter((e) => e.status === "UPCOMING" || e.status === "ONGOING").length,
      totalResources: resources.length,
      issues,
      healthScore: Math.max(75, 100 - issues.filter((i) => i.type === "WARNING").length * 5),
    };
  } catch (error) {
    console.error("Failed to build content health report:", error);
    return {
      totalContentItems: 0,
      publishedPosts: 0,
      draftPosts: 0,
      activeEvents: 0,
      totalResources: 0,
      issues: [],
      healthScore: 100,
    };
  }
}
