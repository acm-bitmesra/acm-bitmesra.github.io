import { db } from "@/db";
import { academicBatches, connectedAccounts, studentProfiles, user } from "@/db/schema";
import { eq, and, ne, asc } from "drizzle-orm";
import type { ConnectedProvider, PersonalBlogPost } from "@/db/schema/students";

export async function getStudentProfileByUserId(userId: string) {
  try {
    const [profile] = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, userId))
      .limit(1);

    if (!profile) return null;

    let batch = null;
    if (profile.batchId) {
      const [b] = await db
        .select()
        .from(academicBatches)
        .where(eq(academicBatches.id, profile.batchId))
        .limit(1);
      batch = b || null;
    }

    return {
      ...profile,
      batch,
    };
  } catch (error) {
    console.error("Error fetching student profile by userId:", error);
    return null;
  }
}

export async function getStudentProfileBySlug(slug: string) {
  try {
    const [profile] = await db
      .select()
      .from(studentProfiles)
      .where(
        and(
          eq(studentProfiles.slug, slug),
          eq(studentProfiles.isPublic, true),
          eq(studentProfiles.isPublished, true)
        )
      )
      .limit(1);

    if (!profile) return null;

    const [u] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      })
      .from(user)
      .where(eq(user.id, profile.userId))
      .limit(1);

    let batch = null;
    if (profile.batchId) {
      const [b] = await db
        .select()
        .from(academicBatches)
        .where(eq(academicBatches.id, profile.batchId))
        .limit(1);
      batch = b || null;
    }

    const accounts = await db
      .select()
      .from(connectedAccounts)
      .where(eq(connectedAccounts.userId, profile.userId));

    return {
      ...profile,
      user: u || {
        id: profile.userId,
        name: profile.displayName,
        email: "",
        image: profile.avatarUrl,
      },
      batch,
      connectedAccounts: accounts,
    };
  } catch (error) {
    console.error("Error fetching student profile by slug:", error);
    return null;
  }
}

export async function checkSlugAvailable(slug: string, currentUserId?: string): Promise<boolean> {
  try {
    const reserved = [
      "admin", "api", "dashboard", "auth", "login", "register", "events", 
      "blog", "about", "team", "settings", "profile", "u", "join", "privacy", "terms"
    ];
    if (reserved.includes(slug.toLowerCase())) return false;

    if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(slug)) return false;

    const existing = await db
      .select({ id: studentProfiles.id, userId: studentProfiles.userId })
      .from(studentProfiles)
      .where(
        currentUserId
          ? and(eq(studentProfiles.slug, slug), ne(studentProfiles.userId, currentUserId))
          : eq(studentProfiles.slug, slug)
      )
      .limit(1);

    return existing.length === 0;
  } catch (error) {
    console.error("Error checking slug availability:", error);
    return false;
  }
}

export async function upsertStudentProfile(
  userId: string,
  data: {
    slug: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    academicProgram?: string;
    department?: string;
    batchId?: string | null;
    skills?: string[];
    interests?: string[];
    customBioMarkdown?: string;
    portfolioBlocks?: Array<{
      type: "intro" | "about" | "skills" | "projects" | "accounts" | "achievements" | "blogs" | "settings";
      title?: string;
      content?: unknown;
    }>;
    isPublic?: boolean;
    isPublished?: boolean;
    theme?: string;
  }
) {
  const profileId = `prof_${userId}`;
  const now = new Date();

  return await db
    .insert(studentProfiles)
    .values({
      id: profileId,
      userId,
      slug: data.slug.toLowerCase().trim(),
      displayName: data.displayName,
      avatarUrl: data.avatarUrl,
      bio: data.bio,
      academicProgram: data.academicProgram || "B.Tech",
      department: data.department || "Computer Science & Engineering",
      batchId: data.batchId,
      skills: data.skills || [],
      interests: data.interests || [],
      customBioMarkdown: data.customBioMarkdown,
      portfolioBlocks: data.portfolioBlocks || [],
      isPublic: data.isPublic ?? true,
      isPublished: data.isPublished ?? true,
      theme: data.theme || "minimal",
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: studentProfiles.userId,
      set: {
        slug: data.slug.toLowerCase().trim(),
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        academicProgram: data.academicProgram || "B.Tech",
        department: data.department,
        batchId: data.batchId,
        skills: data.skills || [],
        interests: data.interests || [],
        customBioMarkdown: data.customBioMarkdown,
        portfolioBlocks: data.portfolioBlocks,
        isPublic: data.isPublic ?? true,
        isPublished: data.isPublished ?? true,
        theme: data.theme || "minimal",
        updatedAt: now,
      },
    });
}

export async function getConnectedAccounts(userId: string) {
  try {
    return await db
      .select()
      .from(connectedAccounts)
      .where(eq(connectedAccounts.userId, userId));
  } catch (error) {
    console.error("Error fetching connected accounts:", error);
    return [];
  }
}

export async function getConnectedAccountByProvider(userId: string, provider: ConnectedProvider) {
  try {
    const [acc] = await db
      .select()
      .from(connectedAccounts)
      .where(
        and(
          eq(connectedAccounts.userId, userId),
          eq(connectedAccounts.provider, provider)
        )
      )
      .limit(1);

    return acc || null;
  } catch (error) {
    console.error("Error fetching connected account by provider:", error);
    return null;
  }
}

export async function findConnectedAccountByProviderId(provider: ConnectedProvider, providerUserId: string) {
  try {
    const [acc] = await db
      .select()
      .from(connectedAccounts)
      .where(
        and(
          eq(connectedAccounts.provider, provider),
          eq(connectedAccounts.providerUserId, providerUserId)
        )
      )
      .limit(1);

    return acc || null;
  } catch (error) {
    console.error("Error finding connected account:", error);
    return null;
  }
}

export async function upsertConnectedAccount(data: {
  userId: string;
  provider: ConnectedProvider;
  providerUserId?: string;
  handle: string;
  profileUrl: string;
  isVerified?: boolean;
  scopes?: string[];
  metadata?: Record<string, unknown>;
  syncStatus?: "SUCCESS" | "FAILED" | "PENDING";
  syncError?: string;
}) {
  const accountId = `conn_${data.provider.toLowerCase()}_${data.userId}`;
  const now = new Date();

  return await db
    .insert(connectedAccounts)
    .values({
      id: accountId,
      userId: data.userId,
      provider: data.provider,
      providerUserId: data.providerUserId,
      handle: data.handle,
      profileUrl: data.profileUrl,
      isVerified: data.isVerified ?? false,
      scopes: data.scopes || [],
      metadata: data.metadata || {},
      lastSyncedAt: now,
      syncStatus: data.syncStatus || "SUCCESS",
      syncError: data.syncError,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [connectedAccounts.userId, connectedAccounts.provider],
      set: {
        providerUserId: data.providerUserId,
        handle: data.handle,
        profileUrl: data.profileUrl,
        isVerified: data.isVerified ?? false,
        scopes: data.scopes || [],
        metadata: data.metadata || {},
        lastSyncedAt: now,
        syncStatus: data.syncStatus || "SUCCESS",
        syncError: data.syncError,
        updatedAt: now,
      },
    });
}

export async function disconnectConnectedAccount(userId: string, provider: ConnectedProvider) {
  return await db
    .delete(connectedAccounts)
    .where(
      and(
        eq(connectedAccounts.userId, userId),
        eq(connectedAccounts.provider, provider)
      )
    );
}

export async function getAllAcademicBatches() {
  try {
    return await db
      .select()
      .from(academicBatches)
      .orderBy(asc(academicBatches.displayOrder));
  } catch (error) {
    console.error("Error fetching academic batches:", error);
    return [];
  }
}

export async function getActiveAcademicBatches() {
  try {
    return await db
      .select()
      .from(academicBatches)
      .where(eq(academicBatches.isActive, true))
      .orderBy(asc(academicBatches.displayOrder));
  } catch (error) {
    console.error("Error fetching active academic batches:", error);
    return [];
  }
}

export async function upsertAcademicBatch(data: {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  program?: string;
  isActive?: boolean;
  displayOrder?: number;
  notes?: string;
}) {
  const now = new Date();
  return await db
    .insert(academicBatches)
    .values({
      id: data.id,
      label: data.label,
      startYear: data.startYear,
      endYear: data.endYear,
      program: data.program || "B.Tech",
      isActive: data.isActive ?? true,
      displayOrder: data.displayOrder ?? 0,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: academicBatches.id,
      set: {
        label: data.label,
        startYear: data.startYear,
        endYear: data.endYear,
        program: data.program || "B.Tech",
        isActive: data.isActive ?? true,
        displayOrder: data.displayOrder ?? 0,
        notes: data.notes,
        updatedAt: now,
      },
    });
}

export async function deleteAcademicBatch(id: string) {
  return await db.delete(academicBatches).where(eq(academicBatches.id, id));
}

export async function getPersonalBlogs(userId: string): Promise<PersonalBlogPost[]> {
  try {
    const profile = await getStudentProfileByUserId(userId);
    if (!profile) return [];
    const blocks = profile.portfolioBlocks || [];
    const blogsBlock = blocks.find((b) => b.type === "blogs");
    return Array.isArray(blogsBlock?.content) ? (blogsBlock.content as PersonalBlogPost[]) : [];
  } catch (error) {
    console.error("Error fetching personal blogs:", error);
    return [];
  }
}

export async function getPersonalBlogById(userId: string, blogId: string): Promise<PersonalBlogPost | null> {
  const blogs = await getPersonalBlogs(userId);
  return blogs.find((b) => b.id === blogId || b.slug === blogId) || null;
}

export async function upsertPersonalBlog(
  userId: string,
  data: {
    id?: string;
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    tags?: string[];
  }
): Promise<PersonalBlogPost> {
  const profile = await getStudentProfileByUserId(userId);
  if (!profile) {
    throw new Error("Student profile must be created before publishing blogs");
  }

  const blocks = profile.portfolioBlocks || [];
  const blogsBlockIndex = blocks.findIndex((b) => b.type === "blogs");
  const existingBlogs: PersonalBlogPost[] = blogsBlockIndex >= 0 && Array.isArray(blocks[blogsBlockIndex].content)
    ? (blocks[blogsBlockIndex].content as PersonalBlogPost[])
    : [];

  const wordCount = (data.content || "").trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const cleanSlug = (data.slug || data.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || `article-${Date.now()}`;

  const excerpt = data.excerpt || data.content.slice(0, 200).replace(/[#*`_]/g, "").trim() + "...";

  let updatedBlog: PersonalBlogPost;

  if (data.id) {
    const existingIndex = existingBlogs.findIndex((b) => b.id === data.id);
    if (existingIndex >= 0) {
      updatedBlog = {
        ...existingBlogs[existingIndex],
        title: data.title,
        slug: cleanSlug,
        excerpt,
        content: data.content,
        tags: data.tags || existingBlogs[existingIndex].tags || [],
        readingTimeMinutes,
      };
      existingBlogs[existingIndex] = updatedBlog;
    } else {
      updatedBlog = {
        id: data.id,
        title: data.title,
        slug: cleanSlug,
        excerpt,
        content: data.content,
        tags: data.tags || [],
        publishedAt: new Date().toISOString(),
        readingTimeMinutes,
      };
      existingBlogs.unshift(updatedBlog);
    }
  } else {
    updatedBlog = {
      id: `blog_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: data.title,
      slug: cleanSlug,
      excerpt,
      content: data.content,
      tags: data.tags || [],
      publishedAt: new Date().toISOString(),
      readingTimeMinutes,
    };
    existingBlogs.unshift(updatedBlog);
  }

  const updatedBlocks = [...blocks];
  if (blogsBlockIndex >= 0) {
    updatedBlocks[blogsBlockIndex] = {
      type: "blogs",
      title: "Personal Blogs",
      content: existingBlogs,
    };
  } else {
    updatedBlocks.push({
      type: "blogs",
      title: "Personal Blogs",
      content: existingBlogs,
    });
  }

  await db
    .update(studentProfiles)
    .set({
      portfolioBlocks: updatedBlocks,
      updatedAt: new Date(),
    })
    .where(eq(studentProfiles.userId, userId));

  return updatedBlog;
}

export async function deletePersonalBlog(userId: string, blogId: string): Promise<boolean> {
  const profile = await getStudentProfileByUserId(userId);
  if (!profile) return false;

  const blocks = profile.portfolioBlocks || [];
  const blogsBlockIndex = blocks.findIndex((b) => b.type === "blogs");
  if (blogsBlockIndex < 0) return false;

  const existingBlogs: PersonalBlogPost[] = Array.isArray(blocks[blogsBlockIndex].content)
    ? (blocks[blogsBlockIndex].content as PersonalBlogPost[])
    : [];

  const filteredBlogs = existingBlogs.filter((b) => b.id !== blogId && b.slug !== blogId);

  const updatedBlocks = [...blocks];
  updatedBlocks[blogsBlockIndex] = {
    type: "blogs",
    title: "Personal Blogs",
    content: filteredBlogs,
  };

  await db
    .update(studentProfiles)
    .set({
      portfolioBlocks: updatedBlocks,
      updatedAt: new Date(),
    })
    .where(eq(studentProfiles.userId, userId));

  return true;
}

export async function getPublicStudentProfiles(limit = 200) {
  try {
    return await db
      .select({
        slug: studentProfiles.slug,
        displayName: studentProfiles.displayName,
        updatedAt: studentProfiles.updatedAt,
      })
      .from(studentProfiles)
      .where(
        and(
          eq(studentProfiles.isPublic, true),
          eq(studentProfiles.isPublished, true)
        )
      )
      .limit(limit);
  } catch (error) {
    console.error("Error fetching public student profiles for sitemap:", error);
    return [];
  }
}

