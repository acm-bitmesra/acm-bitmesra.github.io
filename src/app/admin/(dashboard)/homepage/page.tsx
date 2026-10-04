import { getAuthorizedMember } from "@/lib/auth/session";
import { siteConfig } from "@/config/site";
import { getAllChapterEvents } from "@/db/queries/events";
import { getAllChapterAnnouncements } from "@/db/queries/announcements";
import Link from "next/link";
import {
  Home,
  Sparkles,
  ExternalLink,
  Eye,
  CheckCircle2,
  Calendar,
  Bell,
  Sliders,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHomepageManagerPage() {
  await getAuthorizedMember();

  const [events, announcements] = await Promise.all([
    getAllChapterEvents(),
    getAllChapterAnnouncements(),
  ]);

  const featuredEvent = events.find((e) => e.featured) || events[0];

  const homepageSections = [
    { name: "Hero Section", description: "Headline, mission statement, and primary CTA buttons", enabled: true },
    { name: "Live Stats Strip", description: "Members, workshops, ICPC regionalists, and hackathon awards", enabled: true },
    { name: "Three Core Pillars", description: "Systems & Open Source, Algorithmic Problem Solving, AI & Intelligence", enabled: true },
    { name: "Featured Flagship Event", description: `Currently highlighting: ${featuredEvent ? featuredEvent.title : "None"}`, enabled: true },
    { name: "Upcoming Events Grid", description: "Latest workshops, bootcamps, and hackathons", enabled: true },
    { name: "Chapter Impact Metrics", description: "Community reach and student growth stories", enabled: true },
    { name: "Recent Knowledge Articles", description: "Curated blog posts and technical guides", enabled: true },
    { name: "Curated Resources Preview", description: "Student-crafted roadmaps and learning archives", enabled: true },
    { name: "Join Chapter Callout", description: "Direct conversion CTA to join the student chapter", enabled: true },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E31B23] uppercase tracking-wider mb-1">
            <Home className="h-3.5 w-3.5" />
            <span>Layout & Curation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Homepage Console
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Control visual hierarchy, featured spotlights, and primary conversion paths.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview Live</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Hero Overview & Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#E31B23]" />
              <span>Hero Identity & Copywriting</span>
            </h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
              ACTIVE
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-500 block mb-1">Chapter Name</label>
              <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 text-white font-medium">
                {siteConfig.name}
              </div>
            </div>

            <div>
              <label className="text-zinc-500 block mb-1">Tagline & Description</label>
              <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-300 leading-relaxed">
                {siteConfig.description}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-zinc-500 block mb-1">Institution</label>
                <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-300">
                  {siteConfig.institution.name}
                </div>
              </div>
              <div>
                <label className="text-zinc-500 block mb-1">Official Domain</label>
                <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-300">
                  {siteConfig.url}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Curation Cards */}
        <div className="space-y-6">
          {/* Featured Event Spotlight */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#E31B23]" />
                <span>Featured Event</span>
              </span>
              <Link href="/admin/events" className="text-[11px] text-zinc-400 hover:text-white">
                Change →
              </Link>
            </div>
            {featuredEvent ? (
              <div className="space-y-1.5 text-xs">
                <div className="font-semibold text-white">{featuredEvent.title}</div>
                <div className="text-[11px] text-zinc-400">{featuredEvent.category} · {featuredEvent.status}</div>
                <div className="text-[10px] text-zinc-500">Slug: /{featuredEvent.slug}</div>
              </div>
            ) : (
              <div className="text-xs text-zinc-500">No event marked as featured.</div>
            )}
          </div>

          {/* Broadcast Announcement */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-amber-400" />
                <span>Active Broadcasts</span>
              </span>
              <Link href="/admin/announcements" className="text-[11px] text-zinc-400 hover:text-white">
                Manage →
              </Link>
            </div>
            <div className="text-xs text-zinc-400">
              {announcements.filter((a: { isActive: boolean }) => a.isActive).length} banner announcement(s) currently active on top of homepage.
            </div>
          </div>
        </div>
      </div>

      {/* Homepage Section Architecture */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden font-mono">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#E31B23]" />
              <span>Section Ordering & Modular Pipeline</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live components rendered in sequence on the landing page.
            </p>
          </div>
          <span className="text-xs text-zinc-500">9 Active Modules</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {homepageSections.map((sec, idx) => (
            <div
              key={sec.name}
              className="p-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500 font-bold">
                  {idx + 1}
                </span>
                <div>
                  <div className="text-xs font-bold text-white">{sec.name}</div>
                  <div className="text-[11px] text-zinc-400">{sec.description}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Enabled</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
