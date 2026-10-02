import Link from "next/link";
import { Event } from "@/types";
import { formatDateRange } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight, Trophy } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isUpcoming = event.status === "upcoming";
  const isLive = event.status === "live";

  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between transition-all hover:border-border/80 hover:shadow-md group">
      <div className="space-y-4">
        {/* Status + Category Header */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="font-mono text-[11px]">
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
              ? "Registration Open"
              : isLive
              ? "Live Now"
              : "Completed"}
          </Badge>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {event.shortDescription}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="space-y-1.5 pt-2 border-t border-border/60 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{formatDateRange(event.date, event.endDate)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.prizes && event.prizes.length > 0 && (
            <div className="flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{event.prizes[0].title}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-secondary/50 border border-border/60 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA Footer adapting to status (Section 73) */}
      <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between">
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-primary transition-colors"
        >
          <span>
            {isUpcoming
              ? "View & Register"
              : event.status === "completed"
              ? "View Results & Summary"
              : "View Archive"}
          </span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
