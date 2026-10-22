"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Trophy, Medal, ExternalLink, CheckCircle, GitPullRequest, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

export interface ParticipantStanding {
  rank: number;
  userId: string;
  displayName: string;
  email: string;
  image?: string | null;
  slug?: string | null;
  githubHandle?: string | null;
  githubProfileUrl?: string | null;
  isGithubVerified?: boolean;
  totalPrs: number;
  approvedPrs: number;
  totalScore: number;
  registeredAt: string;
  award?: string | null;
}

interface RankingsTableProps {
  eventSlug: string;
  eventTitle: string;
  isPublished: boolean;
  publishedAt?: string | null;
  standings: ParticipantStanding[];
}

export function RankingsTable({
  eventSlug,
  eventTitle,
  isPublished,
  publishedAt,
  standings,
}: RankingsTableProps) {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "ranked" | "top10">("all");

  const filtered = React.useMemo(() => {
    let list = [...standings];

    if (filter === "ranked") {
      list = list.filter((s) => s.totalScore > 0 || s.approvedPrs > 0);
    } else if (filter === "top10") {
      list = list.slice(0, 10);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.displayName.toLowerCase().includes(q) ||
          (s.githubHandle && s.githubHandle.toLowerCase().includes(q)) ||
          (s.slug && s.slug.toLowerCase().includes(q))
      );
    }

    return list;
  }, [standings, filter, query]);

  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 font-mono text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Trophy className="h-3 w-3 text-amber-500" />
          <span>#1</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-300/25 px-2 py-0.5 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-400/20">
          <Medal className="h-3 w-3 text-slate-400" />
          <span>#2</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-700/15 px-2 py-0.5 font-mono text-xs font-bold text-amber-700 dark:text-amber-500 border border-amber-700/20">
          <Medal className="h-3 w-3 text-amber-600" />
          <span>#3</span>
        </span>
      );
    }
    return (
      <span className="font-mono text-xs font-semibold text-muted-foreground">
        #{rank}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {isPublished && publishedAt
            ? `Official snapshot verified: ${new Date(publishedAt).toLocaleDateString()}`
            : "Provisional standings calculated in real time"}
        </span>
        <span className="font-mono text-[11px]">{standings.length} total participants</span>
      </div>

      {/* Control bar: Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search participant or GitHub username..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1 text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({standings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("ranked")}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              filter === "ranked"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            With Points ({standings.filter((s) => s.totalScore > 0).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("top10")}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              filter === "top10"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Top 10
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground select-none">
                <th className="py-3 pl-4 pr-3 text-center w-16">Rank</th>
                <th className="py-3 px-4">Participant</th>
                <th className="py-3 px-4">Connected GitHub</th>
                <th className="py-3 px-4 text-center">Approved PRs</th>
                <th className="py-3 pr-6 pl-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Trophy className="mx-auto h-8 w-8 opacity-40 mb-2" />
                    <p className="font-semibold text-foreground text-sm">No standings found</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      {query
                        ? `No participants match the search query "${query}".`
                        : "No students have registered with contributions yet. Register now to claim your spot on the leaderboard!"}
                    </p>
                    <Link
                      href={`/events/${eventSlug}`}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <span>Register for {eventTitle}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.userId}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Rank */}
                    <td className="py-3.5 pl-4 pr-3 text-center align-middle">
                      {renderRankBadge(s.rank)}
                    </td>

                    {/* Participant Name & Link */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        {s.image ? (
                          <img
                            src={s.image}
                            alt={s.displayName}
                            className="h-8 w-8 rounded-full border border-border object-cover shrink-0"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary shrink-0 border border-border">
                            {s.displayName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            {s.slug ? (
                              <Link
                                href={`/u/${s.slug}`}
                                className="font-semibold text-foreground hover:text-primary transition-colors hover:underline truncate"
                              >
                                {s.displayName}
                              </Link>
                            ) : (
                              <span className="font-semibold text-foreground truncate">
                                {s.displayName}
                              </span>
                            )}
                            <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
                          </div>

                          {s.slug && (
                            <Link
                              href={`/u/${s.slug}`}
                              className="font-mono text-[10px] text-muted-foreground hover:text-foreground block truncate"
                            >
                              acmbitm.campsy.app/u/{s.slug}
                            </Link>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* GitHub Account */}
                    <td className="py-3.5 px-4 align-middle">
                      {s.githubHandle ? (
                        <a
                          href={s.githubProfileUrl || `https://github.com/${s.githubHandle}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground hover:text-primary hover:underline"
                        >
                          <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                          <span>@{s.githubHandle}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                        </a>
                      ) : (
                        <span className="font-mono text-[11px] text-muted-foreground italic">
                          Not linked
                        </span>
                      )}
                    </td>

                    {/* Approved PRs */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      <div className="inline-flex items-center gap-1 font-mono font-semibold text-xs">
                        <GitPullRequest className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{s.approvedPrs}</span>
                        {s.totalPrs > s.approvedPrs && (
                          <span className="text-[10px] text-muted-foreground font-normal">
                            /{s.totalPrs}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Points */}
                    <td className="py-3.5 pr-6 pl-4 text-right align-middle font-mono">
                      <span className="inline-block rounded-md bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
                        {s.totalScore} pts
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
