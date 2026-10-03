import Link from "next/link";
import { Event } from "@/types";
import { formatDateRange } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

interface FeaturedEventProps {
  event: Event;
}

export function FeaturedEventSection({ event }: FeaturedEventProps) {
  const isUpcoming = event.status === "upcoming" || event.status === "live";

  return (
    <section className="py-16 md:py-20 border-b border-border/80 bg-secondary/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wider">
              {isUpcoming ? "Upcoming Highlight" : "Featured Edition"}
            </span>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="text-xs sm:text-sm font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 group"
          >
            Full Event Page <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Document Card */}
        <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-8 lg:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="outline" className="text-xs font-mono">{event.category}</Badge>
            <Badge
              variant={
                event.registrationOpen === false
                  ? "warning"
                  : event.status === "upcoming"
                  ? "warning"
                  : event.status === "live"
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs font-mono"
            >
              {event.registrationOpen === false
                ? "Registration Opening Soon"
                : event.status === "upcoming"
                ? "Registration Open"
                : event.status === "live"
                ? "Live Now"
                : "Completed"}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {event.category}
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {event.title}
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {event.shortDescription || event.description}
            </p>
          </div>

          {/* Clean Property List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 border-t border-border/60 text-sm">
            <div className="space-y-1.5">
              <span className="text-muted-foreground font-mono text-xs">Date</span>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{formatDateRange(event.date, event.endDate)}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-muted-foreground font-mono text-xs">Location</span>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            <div className="space-y-1.5 flex sm:flex-col sm:items-end justify-between items-center pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40">
              <span className="text-muted-foreground font-mono text-xs">Registration</span>
              {event.registrationOpen === false ? (
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex h-9 sm:h-10 items-center justify-center rounded-lg border border-border px-4 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Opening Soon →
                </Link>
              ) : event.registrationUrl ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 sm:h-10 items-center justify-center rounded-lg bg-neutral-900 px-4 text-xs sm:text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 transition-colors gap-1.5"
                >
                  Register Now →
                </a>
              ) : (
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex h-9 sm:h-10 items-center justify-center rounded-lg border border-border px-4 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  View Details
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
