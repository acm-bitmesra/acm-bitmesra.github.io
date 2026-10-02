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
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <span>Chapter Archive · Engineering & Contests</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Events & Contests
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            The institutional record of student hackathons, CodeZilla tournaments, monthly CQM challenges, technical talks, and hands-on developer workshops at BIT Mesra.
          </p>
        </div>

        {/* Events Explorer */}
        <EventsExplorer initialEvents={events} />
      </div>
    </div>
  );
}
