import { getAuthorizedMember } from "@/lib/auth/session";
import { DEFAULT_ROLES, PERMISSIONS } from "@/lib/permissions/constants";
import { Shield, Key, CheckCircle2, Lock, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminRolesPage() {
  await getAuthorizedMember();

  const permissionList = Object.entries(PERMISSIONS);
  const permissionCategories: Record<string, string[]> = {};

  permissionList.forEach(([_, val]) => {
    const prefix = val.split(":")[0];
    if (!permissionCategories[prefix]) {
      permissionCategories[prefix] = [];
    }
    permissionCategories[prefix].push(val);
  });

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <Shield className="h-3.5 w-3.5" />
            <span>Role-Based Access Control</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Roles & Granular Permissions Directory
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Server-side Zero-Trust permission tiers, role hierarchy levels, and anti-escalation safeguards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Strict Zero-Trust Model</span>
          </span>
        </div>
      </div>

      {/* Anti-Escalation Safeguards */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Lock className="h-4 w-4 text-[#E31B23]" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            RBAC Invariant Principles
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Hierarchy Barrier</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              No administrator may modify, assign, or promote a user to a hierarchy level equal to or higher than their own.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Root Bootstrap Lock</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              SUPER_ADMIN (Tier 0) assignment is restricted strictly to accounts validated against ADMIN_EMAIL_ALLOWLIST.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Self-Promotion Immunity</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Active sessions cannot edit their own permissions or upgrade their own role key during mutation execution.
            </p>
          </div>
        </div>
      </div>

      {/* Roles Hierarchy List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Layers className="h-4 w-4 text-[#E31B23]" />
            <span>Defined Chapter Roles ({DEFAULT_ROLES.length})</span>
          </div>
          <span className="text-xs text-zinc-500">Tier 0 (Highest) to Tier 6 (Lowest)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFAULT_ROLES.map((role) => (
            <div
              key={role.key}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700/80 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{role.displayName}</h3>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
                      {role.key}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    role.hierarchyLevel === 0
                      ? "bg-red-950 text-red-400 border border-red-800"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                  }`}
                >
                  Tier {role.hierarchyLevel}
                </span>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <span>{role.permissions.length} Granted Permissions</span>
                {role.hierarchyLevel === 0 && (
                  <span className="text-red-400 text-[11px]">Unrestricted Access</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Granular Permissions Catalogue */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Key className="h-4 w-4 text-[#E31B23]" />
            <span>Granular Permission Registry ({permissionList.length} Total)</span>
          </h3>
          <span className="text-xs text-zinc-500">{Object.keys(permissionCategories).length} Domains</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(permissionCategories).map(([domain, perms]) => (
            <div
              key={domain}
              className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white uppercase border-b border-zinc-800 pb-1.5">
                <span className="text-[#E31B23]">{domain}</span>
                <span className="text-zinc-500 text-[10px]">{perms.length} perms</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {perms.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
