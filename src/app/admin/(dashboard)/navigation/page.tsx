import { getAuthorizedMember } from "@/lib/auth/session";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Compass, ExternalLink, CheckCircle2, Globe, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNavigationPage() {
  await getAuthorizedMember();

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <Compass className="h-3.5 w-3.5" />
            <span>Information Architecture</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Navigation & Menus Console
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage desktop navigation bars, mobile slide-over drawers, and footer quick links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs transition-colors"
          >
            <span>Live Navigation</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Navbar */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#E31B23]" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Primary Header Navigation
              </h3>
            </div>
            <span className="text-xs text-zinc-500">{siteConfig.nav.length} Main Items</span>
          </div>

          <div className="space-y-2 text-xs">
            {siteConfig.nav.map((item, idx) => (
              <div
                key={item.href}
                className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-white">{item.title}</span>
                  <span className="text-zinc-500">{item.href}</span>
                </div>

                <Link
                  href={item.href}
                  target="_blank"
                  className="text-zinc-500 hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Footer & Secondary Links */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#E31B23]" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Footer Quick Links & Explore Hub
              </h3>
            </div>
            <span className="text-xs text-zinc-500">{siteConfig.quickLinks.length} Items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {siteConfig.quickLinks.map((item) => (
              <div
                key={item.href}
                className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between"
              >
                <div className="truncate">
                  <div className="font-semibold text-white truncate">{item.title}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{item.href}</div>
                </div>
                <Link
                  href={item.href}
                  target="_blank"
                  className="text-zinc-500 hover:text-white shrink-0 ml-2"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Social Media Matrix */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Official Social Media & Contact Routing
          </h3>
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Zero Tracking Tokens Enforced</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
            <div className="text-zinc-500 text-[10px]">Instagram (Priority)</div>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-white font-bold hover:underline flex items-center gap-1 truncate"
            >
              <span>@acmbitm</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
            <div className="text-zinc-500 text-[10px]">LinkedIn Company</div>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-white font-bold hover:underline flex items-center gap-1 truncate"
            >
              <span>ACM BIT Mesra</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
            <div className="text-zinc-500 text-[10px]">X (Twitter)</div>
            <a
              href={siteConfig.social.x}
              target="_blank"
              rel="noreferrer"
              className="text-white font-bold hover:underline flex items-center gap-1 truncate"
            >
              <span>@acmbitmesra</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
            <div className="text-zinc-500 text-[10px]">GitHub Organization</div>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noreferrer"
              className="text-white font-bold hover:underline flex items-center gap-1 truncate"
            >
              <span>acm-bitmesra</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
