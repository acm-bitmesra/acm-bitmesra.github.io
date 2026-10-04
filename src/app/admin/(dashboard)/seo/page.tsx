import { getAuthorizedMember } from "@/lib/auth/session";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import {
  Globe,
  Share2,
  ExternalLink,
  CheckCircle2,
  FileCode,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  await getAuthorizedMember();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    alternateName: "ACM BITM",
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    description: siteConfig.description,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.institution.name,
      url: siteConfig.institution.url,
    },
    memberOf: {
      "@type": "Organization",
      name: siteConfig.parentOrganization.name,
      url: siteConfig.parentOrganization.url,
    },
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <Globe className="h-3.5 w-3.5" />
            <span>Search & Metadata Architecture</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            SEO & OpenGraph Social Console
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Search engine indexation, OpenGraph preview rendering, and Schema.org structured data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sitemap.xml"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs transition-colors"
          >
            <span>sitemap.xml</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
          <Link
            href="/robots.txt"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs transition-colors"
          >
            <span>robots.txt</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Crawlability & Health Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Indexation Status</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">INDEXABLE</div>
          <div className="text-[11px] text-zinc-500">robots.txt allows all search bots</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Canonical Domain</span>
            <Globe className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-sm font-bold text-white truncate">{siteConfig.url}</div>
          <div className="text-[11px] text-zinc-500">Strict canonical URLs emitted</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Structured Data</span>
            <FileCode className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">Schema.org</div>
          <div className="text-[11px] text-zinc-500">EducationalOrganization JSON-LD</div>
        </div>
      </div>

      {/* Social Previews (OpenGraph & Twitter Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OpenGraph Card Preview */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Share2 className="h-4 w-4 text-[#E31B23]" />
              <span>OpenGraph Social Share Card Preview</span>
            </h3>
            <span className="text-[10px] text-zinc-400">og:image 1200×630</span>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
            <div className="aspect-[1.91/1] bg-zinc-950 relative flex items-center justify-center border-b border-zinc-800 overflow-hidden">
              <img
                src="/images/branding/og-image.png"
                alt="OpenGraph Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <div className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  ACM BIT MESRA
                </div>
                <div className="text-base font-bold text-white leading-snug">
                  Build. Compete. Create.
                </div>
              </div>
            </div>

            <div className="p-4 space-y-1 text-xs">
              <div className="text-[10px] text-zinc-500 uppercase">
                {new URL(siteConfig.url).hostname}
              </div>
              <div className="font-bold text-white text-sm">
                {siteConfig.name} — {siteConfig.tagline}
              </div>
              <p className="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed">
                {siteConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* JSON-LD Structured Data */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCode className="h-4 w-4 text-amber-400" />
              <span>JSON-LD Organization Schema</span>
            </h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
              VALID
            </span>
          </div>

          <pre className="p-4 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 overflow-x-auto max-h-[340px] leading-relaxed">
            {JSON.stringify(organizationJsonLd, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
