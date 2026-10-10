import Link from "next/link";
import { Event } from "@/types";
import { formatEventDate } from "@/lib/date";
import { Calendar, MapPin, ArrowUpRight } from "@animateicons/react/lucide";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isLive = event.status === "live";
  const isUpcoming = event.status === "upcoming";
  const statusLabel = isLive
    ? "Live now"
    : isUpcoming
    ? event.registrationOpen
      ? "Registration open"
      : "Opening soon"
    : event.status === "completed"
    ? "Completed"
    : "Archived";

  return (
    <article className="group flex h-full flex-col border-t border-border py-5 sm:py-6">
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {event.category}
        </span>
        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 text-xs font-medium",
            isLive
              ? "text-red-400"
              : isUpcoming && event.registrationOpen
              ? "text-emerald-400"
              : isUpcoming
              ? "text-amber-400"
              : "text-muted-foreground"
          )}
        >
          {isLive && <span className="h-1.5 w-1.5 rounded-full bg-red-400 live-beacon" />}
          {statusLabel}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 hover:text-primary transition-colors"
        >
          {event.title}
          <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
        </Link>
      </h3>

      <p className="mt-3 max-w-[62ch] text-sm leading-6 text-muted-foreground sm:text-base">
        {event.shortDescription}
      </p>

      <div className="mt-auto flex flex-col gap-2 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-5">
        <span className="inline-flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0" />
          {formatEventDate(event)}
        </span>
        {event.location && (
          <span className="inline-flex min-w-0 items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{event.location}</span>
          </span>
        )}
      </div>
    </article>
  );
}
