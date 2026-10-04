import { getAuthorizedMember } from "@/lib/auth/session";
import { alumniBatches, alumniEngagementPaths } from "@/data/alumni";
import Link from "next/link";
import { GraduationCap, ExternalLink, Award, CheckCircle2, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAlumniPage() {
  await getAuthorizedMember();

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Alumni Network & Heritage</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Alumni Governance & Registry
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Historical executive boards, graduating cohorts, and chapter mentorship connections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/alumni"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs transition-colors"
          >
            <span>Public Alumni Page</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Engagement Channels */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <HeartHandshake className="h-4 w-4 text-emerald-400" />
          <span>Active Engagement Pathways</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alumniEngagementPaths.map((path) => (
            <div
              key={path.title}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2"
            >
              <h3 className="text-sm font-bold text-white">{path.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{path.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Batches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Award className="h-4 w-4 text-[#E31B23]" />
            <span>Recorded Leadership Cohorts</span>
          </div>
          <span className="text-xs text-zinc-500">{alumniBatches.length} Archived Batches</span>
        </div>

        <div className="space-y-4">
          {alumniBatches.map((batch) => (
            <div
              key={batch.academicYear}
              className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white">
                    {batch.academicYear}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                    {batch.graduatingBatch}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Archived & Verified</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 text-xs">
                <div className="space-y-2">
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">
                    Leadership & Core Contributions
                  </span>
                  <div className="space-y-2">
                    {batch.leadership.map((lead, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80"
                      >
                        <div className="font-bold text-white">{lead.role}</div>
                        <div className="text-zinc-400 text-[11px] mt-0.5">{lead.note}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-zinc-500 block uppercase tracking-wider text-[10px]">
                    Cohort Initiatives & Highlights
                  </span>
                  <ul className="space-y-1.5 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-zinc-300 text-[11px]">
                    {batch.initiatives.map((init, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-[#E31B23]">›</span>
                        <span>{init}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
