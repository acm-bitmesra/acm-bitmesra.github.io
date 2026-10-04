import { getAuthorizedMember } from "@/lib/auth/session";
import { getAuditLogs } from "@/db/queries/audit";
import { AuditExplorer } from "@/components/admin/audit-explorer";
import { Activity } from "lucide-react";
import { PERMISSIONS } from "@/lib/permissions/constants";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const context = (await getAuthorizedMember())!;
  const isSuperAdmin = context.role.hierarchyLevel === 0 || context.role.key === "SUPER_ADMIN";
  const canView = context.permissions.includes(PERMISSIONS.AUDIT_VIEW) || isSuperAdmin;

  if (!canView) {
    return (
      <div className="rounded-xl border border-red-900/60 bg-red-950/20 p-8 text-center space-y-3 font-mono">
        <h2 className="text-lg font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Audit logs contain sensitive security records and can only be accessed by Executive leadership and Super Administrators.
        </p>
      </div>
    );
  }

  const logs = await getAuditLogs(100);

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#E31B23] uppercase tracking-wider mb-1">
          <Activity className="h-3.5 w-3.5" />
          <span>Security & Governance Records</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Audit Log</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Immutable ledger of chapter authorization actions, initial super admin bootstraps, content publications, and permission grants.
        </p>
      </div>

      <AuditExplorer initialLogs={logs} />
    </div>
  );
}
