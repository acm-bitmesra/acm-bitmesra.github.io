import { getAuthorizedMember } from "@/lib/auth/session";
import { getContentHealthReport } from "@/db/queries/governance";
import Link from "next/link";
import {
  HeartPulse,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContentHealthPage() {
  await getAuthorizedMember();

  const report = await getContentHealthReport();

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <HeartPulse className="h-3.5 w-3.5" />
            <span>Editorial Health & Audit</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Content Health Inspector
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Automated quality diagnostics, SEO readiness checks, and social image validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Overall Score: {report.healthScore}%</span>
          </div>
        </div>
      </div>

      {/* Top Health Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="text-xs text-zinc-400">Total Content Items</div>
          <div className="text-2xl font-bold text-white">{report.totalContentItems}</div>
          <div className="text-[11px] text-zinc-500">Articles, events & resources</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="text-xs text-zinc-400">Published Posts</div>
          <div className="text-2xl font-bold text-emerald-400">{report.publishedPosts}</div>
          <div className="text-[11px] text-zinc-500">Live on public blog</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="text-xs text-zinc-400">Draft Posts</div>
          <div className="text-2xl font-bold text-amber-400">{report.draftPosts}</div>
          <div className="text-[11px] text-zinc-500">Pending editorial review</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="text-xs text-zinc-400">Active Events</div>
          <div className="text-2xl font-bold text-sky-400">{report.activeEvents}</div>
          <div className="text-[11px] text-zinc-500">Upcoming or live contests</div>
        </div>
      </div>

      {/* Automated Diagnostic Checks */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-[#E31B23]" />
            <span>Diagnostic Audit Trail ({report.issues.length} Items Flagged)</span>
          </h3>
          <span className="text-xs text-zinc-500">Continuous Static Verification</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {report.issues.length === 0 ? (
            <div className="p-12 text-center text-xs text-emerald-400 flex flex-col items-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              <span>All articles, events, and resources pass health checks with 100% compliance!</span>
            </div>
          ) : (
            report.issues.map((issue, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/30 transition-colors text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {issue.type === "WARNING" ? (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-[10px] bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                        <AlertTriangle className="h-3 w-3" />
                        <span>WARNING</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sky-400 font-bold text-[10px] bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/60">
                        <Info className="h-3 w-3" />
                        <span>NOTICE</span>
                      </span>
                    )}
                    <span className="font-bold text-white truncate">{issue.target}</span>
                  </div>

                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    {issue.message}
                  </p>
                </div>

                <Link
                  href={issue.link}
                  className="inline-flex items-center gap-1 text-xs text-[#E31B23] hover:underline self-end sm:self-center shrink-0"
                >
                  <span>Resolve Item</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
