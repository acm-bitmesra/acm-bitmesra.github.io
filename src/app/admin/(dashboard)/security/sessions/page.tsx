import { getAuthorizedMember } from "@/lib/auth/session";
import { getActiveAdminSessions } from "@/db/queries/governance";
import { SessionsManager } from "@/components/admin/sessions-manager";
import { Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSessionsPage() {
  const context = (await getAuthorizedMember())!;
  const isSuperAdmin =
    context.role.hierarchyLevel === 0 || context.role.key === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return (
      <div className="rounded-xl border border-red-900/60 bg-red-950/20 p-8 text-center space-y-3 font-mono">
        <Lock className="h-8 w-8 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Super Admin Access Only</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Active session revocation requires Level 0 SUPER_ADMIN authority.
        </p>
      </div>
    );
  }

  const sessions = await getActiveAdminSessions();

  return <SessionsManager sessions={sessions} isSuperAdmin={isSuperAdmin} />;
}
