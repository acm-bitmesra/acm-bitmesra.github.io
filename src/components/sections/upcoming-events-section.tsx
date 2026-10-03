import Link from "next/link";
import { Event } from "@/types";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface UpcomingEventsSectionProps {
  events: Event[];
}

export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  const upcomingEvents = events.filter(
    (e) => e.status === "upcoming" || e.status === "live"
  );
  const pastEvents = events.filter(
    (e) => e.status === "completed" || e.status === "archived"
  );

  return (
    <section className="py-14 sm:py-16 md:py-20 border-b border-border/80 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Event Schedule
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Contests, internal sprints, and technical workshops organized across the season.
            </p>
          </div>
          <Link
            href="/events"
            className="text-xs sm:text-sm font-mono font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group shrink-0"
          >
            <span>All events archive</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Group 1: Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">
                Upcoming & Live Schedule
              </h3>
            </div>

            <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <span className="font-mono text-xs sm:text-sm text-muted-foreground shrink-0 w-auto sm:w-28 font-medium">
                      {formatDate(event.date)}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-semibold text-foreground group-hover:underline truncate">
                          {event.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground min-w-0">
                        <span className="shrink-0 font-medium text-foreground/80">{event.category}</span>
                        <span>·</span>
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <Badge
                      variant={
                        event.registrationOpen === false
                          ? "warning"
                          : event.status === "live"
                          ? "destructive"
                          : "success"
                      }
                      className="text-xs font-mono"
                    >
                      {event.registrationOpen === false
                        ? "Opening Soon"
                        : event.status === "live"
                        ? "Live Now"
                        : "Registration Open"}
                    </Badge>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/70 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all hidden sm:block" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Group 2: Past Flagships & Completed Events */}
        {pastEvents.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/50" />
              <h3 className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Past Flagships & Archive
              </h3>
            </div>

            <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
              {pastEvents.slice(0, 3).map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <span className="font-mono text-xs sm:text-sm text-muted-foreground shrink-0 w-auto sm:w-28 font-medium">
                      {formatDate(event.date)}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-semibold text-foreground group-hover:underline truncate">
                          {event.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground min-w-0">
                        <span className="shrink-0 font-medium text-foreground/80">{event.category}</span>
                        <span>·</span>
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <Badge variant="secondary" className="text-xs font-mono text-muted-foreground">
                      Completed
                    </Badge>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/70 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all hidden sm:block" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
