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
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
            className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col justify-between group hover:border-border/80 hover:shadow-md transition-all"
          >
            {/* Architectural Visual Container */}
            <div className="w-full aspect-[16/10] bg-secondary/40 border-b border-border/60 p-6 flex flex-col justify-between relative group-hover:bg-secondary/60 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                  {item.category}
                </span>
                <Camera className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="space-y-1">
                <span className="text-xl font-black tracking-tight text-foreground line-clamp-2">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                <Calendar className="h-3 w-3 text-primary" />
                <span>{item.date}</span>
              </div>
            </div>

            {/* Description Body */}
            <div className="p-5">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
