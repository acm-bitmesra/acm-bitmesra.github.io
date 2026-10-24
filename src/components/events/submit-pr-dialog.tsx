"use client";

import * as React from "react";
import Link from "next/link";
import {
  GitPullRequest,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
  X,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

export interface UserContributionItem {
  id: string;
  prNumber: number;
  prTitle: string;
  prUrl: string;
  repoOwner: string;
  repoName: string;
  prState: string;
  isMerged: boolean;
  reviewStatus: "PENDING" | "APPROVED" | "REJECTED" | "DISQUALIFIED";
  assignedScore: number;
  reviewerNotes?: string | null;
  createdAt: string | Date;
}

interface SubmitPrDialogProps {
  eventSlug: string;
  eventTitle?: string;
  buttonLabel?: string;
  buttonVariant?: "primary" | "secondary" | "outline" | "compact";
  className?: string;
  onPrSubmitted?: () => void;
}

export function SubmitPrDialog({
  eventSlug,
  eventTitle = "Hacktoberfest 2026",
  buttonLabel = "Submit Pull Request",
  buttonVariant = "primary",
  className = "",
  onPrSubmitted,
}: SubmitPrDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [loadingStatus, setLoadingStatus] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const [authStatus, setAuthStatus] = React.useState<{
    authenticated: boolean;
    registered: boolean;
    githubAccount: { handle: string; profileUrl: string } | null;
    contributions: UserContributionItem[];
  }>({
    authenticated: false,
    registered: false,
    githubAccount: null,
    contributions: [],
  });

  const [prUrl, setPrUrl] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const fetchStatus = React.useCallback(async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch(`/api/events/${eventSlug}/status`);
      if (res.ok) {
        const data = await res.json();
        setAuthStatus({
          authenticated: Boolean(data.authenticated),
          registered: Boolean(data.registered),
          githubAccount: data.githubAccount || null,
          contributions: Array.isArray(data.contributions) ? data.contributions : [],
        });
      }
    } catch (err) {
      console.warn("Failed to load event status:", err);
    } finally {
      setLoadingStatus(false);
    }
  }, [eventSlug]);

  React.useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, fetchStatus]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanUrl = prUrl.trim();
    if (!cleanUrl) {
      setErrorMessage("Please enter a valid GitHub pull request link.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${eventSlug}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prUrl: cleanUrl,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit pull request");
      }

      setSuccessMessage(data.message || "Pull request submitted successfully!");
      setPrUrl("");
      setNotes("");
      await fetchStatus();
      onPrSubmitted?.();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (candidateId: string) => {
    if (!confirm("Are you sure you want to remove this pull request submission?")) {
      return;
    }

    setDeletingId(candidateId);
    setErrorMessage(null);
    try {
      const res = await fetch(
        `/api/events/${eventSlug}/contributions?id=${encodeURIComponent(candidateId)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to remove submission");
      }
      await fetchStatus();
      onPrSubmitted?.();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setDeletingId(null);
    }
  };

  const buttonStyle =
    buttonVariant === "primary"
      ? "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
      : buttonVariant === "secondary"
      ? "inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-3.5 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors"
      : buttonVariant === "compact"
      ? "inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      : "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${buttonStyle} ${className}`}
      >
        <GitPullRequest className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        <span>{buttonLabel}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-background p-5 sm:p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <GitPullRequest className="h-4 w-4" />
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Submit Pull Request
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Add your open-source PR link for <span className="font-semibold text-foreground">{eventTitle}</span> to track live points on the leaderboard.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {loadingStatus ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !authStatus.authenticated ? (
              /* Case 1: Not authenticated */
              <div className="rounded-xl border border-border bg-muted/30 p-6 text-center space-y-3">
                <AlertCircle className="mx-auto h-8 w-8 text-amber-500" />
                <h3 className="text-sm font-bold text-foreground">
                  Sign in required to submit PRs
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Please sign in with your university account (@bitmesra.ac.in) to submit and track your contributions.
                </p>
                <div className="pt-2">
                  <Link
                    href={`/login?callbackUrl=/events/${eventSlug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <span>Sign In with University Account</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ) : !authStatus.registered ? (
              /* Case 2: Authenticated but not registered */
              <div className="rounded-xl border border-border bg-muted/30 p-6 text-center space-y-3">
                <AlertCircle className="mx-auto h-8 w-8 text-amber-500" />
                <h3 className="text-sm font-bold text-foreground">
                  Event Registration Required
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  You must be registered for {eventTitle} before submitting pull requests to the live challenge.
                </p>
                <div className="pt-2">
                  <Link
                    href={`/events/${eventSlug}`}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <span>Go to Event Registration</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Case 3: Registered & Ready to Submit */
              <div className="space-y-5">
                {/* Connected GitHub account indicator */}
                {authStatus.githubAccount ? (
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3.5 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <GithubIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Connected GitHub:</span>
                      <a
                        href={authStatus.githubAccount.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono font-semibold text-foreground hover:underline inline-flex items-center gap-1"
                      >
                        @{authStatus.githubAccount.handle}
                        <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                      </a>
                    </div>
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Active Contributor
                    </span>
                  </div>
                ) : (
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-foreground">
                    <div className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400">
                      <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>Note on PR Ownership</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      Ensure the pull request was authored by you. Pull requests will be evaluated under your university profile.
                    </p>
                  </div>
                )}

                {/* Submission Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>GitHub Pull Request Link</span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        https://github.com/owner/repo/pull/123
                      </span>
                    </label>
                    <input
                      type="url"
                      value={prUrl}
                      onChange={(e) => setPrUrl(e.target.value)}
                      placeholder="https://github.com/acm-bitmesra/NexHound/pull/1"
                      required
                      className="w-full rounded-lg border border-border bg-card px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Eligible: Public PRs to ACM BIT Mesra repos, curated open-weight AI projects, or challenge repositories.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>Contribution Summary / Notes (Optional)</span>
                      <span className="text-[10px] text-muted-foreground">max 500 chars</span>
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Implemented CLI diagnostics flag, fixed documentation"
                      maxLength={500}
                      className="w-full rounded-lg border border-border bg-card px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {errorMessage && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{errorMessage}</span>
                    </div>
                  )}

                  {successMessage && (
                    <div className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{successMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !prUrl.trim()}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Verifying & Recording Pull Request...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Pull Request to Challenge</span>
                      </>
                    )}
                  </button>
                </form>

                {/* User's Submitted PRs List */}
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span>Your Submitted Pull Requests</span>
                      <span className="rounded-full bg-secondary px-2 py-0.2 font-mono text-[10px]">
                        {authStatus.contributions.length}
                      </span>
                    </h3>

                    <Link
                      href={`/events/${eventSlug}/rankings`}
                      onClick={() => setIsOpen(false)}
                      className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      <span>View Live Rankings</span>
                    </Link>
                  </div>

                  {authStatus.contributions.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      No pull requests submitted yet. Paste your GitHub PR link above to claim your spot on the live standings!
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {authStatus.contributions.map((c) => {
                        const isApproved = c.reviewStatus === "APPROVED";
                        const isPending = c.reviewStatus === "PENDING";

                        return (
                          <div
                            key={c.id}
                            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 text-xs transition-colors hover:border-primary/40"
                          >
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-bold text-foreground truncate">
                                  {c.repoOwner}/{c.repoName}#{c.prNumber}
                                </span>

                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                    isApproved
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                      : isPending
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {isApproved
                                    ? `Approved (+${c.assignedScore} pts)`
                                    : isPending
                                    ? `Pending (+${c.assignedScore} pts prov.)`
                                    : "Rejected"}
                                </span>

                                {c.isMerged && (
                                  <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-purple-600 dark:text-purple-400">
                                    Merged
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] text-muted-foreground truncate">
                                {c.prTitle}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={c.prUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                title="Open PR on GitHub"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>

                              <button
                                type="button"
                                onClick={() => handleDelete(c.id)}
                                disabled={deletingId === c.id}
                                className="rounded p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors disabled:opacity-50"
                                title="Delete submission"
                              >
                                {deletingId === c.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
