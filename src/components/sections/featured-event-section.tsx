import Link from "next/link";
import { Event } from "@/types";
import { formatDateRange } from "@/lib/date";
import { MapPin, ArrowRight } from "@animateicons/react/lucide";

interface FeaturedEventProps {
  event: Event;
}

export function FeaturedEventSection({ event }: FeaturedEventProps) {
  const status =
    event.status === "live"
      ? "Live now"
      : event.registrationOpen
      ? "Registration open"
      : "Registration opening soon";

  return (
    <section className="border-b border-border bg-secondary/10 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
              Featured event
            </h2>
            <p className="mt-2 max-w-[65ch] text-sm leading-6 text-muted-foreground sm:text-base">
              The next opportunity to build and participate with the chapter.
            </p>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Event details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div>
            <p className="text-sm font-medium text-primary">{status}</p>
            <h3 className="mt-2 max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
              {event.title}
            </h3>
            <p className="mt-5 max-w-[72ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {event.shortDescription || event.description}
            </p>
            <Link
              href={`/events/${event.slug}`}
              className="mt-7 inline-flex min-h-11 items-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Explore event
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <dl className="border-y border-border">
            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-border py-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</dt>
              <dd className="text-sm font-medium text-foreground">{formatDateRange(event.date, event.endDate)}</dd>
            </div>
            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-border py-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Location</dt>
              <dd className="flex items-start gap-2 text-sm text-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{event.location}</span>
              </dd>
            </div>
            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 py-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</dt>
              <dd className="text-sm font-medium text-foreground">{event.category}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
