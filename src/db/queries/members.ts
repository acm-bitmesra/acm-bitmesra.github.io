import { db } from "@/db";
import { chapterMembers, chapterRoles } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getAllChapterMembers() {
  const members = await db
    .select({
      id: chapterMembers.id,
      name: chapterMembers.name,
      email: chapterMembers.email,
      avatarUrl: chapterMembers.avatarUrl,
      roleId: chapterMembers.roleId,
      status: chapterMembers.status,
      isActive: chapterMembers.isActive,
      termStart: chapterMembers.termStart,
      createdAt: chapterMembers.createdAt,
      roleName: chapterRoles.displayName,
      roleDisplayName: chapterRoles.displayName,
      roleTier: chapterRoles.hierarchyLevel,
    })
    .from(chapterMembers)
    .innerJoin(chapterRoles, eq(chapterMembers.roleId, chapterRoles.id))
    .orderBy(asc(chapterRoles.hierarchyLevel), asc(chapterMembers.name));

  return members;
}

export async function getAllChapterRoles() {
  return await db
    .select()
    .from(chapterRoles)
    .where(eq(chapterRoles.active, true))
    .orderBy(asc(chapterRoles.hierarchyLevel));
}
