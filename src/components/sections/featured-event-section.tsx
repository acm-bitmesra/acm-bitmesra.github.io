import Link from "next/link";
import { Event } from "@/types";
import { formatDateRange } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight, Trophy, Users } from "lucide-react";

interface FeaturedEventProps {
  event: Event;
}

export function FeaturedEventSection({ event }: FeaturedEventProps) {
  const isUpcoming = event.status === "upcoming" || event.status === "live";

  return (
    <section className="py-20 border-b border-border bg-card/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <span>02 / {isUpcoming ? "Upcoming Spotlight" : "Flagship Edition"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isUpcoming ? "Featured Event" : "Latest Flagship Event"}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Subtle accent border line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-red-600 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant={isUpcoming ? "default" : "secondary"}>
                  {event.category}
                </Badge>
                <Badge
                  variant={
                    event.status === "upcoming"
                      ? "warning"
                      : event.status === "live"
                      ? "destructive"
                      : "success"
                  }
                >
                  {event.status === "upcoming"
                    ? "Registration Open"
                    : event.status === "live"
                    ? "Live Now"
                    : "Completed"}
                </Badge>
                <span className="font-mono text-xs text-muted-foreground">
                  Flagship Event
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
                  {event.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
                  {event.description}
                </p>
              </div>

              {/* Event Metadata Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/80">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span>{formatDateRange(event.date, event.endDate)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                {event.organizers && event.organizers.length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <span>Organized by {event.organizers[0]}</span>
                  </div>
                )}
                {event.prizes && event.prizes.length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Trophy className="h-4 w-4 text-primary shrink-0" />
                    <span>Top Prizes: {event.prizes[0].title}</span>
                  </div>
                )}
              </div>

              {/* CTAs adapting to status (Section 73) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {event.status === "upcoming" && event.registrationUrl ? (
                  <a
                    href={event.registrationUrl}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                  >
                    Register Now
                  </a>
                ) : null}

                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-secondary/60 px-5 text-sm font-medium text-foreground hover:bg-secondary transition-colors gap-2"
                >
                  <span>{event.status === "completed" ? "View Results & Summary" : "Event Details"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Graphic Preview */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="w-full aspect-[4/3] rounded-xl border border-border/80 bg-secondary/30 p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="font-mono text-xs text-primary font-bold">
                  ACM BITM ARCHIVE
                </div>
                <div className="space-y-1">
                  <span className="text-3xl font-black tracking-tighter text-foreground block">
                    {event.title}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground block">
                    {event.category} · BIT Mesra
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono border-t border-border pt-3 text-muted-foreground">
                  <span>STATUS: {event.status.toUpperCase()}</span>
                  <span>{event.date.slice(0, 4)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
