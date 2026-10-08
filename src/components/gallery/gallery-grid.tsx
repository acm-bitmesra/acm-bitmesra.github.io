"use client";

import * as React from "react";
import { GalleryItem } from "@/data/gallery";
import { Camera, Calendar } from "@animateicons/react/lucide";

interface GalleryGridProps {
  items: GalleryItem[];
}

const CATEGORIES = ["All", "Workshops", "Hackathons", "Contests", "Team", "Talks", "Campus"] as const;

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const filteredItems = React.useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 min-h-[36px] rounded-lg text-xs sm:text-sm font-mono transition-colors ${
              selectedCategory === cat
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold shadow-xs"
                : "border border-border/80 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border/80 bg-card overflow-hidden flex flex-col justify-between hover:border-foreground/30 hover:bg-secondary/20 transition-all group"
          >
            {/* Visual Container */}
            <div className="w-full aspect-[16/10] bg-secondary/40 border-b border-border/60 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-muted-foreground uppercase px-2 py-0.5 rounded bg-card border border-border/60">
                  {item.category}
                </span>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground line-clamp-2">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>{item.date}</span>
              </div>
            </div>

            {/* Description Body */}
            <div className="p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
