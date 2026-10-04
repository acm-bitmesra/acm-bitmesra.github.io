import { db } from "@/db";
import { auditLogs, chapterMembers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getAuditLogs(limit = 50, filterAction?: string) {
  try {
    const logs = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        targetType: auditLogs.targetType,
        targetId: auditLogs.targetId,
        details: auditLogs.details,
        ipAddress: auditLogs.ipAddress,
        createdAt: auditLogs.createdAt,
        memberId: auditLogs.memberId,
        memberName: chapterMembers.name,
        memberEmail: chapterMembers.email,
      })
      .from(auditLogs)
      .leftJoin(chapterMembers, eq(auditLogs.memberId, chapterMembers.id))
      .where(filterAction ? eq(auditLogs.action, filterAction) : undefined)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);

    return logs;
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
}
