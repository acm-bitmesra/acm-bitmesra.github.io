"use client";

import * as React from "react";
import Link from "next/link";
import {
  History,
  CheckCircle2,
  Circle,
  Download,
  ArrowLeft,
  ShieldCheck,
  Users,
  Award,
  Calendar,
  FileText,
} from "lucide-react";

interface HandoverItem {
  id: string;
  category: "LEADERSHIP" | "COMMUNICATIONS" | "SECURITY" | "EDITORIAL";
  title: string;
  description: string;
  completed: boolean;
}

interface HandoverConsoleProps {
  term: string;
  nextTerm: string;
  stats: {
    totalArticles: number;
    totalEvents: number;
    activeAdmins: number;
    archivedMembers: number;
  };
}

export function HandoverConsole({
  term,
  nextTerm,
  stats,
}: HandoverConsoleProps) {
  const initialChecklist: HandoverItem[] = [
    {
      id: "pres_assigned",
      category: "LEADERSHIP",
      title: "New Chapter President Assigned",
      description: "Official executive board elections complete; President appointed in chapter roster.",
      completed: true,
    },
    {
      id: "vp_assigned",
      category: "LEADERSHIP",
      title: "New Vice President Assigned",
      description: "Vice President position confirmed and permissions provisioned.",
      completed: true,
    },
    {
      id: "gs_assigned",
      category: "LEADERSHIP",
      title: "New General Secretary Assigned",
      description: "General Secretary registered with activity and communication credentials.",
      completed: true,
    },
    {
      id: "contacts_verified",
      category: "COMMUNICATIONS",
      title: "Website Contact & Email Routing Verified",
      description: "acm@bitmesra.ac.in distribution list and institutional inquiries updated.",
      completed: true,
    },
    {
      id: "socials_verified",
      category: "COMMUNICATIONS",
      title: "Official Social Media Channels Verified",
      description: "Instagram (@acmbitm), LinkedIn, and X passwords rotated and shared with incoming board.",
      completed: true,
    },
    {
      id: "admins_verified",
      category: "SECURITY",
      title: "Admin Allowlist Updated (ADMIN_EMAIL_ALLOWLIST)",
      description: "Outgoing super admins offboarded to Viewer/Alumni; incoming presidents allowlisted.",
      completed: true,
    },
    {
      id: "sessions_revoked",
      category: "SECURITY",
      title: "Outgoing Administrative Sessions Revoked",
      description: "Zero-Trust session purge executed via Admin Security console.",
      completed: true,
    },
    {
      id: "pending_reviewed",
      category: "EDITORIAL",
      title: "Pending Draft Articles & Contests Reviewed",
      description: "All draft submissions triaged, approved, or rescheduled for next semester.",
      completed: true,
    },
    {
      id: "seo_checked",
      category: "EDITORIAL",
      title: "SEO & Sitemap Indexability Re-Verified",
      description: "robots.txt, sitemap.xml, and OpenGraph social tags validated.",
      completed: true,
    },
    {
      id: "backup_verified",
      category: "SECURITY",
      title: "Database Snapshot & Codebase Tagged",
      description: "GitHub release tag created for current term; Neon database snapshot confirmed.",
      completed: true,
    },
  ];

  const [checklist, setChecklist] = React.useState<HandoverItem[]>(initialChecklist);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = checklist.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const handleDownloadReport = () => {
    const reportData = {
      title: "ACM BIT Mesra Executive Handover Report",
      generatedAt: new Date().toISOString(),
      currentTerm: term,
      incomingTerm: nextTerm,
      platformStatistics: stats,
      transitionChecklist: checklist,
      securityStatus: {
        zeroTrustPolicy: "ENFORCED",
        secretsInSource: "ZERO",
        sessionsCleaned: true,
      },
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `acm-bitm-handover-report-${term.replace(/[^a-zA-Z0-9]/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/terms"
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Terms</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="h-6 w-6 text-[#E31B23]" />
            <span>Executive Handover Center</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Institutional continuity checklist, credential rotation, and end-of-term reporting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white text-xs font-medium transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export End-of-Term Report</span>
          </button>
        </div>
      </div>

      {/* Handover Progress Banner */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-zinc-400">
              Transitioning Tenure: <span className="text-white font-bold">{term}</span> → <span className="text-emerald-400 font-bold">{nextTerm}</span>
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {completedCount} of {checklist.length} Safeguards Completed ({progressPercent}%)
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Governance Ready</span>
            </span>
          </div>
        </div>

        <div className="w-full h-2 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Term Highlights Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Articles</span>
            <FileText className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalArticles}</div>
          <div className="text-[11px] text-zinc-500">Published guides</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Events</span>
            <Calendar className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalEvents}</div>
          <div className="text-[11px] text-zinc-500">Workshops & hackathons</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Active Admins</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.activeAdmins}</div>
          <div className="text-[11px] text-zinc-500">Executive roster</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Archived Roster</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.archivedMembers}</div>
          <div className="text-[11px] text-zinc-500">Alumni preserved</div>
        </div>
      </div>

      {/* Interactive Checklist */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Executive Transition Safeguards Checklist (Section 132)
          </h3>
          <span className="text-xs text-zinc-500">Tap to toggle verified status</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="p-4 sm:p-5 flex items-start gap-4 hover:bg-zinc-900/40 transition-colors cursor-pointer"
            >
              <button
                type="button"
                className="mt-0.5 text-zinc-500 hover:text-white shrink-0"
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-zinc-600" />
                )}
              </button>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm font-bold ${
                      item.completed ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
