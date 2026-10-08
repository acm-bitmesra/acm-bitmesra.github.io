"use client";

import * as React from "react";
import { createRedirectAction, deleteRedirectAction } from "@/db/mutations/governance";
import { formatDate } from "@/lib/date";
import { ArrowRightLeft } from "lucide-react";
import { Plus, Trash2, ExternalLink, CircleAlert as AlertCircle } from "@animateicons/react/lucide";

interface RedirectItem {
  id: string;
  sourcePath: string;
  targetUrl: string;
  statusCode: number;
  reason: string | null;
  active: boolean;
  createdAt: Date;
}

interface RedirectsManagerProps {
  initialRedirects: RedirectItem[];
}

export function RedirectsManager({ initialRedirects }: RedirectsManagerProps) {
  const [redirects, setRedirects] = React.useState<RedirectItem[]>(initialRedirects);
  const [sourcePath, setSourcePath] = React.useState("");
  const [targetUrl, setTargetUrl] = React.useState("");
  const [statusCode, setStatusCode] = React.useState<number>(307);
  const [reason, setReason] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let cleanSource = sourcePath.trim();
    if (!cleanSource.startsWith("/")) cleanSource = "/" + cleanSource;
    const cleanTarget = targetUrl.trim();

    if (cleanSource === cleanTarget) {
      setError("Self-redirect loop: source path cannot be identical to target.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createRedirectAction({
        sourcePath: cleanSource,
        targetUrl: cleanTarget,
        statusCode,
        reason: reason.trim() || undefined,
      });

      const newRedirect: RedirectItem = {
        id: res.id,
        sourcePath: cleanSource,
        targetUrl: cleanTarget,
        statusCode,
        reason: reason.trim() || null,
        active: true,
        createdAt: new Date(),
      };

      setRedirects([newRedirect, ...redirects]);
      setSourcePath("");
      setTargetUrl("");
      setReason("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create redirect.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this URL redirect? Incoming traffic will return 404.")) return;
    setDeletingId(id);
    try {
      await deleteRedirectAction(id);
      setRedirects(redirects.filter((r) => r.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete redirect.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Create Redirect Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Plus className="h-4 w-4 text-[#E31B23]" />
            <span>Create URL Redirect or Shortlink</span>
          </h3>
          <span className="text-xs text-zinc-500">Fast Cloudflare Edge Routing</span>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-zinc-500 block mb-1">Source Path</label>
            <input
              type="text"
              required
              placeholder="/hackabit"
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-zinc-500 block mb-1">Target Destination URL</label>
            <input
              type="text"
              required
              placeholder="/events/hack-a-bit or https://..."
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div>
            <label className="text-zinc-500 block mb-1">Status Code</label>
            <select
              value={statusCode}
              onChange={(e) => setStatusCode(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-white focus:outline-none focus:border-zinc-700"
            >
              <option value={307}>307 Temporary Redirect</option>
              <option value={308}>308 Permanent Redirect</option>
              <option value={301}>301 Moved Permanently</option>
              <option value={302}>302 Found</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="text-zinc-500 block mb-1">Reason / Note (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Shortlink for Instagram bio or flyer QR code"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Add Redirect"}
            </button>
          </div>
        </form>
      </div>

      {/* Redirects Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-[#E31B23]" />
            <span>Active Redirect Rules ({redirects.length})</span>
          </h3>
          <span className="text-xs text-zinc-500">Real-time Neon Database Records</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {redirects.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-500">
              No custom redirect rules found. Add one above.
            </div>
          ) : (
            redirects.map((r) => (
              <div
                key={r.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/30 transition-colors text-xs"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-sm bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {r.sourcePath}
                    </span>
                    <span className="text-zinc-500">→</span>
                    <span className="text-zinc-300 font-mono truncate max-w-sm">
                      {r.targetUrl}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px]">
                      {r.statusCode}
                    </span>
                  </div>

                  {r.reason && (
                    <div className="text-zinc-400 text-[11px]">{r.reason}</div>
                  )}

                  <div className="text-[10px] text-zinc-500">
                    Created: {formatDate(r.createdAt.toString())}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <a
                    href={r.sourcePath}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    title="Test redirect in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deletingId === r.id}
                    className="p-2 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900/60 disabled:opacity-50"
                    title="Delete redirect"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
