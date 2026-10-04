"use client";

import * as React from "react";
import { User, Calendar, Search } from "lucide-react";
import { formatDate } from "@/lib/date";

interface AuditLogItem {
  id: string;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  details?: unknown;
  ipAddress?: string | null;
  createdAt: Date;
  memberId?: string | null;
  memberName?: string | null;
  memberEmail?: string | null;
}

interface AuditExplorerProps {
  initialLogs: AuditLogItem[];
}

export function AuditExplorer({ initialLogs }: AuditExplorerProps) {
  const [filterAction, setFilterAction] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const actionTypes = Array.from(new Set(initialLogs.map((l) => l.action)));

  const filteredLogs = initialLogs.filter((log) => {
    if (filterAction !== "ALL" && log.action !== filterAction) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = log.memberName?.toLowerCase().includes(q);
      const matchEmail = log.memberEmail?.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchAction) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Action Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by operator, email, or action..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Actions ({initialLogs.length})</option>
            {actionTypes.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden font-mono text-xs">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between text-zinc-400">
          <span>Security & Governance Audit Trail</span>
          <span>{filteredLogs.length} events logged</span>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              No audit logs match your filter criteria.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 space-y-2 hover:bg-zinc-900/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        log.action.includes("BOOTSTRAP")
                          ? "bg-purple-950/40 border-purple-800/60 text-purple-400"
                          : log.action.includes("AUTHORIZED") || log.action.includes("GRANTED")
                          ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400"
                          : log.action.includes("DELETED") || log.action.includes("REVOKED")
                          ? "bg-red-950/40 border-red-800/60 text-red-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300"
                      }`}
                    >
                      {log.action}
                    </span>

                    {log.targetType && (
                      <span className="text-[10px] text-zinc-500 uppercase">
                        [{log.targetType}]
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(log.createdAt.toISOString())}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-zinc-400 text-[11px]">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-zinc-500" />
                    <span>
                      Operator:{" "}
                      <span className="text-zinc-200 font-semibold">
                        {log.memberName || "System Automation"}
                      </span>
                      {log.memberEmail && (
                        <span className="text-zinc-500 ml-1">({log.memberEmail})</span>
                      )}
                    </span>
                  </div>

                  {log.details ? (
                    <button
                      onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                      className="text-red-400 hover:underline self-start sm:self-auto cursor-pointer"
                    >
                      {expandedId === log.id ? "Hide Payload ▲" : "View Payload ▼"}
                    </button>
                  ) : null}
                </div>

                {expandedId === log.id && Boolean(log.details) && (
                  <pre className="p-3 mt-2 rounded bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
