"use client";

import * as React from "react";
import Link from "next/link";
import { revokeSessionAction } from "@/db/mutations/governance";
import { formatDate } from "@/lib/date";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  KeyRound,
  Users,
  Activity,
  Globe,
  Radio,
  Clock,
} from "lucide-react";

interface SecurityManagerProps {
  overview: {
    recentAudits: {
      id: string;
      action: string;
      targetType: string | null;
      targetId: string | null;
      ipAddress: string | null;
      createdAt: Date;
      details: unknown;
    }[];
    alerts: {
      id: string;
      severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      title: string;
      description: string;
      createdAt: Date;
    }[];
    sessions: {
      id: string;
      userId: string;
      userName: string;
      userEmail: string;
      userAgent: string;
      ipAddress: string;
      expiresAt: Date;
      createdAt: Date;
    }[];
    threatMetrics: {
      totalFailedAuthorizations: number;
      recentRoleChanges: number;
      activeSessionsCount: number;
      systemThreatLevel: string;
    };
  };
  isSuperAdmin: boolean;
}

export function SecurityManager({ overview, isSuperAdmin }: SecurityManagerProps) {
  const [sessions, setSessions] = React.useState(overview.sessions);
  const [revoking, setRevoking] = React.useState<string | null>(null);

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm("Revoke this administrative session? The user will be immediately logged out.")) return;

    setRevoking(sessionId);
    try {
      await revokeSessionAction(sessionId);
      setSessions(sessions.filter((s) => s.id !== sessionId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to revoke session.");
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <span>Chapter Security Platform & Threat Telemetry</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Zero-Trust identity verification, active session monitoring, and real-time operational posture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
            <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
            <span>Threat Level: {overview.threatMetrics.systemThreatLevel}</span>
          </span>
        </div>
      </div>

      {/* Threat Posture Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 font-mono text-xs">
            <span>Threat Posture</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">SECURE</div>
          <p className="text-[11px] font-mono text-zinc-500">Zero-Trust RBAC active</p>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 font-mono text-xs">
            <span>Active Sessions</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {overview.threatMetrics.activeSessionsCount}
          </div>
          <p className="text-[11px] font-mono text-zinc-500">Authenticated sessions</p>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 font-mono text-xs">
            <span>Failed Access</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {overview.threatMetrics.totalFailedAuthorizations}
          </div>
          <p className="text-[11px] font-mono text-zinc-500">Denied or unauthorized</p>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 font-mono text-xs">
            <span>Role Mutations</span>
            <Activity className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {overview.threatMetrics.recentRoleChanges}
          </div>
          <p className="text-[11px] font-mono text-zinc-500">Recent hierarchy audits</p>
        </div>
      </div>

      {/* Main Split: Active Sessions & Threat Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Sessions Manager (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-emerald-400" />
                  <span>Active Administrative Sessions</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Track devices and Cloudflare Edge connections currently accessing the command center.
                </p>
              </div>
              <Link
                href="/admin/security/sessions"
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                View Details
              </Link>
            </div>

            <div className="divide-y divide-zinc-800/80">
              {sessions.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-zinc-500">
                  No active sessions found.
                </div>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/30 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">
                          {s.userName}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          ({s.userEmail})
                        </span>
                      </div>

                      <div className="text-xs text-zinc-400 font-mono truncate max-w-lg">
                        {s.userAgent}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3 text-zinc-400" />
                          <span>IP: {s.ipAddress}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-zinc-400" />
                          <span>Created: {formatDate(s.createdAt.toISOString())}</span>
                        </span>
                      </div>
                    </div>

                    {isSuperAdmin && (
                      <button
                        onClick={() => handleRevokeSession(s.id)}
                        disabled={revoking === s.id}
                        className="px-2.5 py-1 rounded bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900/40 text-xs font-mono transition-colors self-end sm:self-center disabled:opacity-50"
                      >
                        {revoking === s.id ? "Revoking..." : "Revoke"}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Security Policies & Alerts (1 Col) */}
        <div className="space-y-6">
          {/* Security Governance Invariants */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Lock className="h-4 w-4 text-[#E31B23]" />
              <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                Anti-Escalation Controls
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono text-zinc-400">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Self-promotion strictly rejected server-side.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>SUPER_ADMIN grant restricted to bootstrap allowlist.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Domain wildcards disabled (@bitmesra.ac.in).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Zero secrets committed in source code or client JS.</span>
              </div>
            </div>
          </div>

          {/* Recent Security Audits */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#E31B23]" />
                <span>Security Events</span>
              </h3>
              <Link href="/admin/audit" className="text-[11px] font-mono text-zinc-400 hover:text-white">
                Explorer →
              </Link>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {overview.recentAudits.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-zinc-300">{log.action}</span>
                    <span className="text-zinc-500 text-[10px]">
                      {formatDate(log.createdAt.toISOString())}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Source: {log.ipAddress || "Edge"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
