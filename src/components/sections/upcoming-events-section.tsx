import Link from "next/link";
import { Event } from "@/types";
import { formatEventDate } from "@/lib/date";
import { ArrowRight, ArrowUpRight } from "@animateicons/react/lucide";

interface UpcomingEventsSectionProps {
  events: Event[];
}

function EventRow({ event }: { event: Event }) {
  const isLive = event.status === "live";
  const status = isLive
    ? "Live now"
    : event.registrationOpen
    ? "Registration open"
    : "Opening soon";

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group grid min-h-24 gap-3 border-b border-border py-5 transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[7rem_minmax(0,1fr)_8rem] sm:items-center sm:gap-5"
    >
      <time className="text-sm font-semibold text-foreground sm:text-right">
        {formatEventDate(event)}
      </time>
      <span className="min-w-0">
        <span className="block truncate text-base font-semibold text-foreground group-hover:text-primary sm:text-lg">
          {event.title}
        </span>
        <span className="mt-1 block truncate text-sm text-muted-foreground">
          {event.category} · {event.location}
        </span>
      </span>
      <span className="flex items-center justify-between gap-3 sm:justify-end">
        <span
          className={
            isLive
              ? "text-xs font-semibold text-red-400"
              : event.registrationOpen
              ? "text-xs font-semibold text-emerald-400"
              : "text-xs font-semibold text-amber-400"
          }
        >
          {status}
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:hidden" />
      </span>
    </Link>
  );
}

export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  const upcomingEvents = events.filter(
    (event) => event.status === "upcoming" || event.status === "live"
  );
  const pastEvents = events.filter(
    (event) => event.status === "completed" || event.status === "archived"
  );

  return (
    <section className="border-b border-border bg-background py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
              Event schedule
            </h2>
            <p className="mt-2 max-w-[65ch] text-sm leading-6 text-muted-foreground sm:text-base">
              Contests, internal sprints, and technical workshops organized across the season.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View all events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {upcomingEvents.length > 0 && (
          <div className="mt-2 border-t border-border">
            {upcomingEvents.map((event) => (
              <EventRow key={event.slug} event={event} />
            ))}
          </div>
        )}

        {pastEvents.length > 0 && (
          <div className="mt-12">
            <h3 className="text-sm font-semibold text-muted-foreground">Past events</h3>
            <div className="mt-2 border-t border-border">
              {pastEvents.slice(0, 3).map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="group grid min-h-20 gap-2 border-b border-border py-4 transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5"
                >
                  <time className="text-sm text-muted-foreground sm:text-right">
                    {formatEventDate(event)}
                  </time>
                  <span className="flex min-w-0 items-center justify-between gap-4">
                    <span>
                      <span className="block text-base font-medium text-foreground group-hover:text-primary">{event.title}</span>
                      <span className="mt-1 block truncate text-sm text-muted-foreground">{event.category}</span>
                    </span>
                    <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
