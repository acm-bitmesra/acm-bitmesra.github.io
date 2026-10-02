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
    <section className="py-14 border-b border-border/80 bg-secondary/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">
              {isUpcoming ? "Upcoming Highlight" : "Featured Edition"}
            </span>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 group"
          >
            Full Event Page <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Notion-style Document Card */}
        <div className="rounded-lg border border-border/80 bg-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{event.category}</Badge>
            <Badge
              variant={
                event.status === "upcoming"
                  ? "warning"
                  : event.status === "live"
                  ? "destructive"
                  : "secondary"
              }
            >
              {event.status === "upcoming"
                ? "Registration Open"
                : event.status === "live"
                ? "Live Now"
                : "Completed"}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {event.category}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {event.shortDescription || event.description}
            </p>
          </div>

          {/* Clean Property List (Notion Document Properties) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground font-mono">Date</span>
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{formatDateRange(event.date, event.endDate)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-mono">Location</span>
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="space-y-1 flex sm:flex-col sm:items-end justify-between items-center">
              <span className="text-muted-foreground font-mono">Registration</span>
              {event.registrationUrl ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center justify-center rounded-md bg-neutral-900 px-3 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 transition-colors gap-1.5"
                >
                  Register Now →
                </a>
              ) : (
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
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
