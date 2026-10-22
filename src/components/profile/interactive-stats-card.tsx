"use client";

import * as React from "react";
import { GithubIcon } from "@/components/ui/icons";
import { Star } from "lucide-react";

interface InteractiveStatsCardProps {
  handle: string;
  theme: string;
  publicRepos?: number;
  followers?: number;
  isTerminal?: boolean;
}

export function InteractiveStatsCard({
  handle,
  theme,
  publicRepos = 0,
  followers = 0,
  isTerminal,
}: InteractiveStatsCardProps) {
  const [statsError, setStatsError] = React.useState(false);
  const [langsError, setLangsError] = React.useState(false);

  // Map theme to standard supported themes in github-readme-stats
  const validTheme = React.useMemo(() => {
    const t = (theme || "").toLowerCase();
    if (t === "terminal" || t === "github_dark") return "github_dark";
    if (t === "editorial") return "onedark";
    return "github_dark";
  }, [theme]);

  const statsUrl = `https://github-readme-stats.vercel.app/api?username=${encodeURIComponent(
    handle
  )}&show_icons=true&theme=${validTheme}&hide_border=true&count_private=true`;

  const langsUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${encodeURIComponent(
    handle
  )}&theme=${validTheme}&show_icons=true&hide_border=true&layout=compact`;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Primary GitHub Stats Card */}
      <div
        className={`rounded-xl border p-4 flex items-center justify-center overflow-hidden min-h-[160px] ${
          isTerminal
            ? "border-zinc-800 bg-zinc-950 font-mono"
            : "border-border bg-card shadow-sm"
        }`}
      >
        {!statsError ? (
          <img
            src={statsUrl}
            alt={`${handle}'s GitHub Statistics`}
            className="w-full max-w-md h-auto"
            loading="lazy"
            onError={() => setStatsError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <GithubIcon className="h-4 w-4" />
              <span>@{handle} GitHub Activity</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono pt-1">
              <span>{publicRepos} Repositories</span>
              <span>·</span>
              <span>{followers} Followers</span>
            </div>
            <a
              href={`https://github.com/${handle}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-primary hover:underline font-medium pt-1"
            >
              View on GitHub →
            </a>
          </div>
        )}
      </div>

      {/* Top Languages Breakdown Card */}
      <div
        className={`rounded-xl border p-4 flex items-center justify-center overflow-hidden min-h-[160px] ${
          isTerminal
            ? "border-zinc-800 bg-zinc-950 font-mono"
            : "border-border bg-card shadow-sm"
        }`}
      >
        {!langsError ? (
          <img
            src={langsUrl}
            alt={`${handle}'s Top Languages`}
            className="w-full max-w-md h-auto"
            loading="lazy"
            onError={() => setLangsError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Star className="h-4 w-4 text-amber-500" />
              <span>Language Distribution</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Telemetry directly integrated with verified GitHub account.
            </p>
            <a
              href={`https://github.com/${handle}?tab=repositories`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-primary hover:underline font-medium pt-1"
            >
              Browse Repositories →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
