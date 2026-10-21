"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Users,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";

interface RegistrationItem {
  id: string;
  status: string;
  registeredAt: Date | string;
  checkedInAt?: Date | string | null;
  event: {
    id: string;
    slug: string;
    title: string;
    category: string;
    startDate: Date | string;
    endDate?: Date | string | null;
    location?: string | null;
    isVirtual?: boolean;
    status: string;
  };
  team?: {
    id: string;
    name: string;
    joinCode: string;
    members?: Array<{
      id: string;
      role: string;
      user: {
        name: string;
        email: string;
      };
    }>;
  } | null;
}

export function RegisteredEventsView({
  registrations,
}: {
  registrations: RegistrationItem[];
}) {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [cancellingId, setCancellingId] = React.useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCancel = async (slug: string) => {
    if (!confirm("Are you sure you want to cancel your registration?")) return;
    setCancellingId(slug);
    try {
      const res = await fetch(`/api/events/${slug}/register`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Cancel failed:", err);
    } finally {
      setCancellingId(null);
    }
  };

  if (registrations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <Calendar className="mx-auto h-10 w-10 text-muted-foreground/60" />
        <h3 className="mt-4 font-bold text-base text-foreground">No Active Registrations</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
          You have not registered for any upcoming workshops, competitive programming contests, or hackathons.
        </p>
        <Link
          href="/events"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Browse Upcoming Events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {registrations.map((reg) => {
        const isCancelled = reg.status === "CANCELLED";
        const isAttended = reg.status === "ATTENDED";

        return (
          <div
            key={reg.id}
            className={`rounded-xl border bg-card p-6 shadow-sm transition-colors ${
              isCancelled ? "opacity-60 border-border" : "border-border"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[10px] font-bold text-secondary-foreground uppercase">
                    {reg.event.category}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isAttended
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : isCancelled
                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {reg.status}
                  </span>
                </div>

                <h3 className="mt-2 text-base font-bold text-foreground">
                  <Link
                    href={`/events/${reg.event.slug}`}
                    className="hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>{reg.event.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {new Date(reg.event.startDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {reg.event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{reg.event.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {!isCancelled && (
                <div>
                  <button
                    type="button"
                    onClick={() => handleCancel(reg.event.slug)}
                    disabled={cancellingId === reg.event.slug}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                  >
                    {cancellingId === reg.event.slug ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Cancel Registration"
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Team Info if registered with a team */}
            {reg.team && (
              <div className="mt-4 rounded-lg border border-border/80 bg-muted/30 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-xs text-foreground">
                      Team: {reg.team.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">Join Code:</span>
                    <code className="rounded bg-background border border-border px-2 py-0.5 font-mono text-xs font-bold text-foreground">
                      {reg.team.joinCode}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyCode(reg.team!.joinCode)}
                      className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                      title="Copy join code"
                    >
                      {copiedCode === reg.team.joinCode ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {reg.team.members && reg.team.members.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-border/60 pt-3">
                    {reg.team.members.map((m) => (
                      <span
                        key={m.id}
                        className="rounded-full bg-background border border-border px-2.5 py-0.5 text-[11px] font-medium text-foreground"
                      >
                        {m.user.name} {m.role === "LEADER" ? "★" : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
