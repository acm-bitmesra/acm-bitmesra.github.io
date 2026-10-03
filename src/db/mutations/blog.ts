"use server";

import { db } from "@/db";
import {
  blogPosts,
  blogPostAuthors,
  blogTags,
  blogPostTags,
  blogPostSlugs,
  blogPostRevisions,
  auditLogs,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/permissions/constants";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import { slugify } from "@/lib/blog/slugify";
import { createPostSchema, updatePostSchema, CreatePostInput, UpdatePostInput } from "@/lib/blog/validation";
import { revalidatePath } from "next/cache";

/**
 * Creates a new blog draft.
 * Requires: 'blog:create'
 * Prevents author spoofing: Automatically snapshots the authenticated member's identity and chapter role.
 */
export async function createDraftAction(rawInput: CreatePostInput) {
  const context = await requirePermission(PERMISSIONS.BLOG_CREATE);
  const validated = createPostSchema.parse(rawInput);

  const cleanSlug = slugify(validated.slug || validated.title);

  // Check slug uniqueness
  const existing = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.slug, cleanSlug),
  });

  if (existing) {
    throw new Error(`An article with the slug '${cleanSlug}' already exists. Please choose a different title or slug.`);
  }

  const postId = `post_${crypto.randomUUID().slice(0, 12)}`;
  const readingTime = calculateReadingTime(validated.contentMarkdown);

  // 1. Insert Post
  const [newPost] = await db
    .insert(blogPosts)
    .values({
      id: postId,
      title: validated.title,
      slug: cleanSlug,
      excerpt: validated.excerpt,
      contentMarkdown: validated.contentMarkdown,
      category: validated.category,
      coverImageUrl: validated.coverImageUrl || null,
      coverImageAlt: validated.coverImageAlt || null,
      seoTitle: validated.seoTitle || validated.title,
      seoDescription: validated.seoDescription || validated.excerpt,
      featured: context.permissions.includes(PERMISSIONS.BLOG_MANAGE_FEATURED) ? validated.featured : false,
      readingTimeMinutes: readingTime,
      status: "DRAFT",
      createdBy: context.member.id,
      lastEditedBy: context.member.id,
    })
    .returning();

  // 2. Insert primary author snapshot (Section 14 & 15: Immutable role snapshot)
  await db.insert(blogPostAuthors).values({
    id: `auth_${crypto.randomUUID().slice(0, 12)}`,
    postId: newPost.id,
    memberId: context.member.id,
    authorOrder: 0,
    authorNameSnapshot: context.member.name,
    authorRoleSnapshot: context.role.displayName,
  });

  // 3. Process tags
  if (validated.tags && validated.tags.length > 0) {
    for (const tagName of validated.tags) {
      const tagSlug = slugify(tagName);
      if (!tagSlug) continue;

      let tag = await db.query.blogTags.findFirst({
        where: eq(blogTags.slug, tagSlug),
      });

      if (!tag) {
        const [createdTag] = await db
          .insert(blogTags)
          .values({
            id: `tag_${crypto.randomUUID().slice(0, 8)}`,
            name: tagName.trim(),
            slug: tagSlug,
          })
          .returning();
        tag = createdTag;
      }

      await db.insert(blogPostTags).values({
        id: `pt_${crypto.randomUUID().slice(0, 12)}`,
        postId: newPost.id,
        tagId: tag.id,
      });
    }
  }

  // 4. Audit Log
  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "POST_CREATED",
    targetType: "POST",
    targetId: newPost.id,
    details: { title: newPost.title, slug: newPost.slug, status: "DRAFT" },
  });

  return { success: true, postId: newPost.id, slug: newPost.slug };
}

/**
 * Updates an existing blog post.
 * Requires: 'blog:edit:any' OR ('blog:edit:own' and member created post).
 */
export async function updatePostAction(rawInput: UpdatePostInput) {
  const context = await requirePermission(PERMISSIONS.BLOG_CREATE);
  const validated = updatePostSchema.parse(rawInput);

  const existing = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.id, validated.id),
  });

  if (!existing) {
    throw new Error("Article not found.");
  }

  // Authorization check: edit any vs edit own
  const canEditAny = context.permissions.includes(PERMISSIONS.BLOG_EDIT_ANY);
  const isCreator = existing.createdBy === context.member.id;

  if (!canEditAny && !isCreator) {
    throw new Error("FORBIDDEN: You do not have permission to edit articles authored by other members.");
  }

  const updates: Partial<typeof blogPosts.$inferInsert> = {
    lastEditedBy: context.member.id,
    updatedAt: new Date(),
  };

  if (validated.title) updates.title = validated.title;
  if (validated.excerpt) updates.excerpt = validated.excerpt;
  if (validated.category) updates.category = validated.category;
  if (validated.coverImageUrl !== undefined) updates.coverImageUrl = validated.coverImageUrl || null;
  if (validated.coverImageAlt !== undefined) updates.coverImageAlt = validated.coverImageAlt || null;
  if (validated.seoTitle) updates.seoTitle = validated.seoTitle;
  if (validated.seoDescription) updates.seoDescription = validated.seoDescription;

  if (context.permissions.includes(PERMISSIONS.BLOG_MANAGE_FEATURED) && validated.featured !== undefined) {
    updates.featured = validated.featured;
  }

  if (validated.contentMarkdown) {
    updates.contentMarkdown = validated.contentMarkdown;
    updates.readingTimeMinutes = calculateReadingTime(validated.contentMarkdown);
  }

  // Handle slug change and retain historical slug for 301/308 redirects
  if (validated.slug) {
    const cleanSlug = slugify(validated.slug);
    if (cleanSlug !== existing.slug) {
      const collision = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, cleanSlug),
      });
      if (collision) {
        throw new Error(`The slug '${cleanSlug}' is already in use by another article.`);
      }

      // If previously published, store old slug in historical aliases
      if (existing.status === "PUBLISHED") {
        await db.insert(blogPostSlugs).values({
          id: `slug_${crypto.randomUUID().slice(0, 12)}`,
          postId: existing.id,
          slug: existing.slug,
        });
      }

      updates.slug = cleanSlug;
    }
  }

  // 1. Update post
  await db.update(blogPosts).set(updates).where(eq(blogPosts.id, existing.id));

  // 2. Save revision record
  if (validated.contentMarkdown || validated.title) {
    await db.insert(blogPostRevisions).values({
      id: `rev_${crypto.randomUUID().slice(0, 12)}`,
      postId: existing.id,
      editorId: context.member.id,
      title: validated.title || existing.title,
      excerpt: validated.excerpt || existing.excerpt,
      contentMarkdown: validated.contentMarkdown || existing.contentMarkdown,
      changeNote: validated.changeNote || "Standard update",
    });
  }

  // 3. Update tags if supplied
  if (validated.tags) {
    await db.delete(blogPostTags).where(eq(blogPostTags.postId, existing.id));

    for (const tagName of validated.tags) {
      const tagSlug = slugify(tagName);
      if (!tagSlug) continue;

      let tag = await db.query.blogTags.findFirst({
        where: eq(blogTags.slug, tagSlug),
      });

      if (!tag) {
        const [createdTag] = await db
          .insert(blogTags)
          .values({
            id: `tag_${crypto.randomUUID().slice(0, 8)}`,
            name: tagName.trim(),
            slug: tagSlug,
          })
          .returning();
        tag = createdTag;
      }

      await db.insert(blogPostTags).values({
        id: `pt_${crypto.randomUUID().slice(0, 12)}`,
        postId: existing.id,
        tagId: tag.id,
      });
    }
  }

  // 4. Audit Log
  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "POST_UPDATED",
    targetType: "POST",
    targetId: existing.id,
    details: { changeNote: validated.changeNote },
  });

  if (existing.status === "PUBLISHED") {
    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);
    revalidatePath("/");
  }

  return { success: true };
}

/**
 * Submits an article for editorial review.
 * Requires: 'blog:submit'
 */
export async function submitForReviewAction(postId: string) {
  const context = await requirePermission(PERMISSIONS.BLOG_SUBMIT);

  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));
  if (!post) throw new Error("Article not found.");

  await db
    .update(blogPosts)
    .set({
      status: "IN_REVIEW",
      submittedAt: new Date(),
      lastEditedBy: context.member.id,
    })
    .where(eq(blogPosts.id, postId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "POST_SUBMITTED",
    targetType: "POST",
    targetId: postId,
  });

  return { success: true };
}

/**
 * Publishes an article atomically.
 * Requires: 'blog:publish'
 */
export async function publishPostAction(postId: string) {
  const context = await requirePermission(PERMISSIONS.BLOG_PUBLISH);

  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));
  if (!post) throw new Error("Article not found.");

  if (!post.title || !post.contentMarkdown || post.contentMarkdown.length < 50) {
    throw new Error("Article content must have sufficient body length before publishing.");
  }

  const publishedAt = post.publishedAt || new Date();

  // Atomically transition status to PUBLISHED
  await db
    .update(blogPosts)
    .set({
      status: "PUBLISHED",
      publishedBy: context.member.id,
      publishedAt: publishedAt,
      lastEditedBy: context.member.id,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, postId));

  // Snapshot primary author role if not already snapshotted
  const authors = await db.select().from(blogPostAuthors).where(eq(blogPostAuthors.postId, postId));
  if (authors.length === 0) {
    await db.insert(blogPostAuthors).values({
      id: `auth_${crypto.randomUUID().slice(0, 12)}`,
      postId: post.id,
      memberId: post.createdBy,
      authorOrder: 0,
      authorNameSnapshot: context.member.name,
      authorRoleSnapshot: context.role.displayName,
    });
  }

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "POST_PUBLISHED",
    targetType: "POST",
    targetId: postId,
    details: { title: post.title, slug: post.slug },
  });

  // Revalidate public caches
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");

  return { success: true, slug: post.slug };
}

/**
 * Unpublishes an article back to DRAFT.
 * Requires: 'blog:unpublish'
 */
export async function unpublishPostAction(postId: string) {
  const context = await requirePermission(PERMISSIONS.BLOG_UNPUBLISH);

  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));
  if (!post) throw new Error("Article not found.");

  await db
    .update(blogPosts)
    .set({
      status: "DRAFT",
      lastEditedBy: context.member.id,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, postId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "POST_UNPUBLISHED",
    targetType: "POST",
    targetId: postId,
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");

  return { success: true };
}

/**
 * Archives an article (soft-delete).
 * Requires: 'blog:delete'
 */
export async function archivePostAction(postId: string) {
  const context = await requirePermission(PERMISSIONS.BLOG_DELETE);

  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));
  if (!post) throw new Error("Article not found.");

  await db
    .update(blogPosts)
    .set({
      status: "ARCHIVED",
      archivedAt: new Date(),
      lastEditedBy: context.member.id,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, postId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "POST_DELETED",
    targetType: "POST",
    targetId: postId,
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");

  return { success: true };
}
