"use server";

import { db } from "@/db";
import { chapterRedirects, session, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission, requireSuperAdmin } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/permissions/constants";
import { revalidatePath } from "next/cache";

export async function createRedirectAction(input: {
  sourcePath: string;
  targetUrl: string;
  statusCode?: number;
  reason?: string;
}) {
  const context = await requirePermission(PERMISSIONS.REDIRECTS_CREATE);

  let cleanSource = input.sourcePath.trim();
  if (!cleanSource.startsWith("/")) cleanSource = "/" + cleanSource;

  // Prevent self-redirect loops
  if (cleanSource === input.targetUrl.trim()) {
    throw new Error("Self-redirect loop detected: source cannot match target.");
  }

  const [redirect] = await db
    .insert(chapterRedirects)
    .values({
      id: `red_${crypto.randomUUID().slice(0, 12)}`,
      sourcePath: cleanSource,
      targetUrl: input.targetUrl.trim(),
      statusCode: input.statusCode || 307,
      reason: input.reason?.trim() || null,
      active: true,
    })
    .returning();

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "REDIRECT_CREATED",
    targetType: "REDIRECT",
    targetId: redirect.id,
    details: { source: redirect.sourcePath, target: redirect.targetUrl },
  });

  revalidatePath("/admin/redirects");
  return { success: true, id: redirect.id };
}

export async function deleteRedirectAction(id: string) {
  const context = await requirePermission(PERMISSIONS.REDIRECTS_DELETE);

  await db.delete(chapterRedirects).where(eq(chapterRedirects.id, id));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "REDIRECT_DELETED",
    targetType: "REDIRECT",
    targetId: id,
    details: { deletedAt: new Date().toISOString() },
  });

  revalidatePath("/admin/redirects");
  return { success: true };
}

export async function revokeSessionAction(sessionId: string) {
  const context = await requireSuperAdmin();

  await db.delete(session).where(eq(session.id, sessionId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "SESSION_REVOKED_BY_ADMIN",
    targetType: "SESSION",
    targetId: sessionId,
    details: { revokedAt: new Date().toISOString() },
  });

  revalidatePath("/admin/security");
  revalidatePath("/admin/security/sessions");
  return { success: true };
}
