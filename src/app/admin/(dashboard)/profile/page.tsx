import { getAuthorizedMember } from "@/lib/auth/session";
import { AdminSignOutButton } from "@/components/admin/sign-out-button";
import {
  ShieldCheck,
  User,
  Mail,
  Award,
  Layers,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const context = (await getAuthorizedMember())!;
  const isSuperAdmin =
    context.role.hierarchyLevel === 0 || context.role.key === "SUPER_ADMIN";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E31B23] uppercase tracking-wider mb-1">
            <User className="h-3.5 w-3.5" />
            <span>Identity & Security</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin Profile & Permissions
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Authenticated session identity, assigned RBAC tier, and active operational scope.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AdminSignOutButton />
        </div>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 flex flex-col items-center text-center space-y-4 font-mono">
          <div className="h-20 w-20 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-2xl font-bold text-white overflow-hidden shadow-lg">
            {context.user.image ? (
              <img
                src={context.user.image}
                alt={context.member.name}
                className="h-full w-full object-cover"
              />
            ) : (
              context.member.name.charAt(0)
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">{context.member.name}</h2>
            <div className="text-xs text-zinc-400 flex items-center justify-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{context.user.email}</span>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-zinc-800/80 space-y-2 text-left text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Member ID:</span>
              <span className="text-zinc-200">{context.member.id}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Account Status:</span>
              <span className="text-emerald-400 font-bold uppercase">
                {context.member.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Allowlist Status:</span>
              <span className="text-emerald-400">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Role & Hierarchy Card */}
        <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-5 font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[#E31B23]" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Assigned Role & Hierarchy
              </h3>
            </div>
            {isSuperAdmin && (
              <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-[10px] font-bold text-red-400 uppercase">
                ROOT SUPER ADMIN
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1">
              <div className="text-xs text-zinc-500">Official Role Title</div>
              <div className="text-base font-bold text-white">{context.role.displayName}</div>
              <div className="text-[11px] text-zinc-400">{context.role.description}</div>
            </div>

            <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1">
              <div className="text-xs text-zinc-500">Hierarchy Level</div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>Tier {context.role.hierarchyLevel}</span>
                <span className="text-xs font-normal text-zinc-400">
                  ({context.role.hierarchyLevel === 0 ? "Highest Authority" : "Subordinate"})
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">
                Key: <code className="text-zinc-200">{context.role.key}</code>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
              <Layers className="h-4 w-4 text-indigo-400" />
              <span>Granted Permissions ({context.permissions.length})</span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              {context.permissions.map((perm) => (
                <span
                  key={perm}
                  className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/80 text-[11px] text-zinc-300 font-mono"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Invariants Checklist */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Zero-Trust Session Guard Verification
            </h3>
          </div>
          <Link
            href="/admin/security"
            className="text-xs text-zinc-400 hover:text-white"
          >
            Security Console →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-semibold">Strict Server-Side Auth</div>
              <div className="text-zinc-400 text-[11px]">
                Client cookies and local storage tokens are validated against PostgreSQL sessions on every request.
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-semibold">Anti-Escalation Barrier</div>
              <div className="text-zinc-400 text-[11px]">
                Users cannot grant roles equal to or higher than their own hierarchy tier.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
