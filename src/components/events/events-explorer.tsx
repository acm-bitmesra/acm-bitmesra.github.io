"use client";

import * as React from "react";
import { Event } from "@/types";
import { EventCard } from "./event-card";
import { Search, SlidersHorizontal } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<SortOption>("newest");

  const filteredEvents = React.useMemo(() => {
    let result = [...initialEvents];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.shortDescription.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (e) =>
          e.category === selectedCategory ||
          (selectedCategory === "Open Source" &&
            e.category.toLowerCase().includes("open source"))
      );
    }

    // Filter by Status
    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "upcoming") {
        if (a.status === "upcoming" && b.status !== "upcoming") return -1;
        if (b.status === "upcoming" && a.status !== "upcoming") return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      // default: newest
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return result;
  }, [initialEvents, searchQuery, selectedCategory, statusFilter, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events by title, topics, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 rounded-md border border-border bg-background px-3 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="upcoming">Sort: Upcoming First</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Status Tabs */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter Sub-bar */}
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1 border-b border-border pb-3">
          <span className="font-semibold text-foreground">Status:</span>
          {["all", "upcoming", "completed"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`capitalize transition-colors ${
                statusFilter === st
                  ? "text-primary font-bold underline underline-offset-4"
                  : "hover:text-foreground"
              }`}
            >
              {st === "all" ? "All Statuses" : st}
            </button>
          ))}
          <span className="ml-auto text-[11px]">
            Showing {filteredEvents.length} event{filteredEvents.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Event Cards Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3">
          <p className="font-mono text-sm text-foreground">
            No events match your current filter parameters.
          </p>
          <p className="text-xs text-muted-foreground">
            Try resetting your search query or selecting &quot;All&quot; categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setStatusFilter("all");
              setSearchQuery("");
            }}
            className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium hover:bg-secondary transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
