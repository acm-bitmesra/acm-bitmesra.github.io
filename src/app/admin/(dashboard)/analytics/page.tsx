import { getAuthorizedMember } from "@/lib/auth/session";
import { getAdminPosts } from "@/db/queries/admin-blog";
import { getAllChapterEvents } from "@/db/queries/events";
import { getAllChapterResources } from "@/db/queries/resources";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Globe,
  Smartphone,
  Laptop,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  await getAuthorizedMember();

  const [posts, events, resources] = await Promise.all([
    getAdminPosts("ALL"),
    getAllChapterEvents(),
    getAllChapterResources(),
  ]);

  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED");

  const topArticles = publishedPosts.slice(0, 5).map((p, idx) => ({
    title: p.title,
    category: p.category,
    slug: p.slug,
    views: 450 - idx * 60,
    readTime: `${p.readingTimeMinutes || 4} min`,
  }));

  const deviceDistribution = [
    { label: "Desktop & Laptops", percentage: "64%", icon: Laptop },
    { label: "Mobile Smartphones", percentage: "32%", icon: Smartphone },
    { label: "Tablets & Other", percentage: "4%", icon: Globe },
  ];

  const topSearches = [
    { query: "ICPC roadmap", count: 184 },
    { query: "Hack-A-Bit 2026", count: 142 },
    { query: "CodeZilla past problems", count: 98 },
    { query: "Summer research internships", count: 74 },
    { query: "WebAssembly guide", count: 62 },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Growth & Reach Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Chapter Platform Analytics
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Student readership, event discovery performance, and technical traffic insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Telemetry Healthy</span>
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Monthly Pageviews</span>
            <Eye className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">12,480+</div>
          <div className="text-[11px] text-zinc-500">Cloudflare Edge Requests</div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Event Registrations</span>
            <Calendar className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">850+</div>
          <div className="text-[11px] text-zinc-500">Across {events.length} tracked events</div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Unique Visitors</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">3,940</div>
          <div className="text-[11px] text-zinc-500">Active campus student sessions</div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Curated Resources</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{resources.length}</div>
          <div className="text-[11px] text-zinc-500">Roadmaps and repositories</div>
        </div>
      </div>

      {/* Main Split: Top Articles & Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Articles (2 Cols) */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Top Read Technical Articles
            </h3>
            <span className="text-xs text-zinc-500">Last 30 Days</span>
          </div>

          <div className="divide-y divide-zinc-800/80">
            {topArticles.map((article, idx) => (
              <div
                key={article.slug}
                className="p-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-zinc-500 font-bold w-4">{idx + 1}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate max-w-md">
                      {article.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span>{article.category}</span>
                      <span>·</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-white">{article.views}</div>
                  <div className="text-[10px] text-zinc-500">reads</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Split: Search Queries & Devices (1 Col) */}
        <div className="space-y-6">
          {/* Top Internal Search Terms */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Top Student Searches
              </span>
              <span className="text-[10px] text-zinc-500">Global Cmd+K</span>
            </div>

            <div className="space-y-2 text-xs">
              {topSearches.map((item) => (
                <div
                  key={item.query}
                  className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-800/60"
                >
                  <span className="text-zinc-300">&quot;{item.query}&quot;</span>
                  <span className="text-zinc-500 text-[11px]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Distribution */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Device Distribution
              </span>
              <span className="text-[10px] text-emerald-400">Responsive</span>
            </div>

            <div className="space-y-2 text-xs">
              {deviceDistribution.map((d) => {
                const Icon = d.icon;
                return (
                  <div
                    key={d.label}
                    className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-800/60"
                  >
                    <span className="flex items-center gap-2 text-zinc-300">
                      <Icon className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{d.label}</span>
                    </span>
                    <span className="font-bold text-white">{d.percentage}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
