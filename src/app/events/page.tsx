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
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl border-b border-border pb-7 sm:pb-9">
          <h1 className="text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">
            Events & contests
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-7 text-muted-foreground sm:text-lg">
            A living archive of hackathons, coding contests, workshops, and developer activities hosted by ACM BIT Mesra.
          </p>
        </header>

        <div className="mt-8 sm:mt-10">
          <EventsExplorer initialEvents={events} />
        </div>
      </div>
    </div>
  );
}
