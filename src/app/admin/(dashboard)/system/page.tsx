import { getAuthorizedMember } from "@/lib/auth/session";
import { getSystemHealthReport } from "@/db/queries/system";
import { Server, ShieldCheck, Database, Lock, Key, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSystemPage() {
  const context = (await getAuthorizedMember())!;
  const isSuperAdmin = context.role.hierarchyLevel === 0 || context.role.key === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return (
      <div className="rounded-xl border border-red-900/60 bg-red-950/20 p-8 text-center space-y-3 font-mono">
        <Lock className="h-8 w-8 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Super Admin Access Only</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          System telemetry and infrastructure security controls require Level 0 SUPER_ADMIN authority.
        </p>
      </div>
    );
  }

  const report = await getSystemHealthReport();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#E31B23] uppercase tracking-wider mb-1">
          <Server className="h-3.5 w-3.5" />
          <span>Infrastructure & Telemetry</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Health & Security Console</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Real-time diagnostics, Zero-Trust compliance verification, and Cloudflare Worker runtime telemetry.
        </p>
      </div>

      {/* Top Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">Database Engine</span>
            <Database className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <span>{report.status}</span>
            <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              {report.dbLatencyMs}ms
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">Neon Serverless PostgreSQL (AWS us-east-2)</div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">Security Architecture</span>
            <Lock className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">Zero-Trust</div>
          <div className="text-[11px] text-zinc-500 font-mono">Server-side multi-tier RBAC enforced</div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">Runtime Environment</span>
            <Server className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white capitalize">{report.environment}</div>
          <div className="text-[11px] text-zinc-500 font-mono">Cloudflare Workers / OpenNext Edge</div>
        </div>
      </div>

      {/* Security Invariants & Allowlist Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Bootstrap Allowlist */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Key className="h-4 w-4 text-[#E31B23]" />
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Bootstrap Administrator Allowlist
            </h3>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Only accounts specified in <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">ADMIN_EMAIL_ALLOWLIST</code> are eligible for initial SUPER_ADMIN role assignment. Exact lowercase equality is enforced; wildcard domains are rejected.
          </p>

          <div className="space-y-2 font-mono text-xs">
            {report.allowlist.map((email) => (
              <div
                key={email}
                className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between"
              >
                <span className="text-white">{email}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                  ALLOWLISTED
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Security Safeguards Matrix */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <ShieldCheck className="h-4 w-4 text-[#E31B23]" />
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Platform Security Checklist
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-semibold">Zero Secrets in Source Code</div>
                <div className="text-zinc-400 text-[11px]">All fallback credentials eliminated from repository HEAD.</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-semibold">Server-Only Configuration Guard</div>
                <div className="text-zinc-400 text-[11px]">Runtime check prevents client bundles from importing server config.</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-semibold">Immutable Audit Trail</div>
                <div className="text-zinc-400 text-[11px]">{report.metrics.totalAuditLogs} security and governance events recorded.</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-semibold">Role Hierarchy Governance</div>
                <div className="text-zinc-400 text-[11px]">Subordinates cannot modify, promote, or deactivate higher tiers.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Entity Count Matrix */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Database Entity Matrix
          </h3>
          <span className="text-xs text-zinc-500">Live PostgreSQL Table Counts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-zinc-400">Chapter Members</div>
            <div className="text-xl font-bold text-white mt-1">{report.metrics.totalMembers}</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-zinc-400">Knowledge Posts</div>
            <div className="text-xl font-bold text-white mt-1">{report.metrics.totalPosts}</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-zinc-400">Chapter Events</div>
            <div className="text-xl font-bold text-white mt-1">{report.metrics.totalEvents}</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-zinc-400">Curated Resources</div>
            <div className="text-xl font-bold text-white mt-1">{report.metrics.totalResources}</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-zinc-400">Active Sessions</div>
            <div className="text-xl font-bold text-white mt-1">{report.metrics.activeSessions}</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-zinc-400">Super Admins</div>
            <div className="text-xl font-bold text-white mt-1">{report.metrics.superAdmins}</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-zinc-400">Audit Logs</div>
            <div className="text-xl font-bold text-white mt-1">{report.metrics.totalAuditLogs}</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-zinc-400">DB Response</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{report.dbLatencyMs}ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}
