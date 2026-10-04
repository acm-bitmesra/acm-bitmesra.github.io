"use server";

import { db } from "@/db";
import { chapterSponsors, auditLogs, SponsorTier } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/permissions/constants";
import { revalidatePath } from "next/cache";

export async function createSponsorAction(input: {
  name: string;
  tier: SponsorTier;
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  year?: string;
  displayOrder?: number;
}) {
  const context = await requirePermission(PERMISSIONS.SPONSORS_MANAGE);

  const [sponsor] = await db
    .insert(chapterSponsors)
    .values({
      id: `sp_${crypto.randomUUID().slice(0, 12)}`,
      name: input.name.trim(),
      tier: input.tier,
      logoUrl: input.logoUrl.trim(),
      websiteUrl: input.websiteUrl?.trim() || null,
      description: input.description?.trim() || null,
      year: input.year || "2026",
      displayOrder: input.displayOrder || 0,
      active: true,
    })
    .returning();

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "SPONSOR_CREATED",
    targetType: "SPONSOR",
    targetId: sponsor.id,
    details: { name: sponsor.name, tier: sponsor.tier },
  });

  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
  return { success: true, id: sponsor.id };
}

export async function deleteSponsorAction(id: string) {
  const context = await requirePermission(PERMISSIONS.SPONSORS_MANAGE);

  await db.delete(chapterSponsors).where(eq(chapterSponsors.id, id));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "SPONSOR_DELETED",
    targetType: "SPONSOR",
    targetId: id,
    details: { deletedAt: new Date().toISOString() },
  });

  revalidatePath("/sponsors");
  revalidatePath("/admin/sponsors");
  return { success: true };
}
