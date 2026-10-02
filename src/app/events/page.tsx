import type { Metadata } from "next";
import { events } from "@/data/events";
import { EventsExplorer } from "@/components/events/events-explorer";

export const metadata: Metadata = {
  title: "Events & Contests Archive",
  description:
    "Explore upcoming hackathons, algorithmic coding contests, workshops, and historical editions hosted by ACM BIT Mesra.",
};

export default function EventsPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Document Header */}
        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="text-xs font-mono text-muted-foreground">
            Archive / Events & Contests
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Events & Contests
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Official record of student hackathons, CodeZilla tournaments, monthly CQM rounds, and developer workshops at BIT Mesra.
          </p>
        </div>

        {/* Events Explorer */}
        <EventsExplorer initialEvents={events} />
      </div>
    </div>
  );
}
