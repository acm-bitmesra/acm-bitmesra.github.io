import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { events } from "@/data/events";
import { activitiesData } from "@/data/activities";
import { getPublishedBlogPosts } from "@/data/blog";
import { getPublicTeamMembers } from "@/data/team";
import { getPublishedPosts } from "@/db/queries/blog";

export const revalidate = 3600; // Hourly sitemap cache revalidation

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // Static routes
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
    priority: route === "" ? 1.0 : route === "/events" || route === "/join" ? 0.9 : 0.8,
  }));

  // Dynamic Event routes
  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.dateTba ? new Date() : new Date(event.date),
    changeFrequency: event.status === "upcoming" ? "daily" : "monthly",
    priority: event.status === "upcoming" ? 0.9 : 0.7,
  }));

  // Dynamic Activity routes
  const activityRoutes: MetadataRoute.Sitemap = activitiesData.map((act) => ({
    url: `${baseUrl}/activities/${act.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Dynamic Blog routes (published only from database with static fallback)
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
    priority: 0.8,
  }));

  // Dynamic Team routes (verified only)
  const teamRoutes: MetadataRoute.Sitemap = getPublicTeamMembers().map((member) => ({
    url: `${baseUrl}/team/${member.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...eventRoutes,
    ...activityRoutes,
    ...blogRoutes,
    ...teamRoutes,
  ];
}
