import { getAuthorizedMember } from "@/lib/auth/session";
import { teamMembers } from "@/data/team";
import Link from "next/link";
import { Users, ShieldCheck, ExternalLink, Award, Plus, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  await getAuthorizedMember();

  const faculty = teamMembers.filter((m) => m.category === "faculty");
  const executive = teamMembers.filter((m) => m.category === "executive");

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <Users className="h-3.5 w-3.5" />
            <span>Executive Governance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Executive Committee & Faculty
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Official chapter office bearers, faculty advisory board, and executive portfolios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/team"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs transition-colors"
          >
            <span>Public Roster</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
          <Link
            href="/admin/members"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white text-xs font-medium transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Manage All Members</span>
          </Link>
        </div>
      </div>

      {/* Faculty Advisory */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <Award className="h-4 w-4 text-[#E31B23]" />
          <span>Faculty Advisory & Sponsorship</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faculty.map((member) => (
            <div
              key={member.slug}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-start gap-4"
            >
              <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  member.name.charAt(0)
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">{member.name}</h3>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800/80 text-[10px] text-emerald-400">
                    ADVISOR
                  </span>
                </div>
                <div className="text-xs text-[#E31B23] font-semibold">{member.role}</div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Committee */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Current Executive Board</span>
          </div>
          <span className="text-xs text-zinc-500">{executive.length} Officers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {executive.map((member) => (
            <div
              key={member.slug}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700/80 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                  {member.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{member.name}</h4>
                  <div className="text-xs text-[#E31B23] font-semibold">{member.role}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{member.batch || "Executive Term"}</div>
                </div>

                {member.bio && (
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <Link
                  href={`/team/${member.slug}`}
                  target="_blank"
                  className="hover:text-white flex items-center gap-1"
                >
                  <span>Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
