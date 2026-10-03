
import { getAuthorizedMember } from "@/lib/auth/session";
import { getAllChapterMembers, getAllChapterRoles } from "@/db/queries/members";
import { MembersManager } from "@/components/admin/members-manager";
import { PERMISSIONS } from "@/lib/permissions/constants";
import { Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MembersAdminPage() {
  const context = (await getAuthorizedMember())!;

  const canManage = context.permissions.includes(PERMISSIONS.ADMIN_MANAGE_MEMBERS);

  if (!canManage) {
    return (
      <div className="rounded-xl border border-red-900/60 bg-red-950/20 p-8 text-center space-y-3 font-mono">
        <Shield className="h-8 w-8 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Chapter member governance and roster configuration requires executive administration privileges (President, VP, General Secretary, or Tech Head).
        </p>
      </div>
    );
  }

  const [rawMembers, roles] = await Promise.all([
    getAllChapterMembers(),
    getAllChapterRoles(),
  ]);

  const members = rawMembers.map((m) => ({
    ...m,
    status: m.status as "ACTIVE" | "INACTIVE" | "ALUMNI",
  }));

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">Chapter Governance & Roster</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage member allowlist, appointed chapter titles, and publishing permissions.
        </p>
      </div>

      <MembersManager initialMembers={members} roles={roles} />
    </div>
  );
}
