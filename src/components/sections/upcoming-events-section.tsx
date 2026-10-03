import Link from "next/link";
import { Event } from "@/types";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface UpcomingEventsSectionProps {
  events: Event[];
}

export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  return (
    <section className="py-16 md:py-20 border-b border-border/80 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Event Schedule
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Contests, internal sprints, and technical workshops.
            </p>
          </div>
          <Link
            href="/events"
            className="text-xs sm:text-sm font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 group"
          >
            All events archive <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Database Table View */}
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
          <div className="divide-y divide-border/60">
            {events.slice(0, 4).map((event) => {
              const isUpcoming = event.status === "upcoming";
              return (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 transition-colors hover:bg-secondary/40"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <span className="font-mono text-xs sm:text-sm text-muted-foreground shrink-0 w-auto sm:w-28">
                      {formatDate(event.date)}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-semibold text-foreground group-hover:underline truncate">
                          {event.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground min-w-0">
                        <span className="shrink-0 font-medium">{event.category}</span>
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
                          : isUpcoming
                          ? "warning"
                          : event.status === "live"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs font-mono"
                    >
                      {event.registrationOpen === false
                        ? "Opening Soon"
                        : isUpcoming
                        ? "Upcoming"
                        : event.status === "live"
                        ? "Live"
                        : "Past"}
                    </Badge>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground transition-colors hidden sm:block" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
