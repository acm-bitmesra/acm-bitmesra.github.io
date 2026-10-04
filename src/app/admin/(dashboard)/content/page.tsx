import { getAuthorizedMember } from "@/lib/auth/session";
import { getAdminPosts } from "@/db/queries/admin-blog";
import { getAllChapterEvents } from "@/db/queries/events";
import { getAllChapterResources } from "@/db/queries/resources";
import { getAllGalleryItems } from "@/db/queries/gallery";
import { getAllSponsors } from "@/db/queries/sponsors";
import { getAllChapterMedia } from "@/db/queries/governance";
import Link from "next/link";
import {
  FileText,
  Calendar,
  BookOpen,
  Image,
  Award,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  HeartPulse,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  await getAuthorizedMember();

  const [posts, events, resources, gallery, sponsors, media] =
    await Promise.all([
      getAdminPosts("ALL"),
      getAllChapterEvents(),
      getAllChapterResources(),
      getAllGalleryItems(),
      getAllSponsors(),
      getAllChapterMedia(),
    ]);

  const publishedPosts = posts.filter((p: { status: string }) => p.status === "PUBLISHED");
  const draftPosts = posts.filter((p: { status: string }) => p.status === "DRAFT");
  const upcomingEvents = events.filter(
    (e: { status: string }) => e.status === "UPCOMING" || e.status === "ONGOING"
  );

  const sections = [
    {
      title: "Articles & Blog",
      count: posts.length,
      detail: `${publishedPosts.length} published, ${draftPosts.length} drafts`,
      icon: FileText,
      href: "/admin/blog",
      createHref: "/admin/blog/new",
      createLabel: "New Article",
    },
    {
      title: "Events & Contests",
      count: events.length,
      detail: `${upcomingEvents.length} upcoming or live`,
      icon: Calendar,
      href: "/admin/events",
      createHref: "/admin/events/new",
      createLabel: "New Event",
    },
    {
      title: "Curated Resources",
      count: resources.length,
      detail: "Roadmaps, study guides, and repos",
      icon: BookOpen,
      href: "/admin/resources",
      createHref: "/admin/resources/new",
      createLabel: "Add Resource",
    },
    {
      title: "Photo Gallery",
      count: gallery.length,
      detail: "Chapter moments and archive photos",
      icon: Image,
      href: "/admin/gallery",
      createHref: "/admin/gallery",
      createLabel: "Manage Gallery",
    },
    {
      title: "Media Library",
      count: media.length,
      detail: "Cloudflare R2 and public static assets",
      icon: Layers,
      href: "/admin/media",
      createHref: "/admin/media",
      createLabel: "Media Assets",
    },
    {
      title: "Sponsors & Partners",
      count: sponsors.length,
      detail: "Industry partners and tier sponsors",
      icon: Award,
      href: "/admin/sponsors",
      createHref: "/admin/sponsors",
      createLabel: "Manage Sponsors",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E31B23] uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Editorial Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Content Command Center
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Unified management of articles, workshops, academic resources, media, and partnerships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/system/content-health"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
          >
            <HeartPulse className="h-3.5 w-3.5 text-red-500" />
            <span>Content Health</span>
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white text-xs font-mono font-medium transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Article</span>
          </Link>
        </div>
      </div>

      {/* Grid of Content Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.title}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700/80 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-zinc-700 transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-2xl font-bold font-mono text-white">
                    {sec.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                    {sec.detail}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between font-mono text-xs">
                <Link
                  href={sec.href}
                  className="text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <span>Open Hub</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  href={sec.createHref}
                  className="text-[#E31B23] hover:underline"
                >
                  {sec.createLabel}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
