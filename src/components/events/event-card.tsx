import Link from "next/link";
import { Event } from "@/types";
import { formatDateRange } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
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
    <div className="rounded-xl border border-border/80 bg-card p-6 flex flex-col justify-between transition-all hover:border-foreground/30 hover:bg-secondary/20 group">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            {event.category}
          </Badge>
          <Badge variant={statusBadge.variant} className="text-xs font-mono">
            {statusBadge.label}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:underline">
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {event.shortDescription}
          </p>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-border/60 text-xs sm:text-sm font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{formatDateRange(event.date, event.endDate)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs sm:text-sm font-mono">
        <span className="text-muted-foreground font-medium">
          {event.registrationStatusText || (event.registrationOpen ? "Open" : "Opening Soon")}
        </span>
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-1.5 font-semibold text-foreground group-hover:text-primary transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
