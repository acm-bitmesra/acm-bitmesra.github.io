import Link from "next/link";
import { Event } from "@/types";
import { formatDateRange } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isUpcoming = event.status === "upcoming";
  const isLive = event.status === "live";

  return (
    <div className="rounded-lg border border-border/80 bg-card p-5 flex flex-col justify-between transition-colors hover:border-border hover:bg-secondary/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-[10px] font-mono">
            {event.category}
          </Badge>
          <Badge
            variant={
              isUpcoming
                ? "warning"
                : isLive
                ? "destructive"
                : "secondary"
            }
          >
            {isUpcoming
              ? "Upcoming"
              : isLive
              ? "Live"
              : "Completed"}
          </Badge>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-semibold tracking-tight text-foreground hover:underline">
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {event.shortDescription}
          </p>
        </div>

        <div className="space-y-1 pt-2 border-t border-border/60 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>{formatDateRange(event.date, event.endDate)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground uppercase">
          {event.category}
        </span>
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
        >
          Details <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
