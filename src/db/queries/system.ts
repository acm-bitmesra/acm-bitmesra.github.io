import { db, sql } from "@/db";
import { getAdminEmailAllowlist } from "@/config/env";
import { chapterMembers, chapterRoles, blogPosts, chapterEvents, chapterResources, auditLogs, session } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSystemHealthReport() {
  const startTime = Date.now();
  let dbStatus = "HEALTHY";
  let dbLatencyMs = 0;

  try {
    await sql`SELECT 1`;
    dbLatencyMs = Date.now() - startTime;
  } catch (error) {
    dbStatus = "DEGRADED";
    console.error("DB Health Check Error:", error);
  }

  const [
    totalMembers,
    activeMembers,
    superAdmins,
    totalPosts,
    totalEvents,
    totalResources,
    totalAuditLogs,
    activeSessions,
  ] = await Promise.all([
    db.$count(chapterMembers),
    db.$count(chapterMembers, eq(chapterMembers.isActive, true)),
    db.$count(chapterRoles, eq(chapterRoles.key, "SUPER_ADMIN")),
    db.$count(blogPosts),
    db.$count(chapterEvents),
    db.$count(chapterResources),
    db.$count(auditLogs),
    db.$count(session),
  ]);

  const allowlist = getAdminEmailAllowlist();

  return {
    status: dbStatus,
    dbLatencyMs,
    environment: process.env.NODE_ENV || "production",
    allowlist,
    metrics: {
      totalMembers,
      activeMembers,
      superAdmins,
      totalPosts,
      totalEvents,
      totalResources,
      totalAuditLogs,
      activeSessions,
    },
    checkedAt: new Date().toISOString(),
  };
}
