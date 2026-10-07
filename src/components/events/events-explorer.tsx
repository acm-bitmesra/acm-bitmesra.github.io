"use client";

import * as React from "react";
import { Event } from "@/types";
import { EventCard } from "./event-card";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface EventsExplorerProps {
  initialEvents: Event[];
}

const CATEGORIES = [
  "All",
  "Open Source",
  "Hackathon",
  "Coding Contest",
  "Workshop",
  "Competition",
  "Community",
] as const;

type SortOption = "newest" | "oldest" | "upcoming";

export function EventsExplorer({ initialEvents }: EventsExplorerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortOption>("newest");

  const filteredEvents = React.useMemo(() => {
    let result = [...initialEvents];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(q) ||
          event.shortDescription.toLowerCase().includes(q) ||
          event.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (event) =>
          event.category === selectedCategory ||
          (selectedCategory === "Open Source" &&
            event.category.toLowerCase().includes("open source"))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((event) => event.status === statusFilter);
    }

    result.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();

      if (sortBy === "oldest") return aTime - bTime;

      if (sortBy === "upcoming") {
        if (a.status === "upcoming" && b.status !== "upcoming") return -1;
        if (b.status === "upcoming" && a.status !== "upcoming") return 1;
      }

      return bTime - aTime;
    });

    return result;
  }, [initialEvents, searchQuery, selectedCategory, statusFilter, sortBy]);

  const hasFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== "All" ||
    statusFilter !== "all" ||
    sortBy !== "newest";

  const reset = () => {
    setSelectedCategory("All");
    setStatusFilter("all");
    setSearchQuery("");
    setSortBy("newest");
  };

  return (
    <div className="space-y-7 sm:space-y-9">
      <div className="border-y border-border py-4 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Search events</span>
            <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search events, topics, or keywords"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 w-full border-0 bg-transparent pl-8 pr-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 sm:max-w-2xl"
            />
          </label>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <label className="sr-only" htmlFor="event-sort">
              Sort events
            </label>
            <select
              id="event-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="h-11 min-w-0 bg-transparent pr-8 text-sm font-medium text-foreground focus:outline-none focus:ring-0"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="upcoming">Upcoming first</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div
          className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 scrollbar-none"
          aria-label="Event categories"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={
                selectedCategory === category
                  ? "min-h-11 shrink-0 border-b-2 border-primary px-3 text-sm font-semibold text-foreground"
                  : "min-h-11 shrink-0 border-b-2 border-transparent px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-b border-border pb-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 overflow-x-auto" aria-label="Event status">
            {[
              ["all", "All"],
              ["upcoming", "Upcoming"],
              ["live", "Live"],
              ["completed", "Completed"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                aria-pressed={statusFilter === value}
                className={
                  statusFilter === value
                    ? "min-h-10 rounded-md bg-secondary px-3 font-semibold text-foreground"
                    : "min-h-10 rounded-md px-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              {filteredEvents.length} event{filteredEvents.length === 1 ? "" : "s"}
            </span>
            {hasFilters && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-10 items-center gap-1.5 font-medium text-foreground hover:text-primary"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      ) : (
        <div className="border-y border-dashed border-border py-14 text-center">
          <p className="text-base font-semibold text-foreground">
            No events found
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Try another search or clear the current filters.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
