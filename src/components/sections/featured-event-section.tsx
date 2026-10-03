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

  // Determine consistent status badge configuration
  const getStatusBadge = () => {
    if (event.registrationOpen === false) {
      return { label: "Registration Opening Soon", variant: "warning" as const };
    }
    if (event.status === "live") {
      return { label: "Live Now", variant: "destructive" as const };
    }
    if (event.status === "upcoming") {
      return { label: "Registration Open", variant: "success" as const };
    }
    return { label: "Completed", variant: "secondary" as const };
  };

  const statusBadge = getStatusBadge();

  return (
    <section className="py-14 sm:py-16 md:py-20 border-b border-border/80 bg-secondary/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wider">
              {isUpcoming ? "Upcoming Highlight" : "Featured Edition"}
            </span>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="text-xs sm:text-sm font-mono font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
          >
            <span>Full Event Page</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Highlight Card */}
        <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-8 lg:p-10 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="outline" className="text-xs font-mono">
              {event.category}
            </Badge>
            <Badge variant={statusBadge.variant} className="text-xs font-mono">
              {statusBadge.label}
            </Badge>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {event.title}
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {event.shortDescription || event.description}
            </p>
          </div>

          {/* Clean Property List (Date / Location / Registration) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 border-t border-border/60 text-sm">
            <div className="space-y-1.5">
              <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                Date
              </span>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{formatDateRange(event.date, event.endDate)}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                Location
              </span>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>

            <div className="space-y-1.5 sm:text-right">
              <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                Registration
              </span>
              <div className="font-medium text-foreground">
                {event.registrationStatusText ||
                  (event.registrationOpen ? "Open" : "Opening Soon")}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/40">
            {event.registrationOpen === false ? (
              <>
                <span className="inline-flex h-10 items-center justify-center rounded-lg border border-border/70 bg-secondary/40 px-4 text-xs sm:text-sm font-mono text-muted-foreground cursor-default select-none whitespace-nowrap">
                  Registration opens soon
                </span>
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs sm:text-sm font-semibold text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
                >
                  View Event Details →
                </Link>
              </>
            ) : event.registrationUrl ? (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors gap-1.5 whitespace-nowrap"
              >
                Register Now →
              </a>
            ) : (
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs sm:text-sm font-semibold text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
              >
                View Details →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
