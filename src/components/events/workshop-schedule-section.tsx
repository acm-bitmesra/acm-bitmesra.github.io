import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Terminal,
  Laptop,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import type { WorkshopScheduleSession } from "@/types";

interface WorkshopScheduleSectionProps {
  sessions: WorkshopScheduleSession[];
}

export function WorkshopScheduleSection({ sessions }: WorkshopScheduleSectionProps) {
  if (!sessions || sessions.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/40 border border-red-900/50 text-red-500">
          <Calendar className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Detailed Workshop Schedule & Modules
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            In-person opening and three evening classes at BIT Mesra, followed by online guided practice and CTF labs.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map((session, index) => {
          const isInPerson = session.format.toLowerCase().includes("in-person");
          const isOpening = session.activity.toLowerCase().includes("opening") || session.activity.toLowerCase().includes("inauguration");

          return (
            <div
              key={index}
              className={`rounded-xl border transition-all ${
                isOpening
                  ? "border-red-900/40 bg-gradient-to-br from-red-950/15 via-card to-card"
                  : "border-border bg-card/60 hover:border-border/80"
              } p-5 sm:p-6 shadow-sm`}
            >
              {/* Header metadata row */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-border/60">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 font-mono text-xs font-semibold text-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>{session.date}</span>
                    <span className="text-muted-foreground font-normal">({session.day})</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{session.time}</span>
                  </span>

                  {session.notes && (
                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {session.notes}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium border ${
                      isInPerson
                        ? "border-emerald-800/60 bg-emerald-950/30 text-emerald-400"
                        : "border-blue-800/60 bg-blue-950/30 text-blue-400"
                    }`}
                  >
                    {isInPerson ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Laptop className="h-3 w-3" />
                    )}
                    <span>{session.format}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 font-mono text-xs text-foreground/80">
                    <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span>{session.venue}</span>
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="mt-3.5">
                <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  {isOpening && <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />}
                  <span>{session.activity}</span>
                </h3>
              </div>

              {/* Content Grid: Topics Covered & Hands-on */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border/80 bg-background/50 p-3.5">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Topics Covered</span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {session.topicsCovered}
                  </p>
                </div>

                <div className="rounded-lg border border-border/80 bg-background/50 p-3.5">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-500">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>Hands-on / Practical Drills</span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {session.handsOn}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
