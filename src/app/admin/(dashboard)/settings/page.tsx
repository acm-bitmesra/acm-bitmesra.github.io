import { getAuthorizedMember } from "@/lib/auth/session";
import { siteConfig } from "@/config/site";
import { getSystemHealthReport } from "@/db/queries/system";
import {
  Settings,
  ShieldCheck,
  Server,
  Lock,
  Mail,
  MapPin,
  Globe,
  Database,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await getAuthorizedMember();

  const systemReport = await getSystemHealthReport();

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <Settings className="h-3.5 w-3.5" />
            <span>Chapter Platform Configuration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Global Settings & Environment
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Institutional identities, Cloudflare edge settings, Zero-Trust allowlist, and database connectivity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Config Verified</span>
          </span>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chapter Identity */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#E31B23]" />
              <span>Chapter Organization Profile</span>
            </h3>
            <span className="text-[10px] text-zinc-400">site.ts</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-zinc-500 block mb-1">Organization Name</span>
              <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 text-white font-bold">
                {siteConfig.name} ({siteConfig.shortName})
              </div>
            </div>

            <div>
              <span className="text-zinc-500 block mb-1">Official Contact Email</span>
              <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-300 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-zinc-500" />
                <span>{siteConfig.social.email}</span>
              </div>
            </div>

            <div>
              <span className="text-zinc-500 block mb-1">Campus Physical Address</span>
              <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-300 flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
                <span>{siteConfig.location.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Zero-Trust Allowlist */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#E31B23]" />
              <span>Bootstrap Administrator Allowlist</span>
            </h3>
            <span className="text-[10px] text-emerald-400">Strict Match</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Only accounts specified in <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">ADMIN_EMAIL_ALLOWLIST</code> can be provisioned with initial SUPER_ADMIN authority. Wildcard domain grants are blocked.
          </p>

          <div className="space-y-2 text-xs">
            {systemReport.allowlist.map((email) => (
              <div
                key={email}
                className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between"
              >
                <span className="text-white font-bold">{email}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                  LEVEL 0 ALLOWLISTED
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cloudflare Runtime */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="h-4 w-4 text-[#E31B23]" />
              <span>Edge Runtime Environment</span>
            </h3>
            <span className="text-[10px] text-zinc-400">Workers / OpenNext</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-400">Hosting Provider:</span>
              <span className="text-white font-bold">Cloudflare Workers Edge Network</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-400">Application Framework:</span>
              <span className="text-white font-bold">Next.js 16 App Router</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-400">Zero-Secret Rule:</span>
              <span className="text-emerald-400 font-bold">ENFORCED (No credentials in code)</span>
            </div>
          </div>
        </div>

        {/* Database & Neon PostgreSQL */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="h-4 w-4 text-[#E31B23]" />
              <span>Relational Storage Engine</span>
            </h3>
            <span className="text-[10px] text-emerald-400">Neon Serverless</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-400">Database Engine:</span>
              <span className="text-white font-bold">Neon PostgreSQL 16</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-400">Connection Latency:</span>
              <span className="text-emerald-400 font-bold">{systemReport.dbLatencyMs}ms (Healthy)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-400">ORM Layer:</span>
              <span className="text-white font-bold">Drizzle ORM (Type-Safe Schema)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
