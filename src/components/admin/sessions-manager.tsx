"use client";

import * as React from "react";
import Link from "next/link";
import { revokeSessionAction } from "@/db/mutations/governance";
import { formatDate } from "@/lib/date";
import { KeyRound, ShieldCheck, ArrowLeft, Globe, Laptop, Clock, Trash2 } from "@animateicons/react/lucide";

interface SessionItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
  createdAt: Date;
}

interface SessionsManagerProps {
  sessions: SessionItem[];
  isSuperAdmin: boolean;
}

export function SessionsManager({ sessions: initialSessions, isSuperAdmin }: SessionsManagerProps) {
  const [sessions, setSessions] = React.useState(initialSessions);
  const [revoking, setRevoking] = React.useState<string | null>(null);

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this administrative session? The user will be immediately logged out.")) return;
    setRevoking(id);
    try {
      await revokeSessionAction(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to revoke session.");
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/security"
              className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Security</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-emerald-400" />
            <span>Active Admin Sessions</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {sessions.length} active authenticated admin session(s) in Neon PostgreSQL session store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Zero-Trust Active</span>
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="divide-y divide-zinc-800/80">
          {sessions.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-zinc-500">
              No active administrative sessions found.
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-900/30 transition-colors font-mono"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {s.userName}
                    </span>
                    <span className="text-xs text-zinc-400">
                      &lt;{s.userEmail}&gt;
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                      ID: {s.id.slice(0, 10)}...
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-400 truncate max-w-2xl">
                    <Laptop className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{s.userAgent}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-zinc-400" />
                      <span>IP: {s.ipAddress}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      <span>Issued: {formatDate(s.createdAt.toISOString())}</span>
                    </span>
                    <span>·</span>
                    <span className="text-zinc-500">
                      Expires: {formatDate(s.expiresAt.toISOString())}
                    </span>
                  </div>
                </div>

                {isSuperAdmin && (
                  <button
                    onClick={() => handleRevoke(s.id)}
                    disabled={revoking === s.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900/60 text-xs font-mono transition-colors self-start md:self-center shrink-0 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{revoking === s.id ? "Revoking..." : "Revoke Session"}</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
