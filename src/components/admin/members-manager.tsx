"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  addChapterMemberAction,
  updateChapterMemberAction,
} from "@/db/mutations/members";
import {
  UserPlus,
  ShieldCheck,
  Mail,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface MemberItem {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  roleId: string;
  status: "ACTIVE" | "INACTIVE" | "ALUMNI";
  isActive: boolean;
  termStart?: string | null;
  createdAt: Date;
  roleName: string;
  roleDisplayName: string;
  roleTier: number;
}

interface RoleItem {
  id: string;
  key: string;
  displayName: string;
  hierarchyLevel: number;
}

interface MembersManagerProps {
  initialMembers: MemberItem[];
  roles: RoleItem[];
}

export function MembersManager({ initialMembers, roles }: MembersManagerProps) {
  const router = useRouter();

  // Add Member State
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [roleId, setRoleId] = React.useState(roles[roles.length - 1]?.id || "");
  const termStart = "2026-27";
  const [loading, setLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setStatusMessage(null);

      if (!name.trim() || !email.trim() || !roleId) {
        throw new Error("Please complete name, email, and chapter role.");
      }

      await addChapterMemberAction({
        name,
        email,
        roleId,
        termStart,
      });

      setStatusMessage({
        type: "success",
        text: `Authorized ${name} (${email}) into the chapter roster.`,
      });

      setName("");
      setEmail("");
      router.refresh();
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to add member.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (member: MemberItem) => {
    try {
      await updateChapterMemberAction({
        memberId: member.id,
        isActive: !member.isActive,
        status: member.isActive ? "INACTIVE" : "ACTIVE",
      });
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to toggle status.");
    }
  };

  const handleRoleChange = async (memberId: string, newRoleId: string) => {
    try {
      await updateChapterMemberAction({
        memberId,
        roleId: newRoleId,
      });
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update role.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Status Alert */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${
            statusMessage.type === "success"
              ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-300"
              : "bg-red-950/40 border-red-800/80 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-zinc-500 hover:text-white px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Add Member Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <UserPlus className="h-4 w-4 text-[#E31B23]" />
          <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
            Authorize New Chapter Contributor
          </h2>
        </div>

        <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shourya Sharma"
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-[#E31B23] focus:outline-none text-white text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Google Account Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@bitmesra.ac.in"
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-[#E31B23] focus:outline-none text-white text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Chapter Role & Governance *
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-[#E31B23] focus:outline-none text-white text-xs font-mono"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.displayName} (Level {r.hierarchyLevel})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2 lg:col-span-1 flex flex-col justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white font-medium text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{loading ? "Adding..." : "Add to Roster"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Roster Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Active Chapter Roster</h3>
            <p className="text-xs text-zinc-400">
              Only authorized members on this allowlist can log in, draft, and publish to ACM BIT Mesra.
            </p>
          </div>
          <span className="font-mono text-xs text-zinc-500">
            {initialMembers.length} Members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Google Email</th>
                <th className="py-3 px-4">Assigned Chapter Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Access Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {initialMembers.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-white shrink-0 overflow-hidden">
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" />
                        ) : (
                          m.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-xs flex items-center gap-1">
                          <span>{m.name}</span>
                          <ShieldCheck className="h-3 w-3 text-[#E31B23]" />
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          Term: {m.termStart || "2026-27"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-zinc-300">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Mail className="h-3 w-3 text-zinc-500" />
                      <span>{m.email}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={m.roleId}
                      onChange={(e) => handleRoleChange(m.id, e.target.value)}
                      className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[#E31B23] focus:outline-none"
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.displayName}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] uppercase px-2 py-0.5 rounded border inline-block ${
                        m.isActive
                          ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400"
                          : "bg-red-950/40 border-red-800/60 text-red-400"
                      }`}
                    >
                      {m.isActive ? "ACTIVE" : "SUSPENDED"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(m)}
                      className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title={m.isActive ? "Suspend Access" : "Activate Access"}
                    >
                      {m.isActive ? (
                        <ToggleRight className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-zinc-600" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
