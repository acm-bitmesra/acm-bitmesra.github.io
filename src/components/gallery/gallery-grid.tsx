"use client";

import * as React from "react";
import { GalleryItem } from "@/data/gallery";
import { Camera, Calendar } from "lucide-react";

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
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
              selectedCategory === cat
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium"
                : "text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-border bg-card overflow-hidden flex flex-col justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors"
          >
            {/* Visual Container */}
            <div className="w-full aspect-[16/10] bg-neutral-100 dark:bg-neutral-900 border-b border-border p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted-foreground uppercase">
                  {item.category}
                </span>
                <Camera className="h-3.5 w-3.5 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <span className="text-base font-semibold tracking-tight text-foreground line-clamp-2">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{item.date}</span>
              </div>
            </div>

            {/* Description Body */}
            <div className="p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
