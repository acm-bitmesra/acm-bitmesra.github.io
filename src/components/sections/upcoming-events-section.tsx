import Link from "next/link";
import { Event } from "@/types";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

interface UpcomingEventsSectionProps {
  events: Event[];
}

export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  return (
    <section className="py-20 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
              <span>03 / Calendar & Schedule</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Upcoming & Recent Events
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Regular coding contests, technical hackathons, and hands-on workshops scheduled across the semester.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary hover:underline"
          >
            Explore complete event archive <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => {
            const isUpcoming = event.status === "upcoming";
            return (
              <div
                key={event.slug}
                className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between transition-all hover:border-border/80 hover:shadow-md group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {formatDate(event.date)}
                    </span>
                    <Badge
                      variant={
                        isUpcoming
                          ? "warning"
                          : event.status === "live"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {isUpcoming
                        ? "Registration Open"
                        : event.status === "live"
                        ? "Live"
                        : "Completed"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                      {event.category}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      <Link href={`/events/${event.slug}`}>{event.title}</Link>
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {event.shortDescription}
                    </p>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground pt-1">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between">
                  <Link
                    href={`/events/${event.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-primary transition-colors"
                  >
                    <span>{isUpcoming ? "View & Register" : "Read Summary"}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
