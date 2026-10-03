import { db } from "@/db";
import {
  blogPosts,
  blogPostAuthors,
  blogTags,
  blogPostTags,
  blogPostSlugs,
} from "@/db/schema";
import { eq, and, desc, sql, ilike, or, inArray } from "drizzle-orm";

export interface PublishedPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  featured: boolean;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  readingTimeMinutes: number;
  publishedAt: Date | null;
  authors: {
    name: string;
    role: string;
  }[];
  tags: {
    name: string;
    slug: string;
  }[];
}

export interface PublishedPostDetail extends PublishedPostListItem {
  contentMarkdown: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  updatedAt: Date;
}

/**
 * Retrieves published posts for the public blog index and homepage.
 * STRICT SECURITY: Only queries `status = 'PUBLISHED'`.
 */
export async function getPublishedPosts(options?: {
  limit?: number;
  offset?: number;
  category?: string;
  tag?: string;
  search?: string;
  featuredOnly?: boolean;
}): Promise<PublishedPostListItem[]> {
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  // Base condition: strictly PUBLISHED
  const conditions = [eq(blogPosts.status, "PUBLISHED")];

  if (options?.category) {
    conditions.push(eq(blogPosts.category, options.category));
  }

  if (options?.featuredOnly) {
    conditions.push(eq(blogPosts.featured, true));
  }

  if (options?.search) {
    const q = `%${options.search.trim()}%`;
    conditions.push(
      or(
        ilike(blogPosts.title, q),
        ilike(blogPosts.excerpt, q),
        ilike(blogPosts.category, q)
      )!
    );
  }

  // If filtered by tag, resolve matching post IDs first
  if (options?.tag) {
    const matchingTag = await db.query.blogTags.findFirst({
      where: eq(blogTags.slug, options.tag),
    });

    if (matchingTag) {
      const postTagRows = await db
        .select({ postId: blogPostTags.postId })
        .from(blogPostTags)
        .where(eq(blogPostTags.tagId, matchingTag.id));

      const postIds = postTagRows.map((r) => r.postId);
      if (postIds.length === 0) return [];
      conditions.push(inArray(blogPosts.id, postIds));
    } else {
      return [];
    }
  }

  const posts = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      category: blogPosts.category,
      featured: blogPosts.featured,
      coverImageUrl: blogPosts.coverImageUrl,
      coverImageAlt: blogPosts.coverImageAlt,
      readingTimeMinutes: blogPosts.readingTimeMinutes,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(and(...conditions))
    .orderBy(desc(blogPosts.featured), desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset);

  if (posts.length === 0) return [];

  const postIds = posts.map((p) => p.id);

  // Fetch authors with historical snapshots
  const authorRows = await db
    .select({
      postId: blogPostAuthors.postId,
      name: blogPostAuthors.authorNameSnapshot,
      role: blogPostAuthors.authorRoleSnapshot,
      order: blogPostAuthors.authorOrder,
    })
    .from(blogPostAuthors)
    .where(inArray(blogPostAuthors.postId, postIds))
    .orderBy(blogPostAuthors.authorOrder);

  // Fetch tags
  const tagRows = await db
    .select({
      postId: blogPostTags.postId,
      name: blogTags.name,
      slug: blogTags.slug,
    })
    .from(blogPostTags)
    .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
    .where(inArray(blogPostTags.postId, postIds));

  const authorMap = new Map<string, { name: string; role: string }[]>();
  for (const a of authorRows) {
    const list = authorMap.get(a.postId) || [];
    list.push({ name: a.name, role: a.role });
    authorMap.set(a.postId, list);
  }

  const tagMap = new Map<string, { name: string; slug: string }[]>();
  for (const t of tagRows) {
    const list = tagMap.get(t.postId) || [];
    list.push({ name: t.name, slug: t.slug });
    tagMap.set(t.postId, list);
  }

  return posts.map((p) => ({
    ...p,
    authors: authorMap.get(p.id) || [{ name: "ACM BIT Mesra", role: "Student Chapter" }],
    tags: tagMap.get(p.id) || [],
  }));
}

/**
 * Retrieves a single published post by slug.
 * Checks historical slug redirect mapping if the active slug has changed.
 */
export async function getPublishedPostBySlug(slug: string): Promise<{
  post?: PublishedPostDetail;
  redirectSlug?: string;
}> {
  // 1. Direct query by current slug
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "PUBLISHED")))
    .limit(1);

  if (post) {
    // Fetch author snapshots
    const authorRows = await db
      .select({
        name: blogPostAuthors.authorNameSnapshot,
        role: blogPostAuthors.authorRoleSnapshot,
      })
      .from(blogPostAuthors)
      .where(eq(blogPostAuthors.postId, post.id))
      .orderBy(blogPostAuthors.authorOrder);

    // Fetch tags
    const tagRows = await db
      .select({
        name: blogTags.name,
        slug: blogTags.slug,
      })
      .from(blogPostTags)
      .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
      .where(eq(blogPostTags.postId, post.id));

    return {
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        contentMarkdown: post.contentMarkdown,
        category: post.category,
        featured: post.featured,
        coverImageUrl: post.coverImageUrl,
        coverImageAlt: post.coverImageAlt,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        canonicalUrl: post.canonicalUrl,
        readingTimeMinutes: post.readingTimeMinutes,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        authors: authorRows.length > 0 ? authorRows : [{ name: "ACM BIT Mesra", role: "Student Chapter" }],
        tags: tagRows,
      },
    };
  }

  // 2. Check historical slugs table for redirects
  const [historicalSlug] = await db
    .select({ postId: blogPostSlugs.postId })
    .from(blogPostSlugs)
    .where(eq(blogPostSlugs.slug, slug))
    .limit(1);

  if (historicalSlug) {
    const [targetPost] = await db
      .select({ slug: blogPosts.slug })
      .from(blogPosts)
      .where(and(eq(blogPosts.id, historicalSlug.postId), eq(blogPosts.status, "PUBLISHED")))
      .limit(1);

    if (targetPost) {
      return { redirectSlug: targetPost.slug };
    }
  }

  return {};
}

/**
 * Retrieves related published posts by category or shared tags.
 */
export async function getRelatedPosts(
  postId: string,
  category: string,
  limit: number = 3
): Promise<PublishedPostListItem[]> {
  const posts = await getPublishedPosts({ category, limit: limit + 1 });
  return posts.filter((p) => p.id !== postId).slice(0, limit);
}

/**
 * Returns all active tags with their published article count.
 */
export async function getPublishedTags(): Promise<{ name: string; slug: string; count: number }[]> {
  const rows = await db
    .select({
      name: blogTags.name,
      slug: blogTags.slug,
      count: sql<number>`count(${blogPostTags.postId})::int`,
    })
    .from(blogTags)
    .innerJoin(blogPostTags, eq(blogTags.id, blogPostTags.tagId))
    .innerJoin(blogPosts, eq(blogPostTags.postId, blogPosts.id))
    .where(eq(blogPosts.status, "PUBLISHED"))
    .groupBy(blogTags.id, blogTags.name, blogTags.slug)
    .orderBy(desc(sql`count(${blogPostTags.postId})`));

  return rows;
}

/**
 * Returns all categories with their published article count.
 */
export async function getPublishedCategories(): Promise<{ category: string; count: number }[]> {
  const rows = await db
    .select({
      category: blogPosts.category,
      count: sql<number>`count(*)::int`,
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, "PUBLISHED"))
    .groupBy(blogPosts.category)
    .orderBy(desc(sql`count(*)`));

  return rows;
}
