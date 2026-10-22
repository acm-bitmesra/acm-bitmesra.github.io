"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Trash2,
  Code2,
  Loader2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

interface ConnectedAccount {
  id: string;
  provider: string;
  handle: string;
  profileUrl: string;
  isVerified: boolean;
  metadata?: unknown;
  lastSyncedAt?: string | Date | null;
}

interface ConnectedAccountsViewProps {
  initialAccounts: ConnectedAccount[];
  errorParam?: string | null;
  successParam?: string | null;
}

export function ConnectedAccountsView({
  initialAccounts,
  errorParam,
  successParam,
}: ConnectedAccountsViewProps) {
  const router = useRouter();
  const [cfHandle, setCfHandle] = React.useState("");
  const [loadingCf, setLoadingCf] = React.useState(false);
  const [syncingGh, setSyncingGh] = React.useState(false);
  const [disconnecting, setDisconnecting] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; text: string } | null>(
    errorParam
      ? { type: "error", text: errorParam.replace(/_/g, " ") }
      : successParam
      ? { type: "success", text: successParam.replace(/_/g, " ") }
      : null
  );

  const ghAccount = initialAccounts.find((a) => a.provider === "github");
  const cfAccount = initialAccounts.find((a) => a.provider === "codeforces");

  const ghMeta = (ghAccount?.metadata || {}) as Record<string, unknown>;
  const cfMeta = (cfAccount?.metadata || {}) as Record<string, unknown>;

  // Codeforces Connect
  const handleConnectCodeforces = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cfHandle.trim()) return;

    setLoadingCf(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/integrations/codeforces/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: cfHandle.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to verify Codeforces handle");
      }

      setFeedback({
        type: "success",
        text: `Connected Codeforces handle '${data.profile?.handle}' (Rating: ${data.profile?.rating})!`,
      });
      setCfHandle("");
      router.refresh();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Error connecting Codeforces",
      });
    } finally {
      setLoadingCf(false);
    }
  };

  // GitHub Sync
  const handleSyncGithub = async () => {
    setSyncingGh(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/integrations/github/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sync GitHub");
      setFeedback({ type: "success", text: "GitHub stats synced successfully!" });
      router.refresh();
    } catch (err) {
      setFeedback({ type: "error", text: err instanceof Error ? err.message : "Sync failed" });
    } finally {
      setSyncingGh(false);
    }
  };

  // Disconnect
  const handleDisconnect = async (provider: "github" | "codeforces") => {
    if (!confirm(`Are you sure you want to disconnect ${provider.toUpperCase()}?`)) return;

    setDisconnecting(provider);
    setFeedback(null);

    try {
      const res = await fetch(`/api/integrations/${provider}/disconnect`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to disconnect");
      setFeedback({ type: "success", text: `${provider.toUpperCase()} disconnected.` });
      router.refresh();
    } catch (err) {
      setFeedback({ type: "error", text: err instanceof Error ? err.message : "Disconnect failed" });
    } finally {
      setDisconnecting(null);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`rounded-lg p-4 text-xs font-medium ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* GitHub Integration Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
              <GithubIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">GitHub Developer Account</h3>
                {ghAccount && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" />
                    Verified OAuth
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Cryptographically verifies repository ownership and enables automated participation in ACM open source contribution challenges.
              </p>
            </div>
          </div>

          <div>
            {ghAccount ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncGithub}
                  disabled={syncingGh}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${syncingGh ? "animate-spin" : ""}`} />
                  <span>Sync</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDisconnect("github")}
                  disabled={disconnecting === "github"}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <a
                href="/api/integrations/github/connect"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
                <span>Connect GitHub</span>
              </a>
            )}
          </div>
        </div>

        {ghAccount && (
          <div className="mt-4 rounded-lg border border-border/80 bg-muted/40 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                {typeof ghMeta.avatarUrl === "string" ? (
                  <img
                    src={ghMeta.avatarUrl}
                    alt={ghAccount.handle}
                    className="h-8 w-8 rounded-full border border-border"
                  />
                ) : null}
                <div>
                  <a
                    href={ghAccount.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs font-semibold text-foreground hover:underline inline-flex items-center gap-1"
                  >
                    @{ghAccount.handle}
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                  <div className="text-[11px] text-muted-foreground">
                    {String(ghMeta.name || ghAccount.handle)}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 font-mono text-xs text-muted-foreground">
                <div>
                  <span className="font-semibold text-foreground">{String(ghMeta.publicRepos || 0)}</span>{" "}
                  repos
                </div>
                <div>
                  <span className="font-semibold text-foreground">{String(ghMeta.followers || 0)}</span>{" "}
                  followers
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Codeforces Integration Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
              <Code2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">Codeforces Handle</h3>
                {cfAccount && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" />
                    Verified Official API
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Verified via the official Codeforces API to showcase your competitive programming tier and rating.
              </p>
            </div>
          </div>

          {cfAccount && (
            <button
              type="button"
              onClick={() => handleDisconnect("codeforces")}
              disabled={disconnecting === "codeforces"}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10 disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
              <span>Disconnect</span>
            </button>
          )}
        </div>

        {cfAccount ? (
          <div className="mt-4 rounded-lg border border-border/80 bg-muted/40 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <a
                  href={cfAccount.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs font-semibold text-foreground hover:underline inline-flex items-center gap-1"
                >
                  {cfAccount.handle}
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
                <div className="mt-1">
                  <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[10px] font-bold text-secondary-foreground uppercase">
                    {String(cfMeta.rank || "unrated")}
                  </span>
                </div>
              </div>

              <div className="font-mono text-xs text-muted-foreground">
                Rating:{" "}
                <span className="font-bold text-foreground text-sm">
                  {String(cfMeta.rating || 0)}
                </span>{" "}
                (Max: {String(cfMeta.maxRating || 0)})
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConnectCodeforces} className="mt-4 flex gap-2">
            <input
              type="text"
              required
              value={cfHandle}
              onChange={(e) => setCfHandle(e.target.value)}
              placeholder="Enter your Codeforces handle (e.g. tourist)"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loadingCf || !cfHandle.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loadingCf && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Verify & Connect</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
