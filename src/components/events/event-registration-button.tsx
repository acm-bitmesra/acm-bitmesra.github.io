"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle, Loader2, ArrowRight, Trophy, AlertCircle } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

interface GitHubAccountInfo {
  handle: string;
  profileUrl: string;
  isVerified: boolean;
  avatarUrl?: string | null;
}

interface EventStats {
  contributionsCount: number;
  approvedCount: number;
  totalScore: number;
  rank?: number | null;
}

interface EventRegistrationButtonProps {
  slug: string;
  isUpcoming: boolean;
  registrationUrl?: string | null;
}

export function EventRegistrationButton({
  slug,
  isUpcoming,
  registrationUrl,
}: EventRegistrationButtonProps) {
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [authStatus, setAuthStatus] = React.useState<{
    authenticated: boolean;
    registered: boolean;
    githubAccount: GitHubAccountInfo | null;
    stats: EventStats;
  }>({
    authenticated: false,
    registered: false,
    githubAccount: null,
    stats: {
      contributionsCount: 0,
      approvedCount: 0,
      totalScore: 0,
      rank: null,
    },
  });

  const isHacktoberfest = slug === "hacktoberfest-2026";

  const fetchStatus = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${slug}/status`);
      if (res.ok) {
        const data = await res.json();
        setAuthStatus({
          authenticated: Boolean(data.authenticated),
          registered: Boolean(data.registered),
          githubAccount: data.githubAccount || null,
          stats: data.stats || {
            contributionsCount: 0,
            approvedCount: 0,
            totalScore: 0,
            rank: null,
          },
        });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [slug]);

  React.useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const [contactNumber, setContactNumber] = React.useState("");

  const handleRegister = async () => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/events/${slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactNo: contactNumber.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register for event");
      }

      await fetchStatus();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error during registration");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isUpcoming) return null;

  if (loading) {
    return (
      <div className="mt-5 flex min-h-12 items-center justify-center rounded-lg border border-border bg-muted/40">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 1. User is registered
  if (authStatus.registered) {
    return (
      <div className="mt-5 space-y-3">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-foreground">
          <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>You are registered for this event!</span>
          </div>

          {authStatus.githubAccount && (
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground border-t border-emerald-500/15 pt-2">
              <GithubIcon className="h-3.5 w-3.5" />
              <span>Tracking:</span>
              <a
                href={authStatus.githubAccount.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono font-medium text-foreground hover:underline"
              >
                @{authStatus.githubAccount.handle}
              </a>
            </div>
          )}

          {/* Quick stats pills */}
          {isHacktoberfest && (
            <div className="mt-2.5 grid grid-cols-2 gap-2 border-t border-emerald-500/15 pt-2.5 font-mono text-[11px]">
              <div className="rounded bg-background/60 p-1.5 text-center">
                <span className="text-muted-foreground block text-[10px]">Approved PRs</span>
                <span className="font-bold text-foreground text-xs">
                  {authStatus.stats.approvedCount}
                </span>
              </div>
              <div className="rounded bg-background/60 p-1.5 text-center">
                <span className="text-muted-foreground block text-[10px]">Points / Rank</span>
                <span className="font-bold text-foreground text-xs">
                  {authStatus.stats.totalScore} pts {authStatus.stats.rank ? `(#${authStatus.stats.rank})` : ""}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action: View Rankings (only for Hacktoberfest / ranking-based events) */}
        {isHacktoberfest && (
          <Link
            href={`/events/${slug}/rankings`}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-300" />
            <span>View Live Rankings & Standings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}

        {/* Secondary: Dashboard Events */}
        <Link
          href="/dashboard/events"
          className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <span>Manage in Student Dashboard</span>
        </Link>
      </div>
    );
  }

  // 2. User is authenticated
  if (authStatus.authenticated) {
    // If Hacktoberfest requires GitHub and user has not connected GitHub yet
    if (isHacktoberfest && !authStatus.githubAccount) {
      return (
        <div className="mt-5 space-y-3">
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-foreground">
            <div className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400">
              <GithubIcon className="h-4 w-4 shrink-0" />
              <span>GitHub Account Required</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              To participate in Hacktoberfest 2026, link your GitHub account so your open-source pull requests can be automatically tracked and evaluated on the leaderboard.
            </p>
          </div>

          <Link
            href={`/api/integrations/github/connect?returnTo=/events/${slug}`}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#24292e] dark:bg-[#1f2428] px-4 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-opacity"
          >
            <GithubIcon className="h-4 w-4" />
            <span>Connect GitHub to Register</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      );
    }

    // Authenticated and ready to register
    return (
      <div className="mt-5 space-y-3">
        {authStatus.githubAccount && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <GithubIcon className="h-3.5 w-3.5" />
              <span className="text-muted-foreground">GitHub:</span>
              <span className="font-mono font-medium text-foreground">
                @{authStatus.githubAccount.handle}
              </span>
            </div>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Connected
            </span>
          </div>
        )}

        {/* Optional Contact Number Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
            <span>Contact Number (Optional)</span>
            <span className="text-[10px] text-muted-foreground/70">for updates</span>
          </label>
          <input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleRegister}
          disabled={submitting}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Registering...</span>
            </>
          ) : (
            <>
              <span>
                Register for {isHacktoberfest ? "Hacktoberfest 2026" : slug === "cybersecurity-workshop-2026" ? "Cybersecurity Workshop" : "Event"}
              </span>
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>

        {isHacktoberfest && (
          <Link
            href={`/events/${slug}/rankings`}
            className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>View Live Leaderboard</span>
          </Link>
        )}
      </div>
    );
  }

  // 3. User is not authenticated
  return (
    <div className="mt-5 space-y-2">
      <Link
        href={`/login?callbackUrl=/events/${slug}`}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        <span>Sign in with University Email to Register</span>
        <span aria-hidden="true">→</span>
      </Link>

      {isHacktoberfest && (
        <Link
          href={`/events/${slug}/rankings`}
          className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          <span>View Live Leaderboard</span>
        </Link>
      )}

      {registrationUrl && (
        <a
          href={registrationUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-9 w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:underline"
        >
          <span>External details</span>
        </a>
      )}
    </div>
  );
}
