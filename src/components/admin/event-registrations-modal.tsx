"use client";

import * as React from "react";
import {
  X,
  Users,
  Search,
  Download,
  CheckCircle2,
  Phone,
  Mail,
  ExternalLink,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { formatDate } from "@/lib/date";
import type { RegistrationStatus } from "@/db/schema/event-registrations";

export interface EventRegistrationDetail {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  teamId?: string | null;
  customAnswers: Record<string, unknown>;
  notes?: string | null;
  registeredAt: string;
  checkedInAt?: string | null;
  contactNo?: string;
  githubHandle?: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  profile?: {
    slug: string;
    displayName: string;
    department: string | null;
    academicProgram: string | null;
    batch: string | null;
  } | null;
  connectedAccounts?: Array<{
    userId: string;
    provider: string;
    handle: string;
    profileUrl: string;
    isVerified: boolean;
  }>;
  team?: {
    id: string;
    name: string;
    joinCode: string;
  } | null;
}

interface AdminRegistrationsModalProps {
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export function AdminRegistrationsModal({
  eventId,
  eventTitle,
  eventSlug,
  onClose,
  onStatusUpdated,
}: AdminRegistrationsModalProps) {
  const [loading, setLoading] = React.useState(true);
  const [registrations, setRegistrations] = React.useState<EventRegistrationDetail[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, unknown> | null>(null);

  const fetchRegistrations = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/registrations`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch event registrations");
      }
      setRegistrations(data.registrations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading registrations");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  React.useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleStatusChange = async (registrationId: string, newStatus: RegistrationStatus) => {
    setUpdatingId(registrationId);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/registrations`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update registration status");
      }

      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === registrationId
            ? {
                ...r,
                status: newStatus,
                checkedInAt: newStatus === "CHECKED_IN" ? new Date().toISOString() : r.checkedInAt,
              }
            : r
        )
      );

      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered registrations
  const filtered = registrations.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const name = (r.user?.name || "").toLowerCase();
    const email = (r.user?.email || "").toLowerCase();
    const phone = (r.contactNo || "").toLowerCase();
    const github = (r.githubHandle || "").toLowerCase();
    const dept = (r.profile?.department || "").toLowerCase();
    const team = (r.team?.name || "").toLowerCase();

    return (
      name.includes(query) ||
      email.includes(query) ||
      phone.includes(query) ||
      github.includes(query) ||
      dept.includes(query) ||
      team.includes(query)
    );
  });

  // Summary counts
  const totalCount = registrations.length;
  const checkedInCount = registrations.filter((r) => r.status === "CHECKED_IN").length;
  const registeredCount = registrations.filter((r) => r.status === "REGISTERED").length;
  const withPhoneCount = registrations.filter((r) => Boolean(r.contactNo)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4.5 bg-zinc-900/60 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#E31B23] uppercase tracking-wider">
              <Users className="h-3.5 w-3.5" />
              <span>Event Registrations Registry</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{eventTitle}</span>
              <a
                href={`/events/${eventSlug}`}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
                title="Open Public Event Page"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/api/admin/events/${eventId}/export?format=csv`}
              download={`registrations-${eventSlug}.csv`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-mono text-zinc-200 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </a>

            <button
              onClick={fetchRegistrations}
              disabled={loading}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3 border-b border-zinc-800/80 bg-zinc-900/30 text-xs font-mono shrink-0">
          <div className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60">
            <span className="text-zinc-500 block text-[10px] uppercase">Total Registrations</span>
            <span className="text-lg font-bold text-white">{totalCount}</span>
          </div>
          <div className="p-2.5 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-emerald-400">
            <span className="text-emerald-500/80 block text-[10px] uppercase">Checked In</span>
            <span className="text-lg font-bold">{checkedInCount}</span>
          </div>
          <div className="p-2.5 rounded-xl border border-blue-900/40 bg-blue-950/20 text-blue-400">
            <span className="text-blue-500/80 block text-[10px] uppercase">Pending / Active</span>
            <span className="text-lg font-bold">{registeredCount}</span>
          </div>
          <div className="p-2.5 rounded-xl border border-amber-900/40 bg-amber-950/20 text-amber-400">
            <span className="text-amber-500/80 block text-[10px] uppercase">Phone Verified</span>
            <span className="text-lg font-bold">{withPhoneCount}</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-3 border-b border-zinc-800 shrink-0 bg-zinc-950">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, github, department..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-mono text-white focus:outline-none focus:border-red-500"
            >
              <option value="ALL">All Statuses ({totalCount})</option>
              <option value="REGISTERED">Registered</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="WAITLISTED">Waitlisted</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="p-4 mb-4 rounded-xl border border-red-800 bg-red-950/40 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 text-xs font-mono gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span>Loading registered participants...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500 text-xs font-mono space-y-2">
              <Users className="h-8 w-8 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-400">No registrations found</p>
              <p className="max-w-xs text-zinc-500">
                {searchQuery || statusFilter !== "ALL"
                  ? "No participants match the selected filter criteria."
                  : "Registrations will appear here once students register for this event."}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/30">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 bg-zinc-900/80 font-mono text-zinc-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Participant</th>
                      <th className="px-4 py-3">Contact Number</th>
                      <th className="px-4 py-3">Academic Department</th>
                      <th className="px-4 py-3">GitHub / Profiles</th>
                      <th className="px-4 py-3">Registered At</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono">
                    {filtered.map((reg) => (
                      <tr
                        key={reg.id}
                        className="hover:bg-zinc-900/50 transition-colors"
                      >
                        {/* Participant Details */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            {reg.user.image ? (
                              <img
                                src={reg.user.image}
                                alt={reg.user.name || "User"}
                                className="h-8 w-8 rounded-full border border-zinc-700 object-cover shrink-0"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 font-bold text-xs text-zinc-300 shrink-0">
                                {(reg.user.name || "U").charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-white truncate flex items-center gap-1.5">
                                <span>{reg.user.name || "Anonymous Student"}</span>
                                {reg.profile?.slug && (
                                  <a
                                    href={`/u/${reg.profile.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-zinc-500 hover:text-primary transition-colors"
                                    title={`View /u/${reg.profile.slug}`}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                              <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                                <Mail className="h-3 w-3 text-zinc-500 shrink-0" />
                                <span className="select-all">{reg.user.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact Number */}
                        <td className="px-4 py-3.5">
                          {reg.contactNo ? (
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`tel:${reg.contactNo}`}
                                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-xs hover:underline"
                              >
                                <Phone className="h-3 w-3 shrink-0" />
                                <span>{reg.contactNo}</span>
                              </a>
                              <button
                                onClick={() => copyToClipboard(reg.contactNo || "", `phone-${reg.id}`)}
                                className="p-1 rounded text-zinc-500 hover:text-white transition-colors"
                                title="Copy contact number"
                              >
                                {copiedId === `phone-${reg.id}` ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-zinc-600 italic">Not provided</span>
                          )}
                        </td>

                        {/* Academic / Batch */}
                        <td className="px-4 py-3.5 text-zinc-300">
                          {reg.profile ? (
                            <div>
                              <div className="text-[11px] font-sans truncate max-w-[180px]">
                                {reg.profile.department || "Computer Science"}
                              </div>
                              {reg.profile.batch && (
                                <div className="text-[10px] text-zinc-500 mt-0.5">
                                  {reg.profile.batch}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-zinc-600">—</span>
                          )}
                        </td>

                        {/* GitHub / Accounts */}
                        <td className="px-4 py-3.5">
                          {reg.githubHandle ? (
                            <a
                              href={`https://github.com/${reg.githubHandle}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded bg-zinc-800/80 px-2 py-0.5 text-[11px] text-zinc-200 hover:bg-zinc-700 transition-colors"
                            >
                              <GithubIcon className="h-3 w-3" />
                              <span>@{reg.githubHandle}</span>
                            </a>
                          ) : (
                            <span className="text-[11px] text-zinc-600">—</span>
                          )}
                        </td>

                        {/* Registered At */}
                        <td className="px-4 py-3.5 text-zinc-400 text-[11px]">
                          <div>{formatDate(new Date(reg.registeredAt).toISOString())}</div>
                          {reg.checkedInAt && (
                            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>In: {formatDate(new Date(reg.checkedInAt).toISOString())}</span>
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                              reg.status === "CHECKED_IN"
                                ? "bg-emerald-950/50 border-emerald-800 text-emerald-400"
                                : reg.status === "REGISTERED"
                                ? "bg-blue-950/50 border-blue-800 text-blue-400"
                                : reg.status === "WAITLISTED"
                                ? "bg-amber-950/50 border-amber-800 text-amber-400"
                                : "bg-zinc-800 border-zinc-700 text-zinc-400"
                            }`}
                          >
                            {reg.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {reg.status === "REGISTERED" ? (
                              <button
                                onClick={() => handleStatusChange(reg.id, "CHECKED_IN")}
                                disabled={updatingId === reg.id}
                                className="inline-flex items-center gap-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-300 px-2 py-1 text-[10px] font-mono transition-colors disabled:opacity-50"
                              >
                                {updatingId === reg.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                                <span>Check In</span>
                              </button>
                            ) : reg.status === "CHECKED_IN" ? (
                              <button
                                onClick={() => handleStatusChange(reg.id, "REGISTERED")}
                                disabled={updatingId === reg.id}
                                className="inline-flex items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 text-[10px] font-mono transition-colors disabled:opacity-50"
                              >
                                <span>Revert</span>
                              </button>
                            ) : null}

                            {Object.keys(reg.customAnswers || {}).length > 0 && (
                              <button
                                onClick={() => setSelectedAnswers(reg.customAnswers)}
                                className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                                title="View Custom Answers"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Custom Answers Drawer / Sub-modal */}
        {selectedAnswers && (
          <div className="border-t border-zinc-800 bg-zinc-900/90 p-4 text-xs font-mono">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white uppercase text-[11px]">
                Registration Questionnaire Answers
              </span>
              <button
                onClick={() => setSelectedAnswers(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 overflow-x-auto text-[11px]">
              {JSON.stringify(selectedAnswers, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
