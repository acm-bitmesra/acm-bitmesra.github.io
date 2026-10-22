import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { events } from "@/data/events";
import { activitiesData } from "@/data/activities";
import { getPublishedBlogPosts } from "@/data/blog";
import { getPublicTeamMembers } from "@/data/team";
import { getPublishedPosts, getPublishedCategories, getPublishedTags } from "@/db/queries/blog";
import { getPublicStudentProfiles } from "@/db/queries/students";

export const revalidate = 3600; // Hourly sitemap cache revalidation

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // 1. Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/activities",
    "/events",
    "/team",
    "/resources",
    "/blog",
    "/competitive-programming",
    "/icpc",
    "/alumni",
    "/history",
    "/gallery",
    "/sponsors",
    "/join",
    "/contact",
    "/privacy",
    "/terms",
    "/accessibility",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/events" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/events" || route === "/join" || route === "/blog" ? 0.9 : 0.8,
  }));

  // 2. Dynamic Event Routes
  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.dateTba ? new Date() : new Date(event.date),
    changeFrequency: event.status === "upcoming" ? "daily" : "monthly",
    priority: event.status === "upcoming" ? 0.9 : 0.7,
  }));

  // 3. Live Rankings Routes
  const rankingRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/events/hacktoberfest-2026/rankings`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
  ];

  // 4. Dynamic Activity Routes
  const activityRoutes: MetadataRoute.Sitemap = activitiesData.map((act) => ({
    url: `${baseUrl}/activities/${act.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 5. Dynamic Blog Articles (Database with static fallback)
  let blogItems: { slug: string; date: Date }[] = [];
  try {
    const livePosts = await getPublishedPosts({ limit: 100 });
    blogItems = livePosts.map((p) => ({
      slug: p.slug,
      date: p.publishedAt || now,
    }));
  } catch (err) {
    console.error("Sitemap: Failed to query database for blog posts:", err);
  }

  if (blogItems.length === 0) {
    blogItems = getPublishedBlogPosts().map((post) => ({
      slug: post.slug,
      date: new Date(post.date),
    }));
  }

  const blogRoutes: MetadataRoute.Sitemap = blogItems.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 6. Blog Categories & Tags Routes
  let categoryRoutes: MetadataRoute.Sitemap = [];
  let tagRoutes: MetadataRoute.Sitemap = [];
  try {
    const [categories, tags] = await Promise.all([
      getPublishedCategories(),
      getPublishedTags(),
    ]);

    categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/blog/category/${encodeURIComponent(cat.category.toLowerCase().replace(/\s+/g, "-"))}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    tagRoutes = tags.map((t) => ({
      url: `${baseUrl}/blog/tag/${t.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    }));
  } catch (err) {
    console.error("Sitemap: Failed to query categories and tags:", err);
  }

  // 7. Verified Public Student Developer Profiles
  let studentRoutes: MetadataRoute.Sitemap = [];
  try {
    const publicStudents = await getPublicStudentProfiles(100);
    studentRoutes = publicStudents.map((s) => ({
      url: `${baseUrl}/u/${s.slug}`,
      lastModified: s.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.75,
    }));
  } catch (err) {
    console.error("Sitemap: Failed to query student profiles:", err);
  }

  // 8. Dynamic Team Routes (Verified only)
  const teamRoutes: MetadataRoute.Sitemap = getPublicTeamMembers().map((member) => ({
    url: `${baseUrl}/team/${member.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...eventRoutes,
    ...rankingRoutes,
    ...activityRoutes,
    ...blogRoutes,
    ...categoryRoutes,
    ...tagRoutes,
    ...studentRoutes,
    ...teamRoutes,
  ];
}
