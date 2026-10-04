import { getAuthorizedMember } from "@/lib/auth/session";
import { chapterHistory } from "@/data/history";
import Link from "next/link";
import { History, Clock, Award, KeyRound } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTermsPage() {
  await getAuthorizedMember();

  const transitionChecklist = [
    { title: "Cloudflare Workers & DNS Transfer", status: "VERIFIED", notes: "Primary domain and production worker edge keys maintained under acm@bitmesra.ac.in" },
    { title: "GitHub Organization Owner Access", status: "VERIFIED", notes: "Admin access delegated to incoming General Secretary & Tech Head" },
    { title: "Social Handles & Brand Assets", status: "VERIFIED", notes: "Official Instagram (@acmbitmesra), LinkedIn, and X credentials rotated" },
    { title: "PostgreSQL Database Credentials", status: "VERIFIED", notes: "Zero secrets in client repo; Worker secrets rotated each academic year" },
    { title: "ACM Global Charter Roster Filing", status: "ACTIVE", notes: "Annual chapter compliance and active officer reporting to ACM headquarters" },
  ];

  const terms = [
    {
      term: "2024–2025",
      status: "ACTIVE",
      tenure: "July 2024 – June 2025",
      lead: "Current Executive Committee",
      achievements: "Next.js App Router overhaul, Cloudflare edge migration, Zero-Trust RBAC platform",
    },
    {
      term: "2023–2024",
      status: "COMPLETED",
      tenure: "July 2023 – June 2024",
      lead: "Class of 2024",
      achievements: "Hack-A-Bit multi-day offline edition, CodeZilla national qualifiers, ICPC Regional finalists",
    },
    {
      term: "2022–2023",
      status: "ARCHIVED",
      tenure: "July 2022 – June 2023",
      lead: "Class of 2023",
      achievements: "Post-pandemic technical reboot, offline algorithmic labs, continuous CQM contests",
    },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <History className="h-3.5 w-3.5" />
            <span>Governance & Handover</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Chapter Terms & Executive Handover
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Executive tenures, credentials handover safeguards, and historical eras.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
            <Clock className="h-3 w-3" />
            <span>Current Term: 2024–2025</span>
          </span>
        </div>
      </div>

      {/* Handover & Security Safeguards */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <KeyRound className="h-4 w-4 text-[#E31B23]" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Executive Transition & Governance Checklist
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {transitionChecklist.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{item.title}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  {item.status}
                </span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">{item.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recorded Terms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Award className="h-4 w-4 text-[#E31B23]" />
            <span>Executive Terms Registry</span>
          </div>
          <span className="text-xs text-zinc-500">{terms.length} Recorded Terms</span>
        </div>

        <div className="space-y-3">
          {terms.map((t) => (
            <div
              key={t.term}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white">{t.term}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === "ACTIVE"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="text-xs text-zinc-400">{t.tenure} · {t.lead}</div>
                <div className="text-[11px] text-zinc-500">{t.achievements}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Eras */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Chapter Heritage Timeline
          </h3>
          <Link href="/history" target="_blank" className="text-xs text-zinc-400 hover:text-white">
            Public History Page →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {chapterHistory.map((hist) => (
            <div
              key={hist.era}
              className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px] text-[#E31B23]">
                <span className="font-bold">{hist.era}</span>
                <span>{hist.year}</span>
              </div>
              <div className="font-semibold text-white">{hist.title}</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">{hist.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
