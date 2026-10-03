import { db } from "@/db";
import {
  blogPosts,
  blogPostAuthors,
  blogTags,
  blogPostTags,
  chapterMembers,
  auditLogs,
  BlogPostStatus,
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface AdminPostListItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: BlogPostStatus;
  featured: boolean;
  readingTimeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  createdByMember: {
    id: string;
    name: string;
    email: string;
  };
}

export async function getAdminPosts(
  statusFilter?: BlogPostStatus | "ALL"
): Promise<AdminPostListItem[]> {
  const query = db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      category: blogPosts.category,
      status: blogPosts.status,
      featured: blogPosts.featured,
      readingTimeMinutes: blogPosts.readingTimeMinutes,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      publishedAt: blogPosts.publishedAt,
      createdById: chapterMembers.id,
      createdByName: chapterMembers.name,
      createdByEmail: chapterMembers.email,
    })
    .from(blogPosts)
    .innerJoin(chapterMembers, eq(blogPosts.createdBy, chapterMembers.id))
    .orderBy(desc(blogPosts.updatedAt));

  const rows = statusFilter && statusFilter !== "ALL"
    ? await query.where(eq(blogPosts.status, statusFilter))
    : await query;

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    category: r.category,
    status: r.status,
    featured: r.featured,
    readingTimeMinutes: r.readingTimeMinutes,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    publishedAt: r.publishedAt,
    createdByMember: {
      id: r.createdById,
      name: r.createdByName,
      email: r.createdByEmail,
    },
  }));
}

export async function getAdminPostById(id: string) {
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  if (!post) return null;

  // Authors
  const authors = await db
    .select({
      memberId: blogPostAuthors.memberId,
      name: blogPostAuthors.authorNameSnapshot,
      role: blogPostAuthors.authorRoleSnapshot,
      order: blogPostAuthors.authorOrder,
    })
    .from(blogPostAuthors)
    .where(eq(blogPostAuthors.postId, post.id))
    .orderBy(blogPostAuthors.authorOrder);

  // Tags
  const tags = await db
    .select({
      id: blogTags.id,
      name: blogTags.name,
      slug: blogTags.slug,
    })
    .from(blogPostTags)
    .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
    .where(eq(blogPostTags.postId, post.id));

  return {
    ...post,
    authors,
    tags: tags.map((t) => t.name),
  };
}

export async function getAdminMetrics() {
  const [counts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where status = 'PUBLISHED')::int`,
      inReview: sql<number>`count(*) filter (where status = 'IN_REVIEW')::int`,
      drafts: sql<number>`count(*) filter (where status = 'DRAFT')::int`,
      archived: sql<number>`count(*) filter (where status = 'ARCHIVED')::int`,
    })
    .from(blogPosts);

  const [membersCount] = await db
    .select({
      totalAuthors: sql<number>`count(*)::int`,
    })
    .from(chapterMembers)
    .where(eq(chapterMembers.isActive, true));

  return {
    total: counts?.total ?? 0,
    published: counts?.published ?? 0,
    inReview: counts?.inReview ?? 0,
    drafts: counts?.drafts ?? 0,
    archived: counts?.archived ?? 0,
    totalAuthors: membersCount?.totalAuthors ?? 0,
  };
}

export async function getRecentAuditLogs(limit: number = 10) {
  return await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      targetType: auditLogs.targetType,
      targetId: auditLogs.targetId,
      details: auditLogs.details,
      createdAt: auditLogs.createdAt,
      memberName: chapterMembers.name,
    })
    .from(auditLogs)
    .leftJoin(chapterMembers, eq(auditLogs.memberId, chapterMembers.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
}
