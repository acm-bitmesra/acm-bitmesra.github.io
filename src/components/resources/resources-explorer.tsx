"use client";

import * as React from "react";
import { Resource } from "@/types";
import { Search, ExternalLink, BookOpen, Video, FileText, Bookmark } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

interface ResourcesExplorerProps {
  initialResources: Resource[];
}

const CATEGORIES = [
  "All",
  "DSA",
  "Competitive Programming",
  "Development",
  "Open Source",
  "Systems",
  "Career",
] as const;

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  article: FileText,
  video: Video,
  course: BookOpen,
  github: GithubIcon,
  document: Bookmark,
};

export function ResourcesExplorer({ initialResources }: ResourcesExplorerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredResources = React.useMemo(() => {
    let result = [...initialResources];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.author?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((r) => r.category === selectedCategory);
    }

    return result;
  }, [initialResources, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search learning materials by topic, keywords, author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
              selectedCategory === cat
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium"
                : "border border-border/70 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-border/60 pb-3">
        <span>
          Showing {filteredResources.length} curated resource{filteredResources.length === 1 ? "" : "s"}
        </span>
        {selectedCategory !== "All" && (
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className="hover:underline transition-colors"
          >
            Reset Category
          </button>
        )}
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res, idx) => {
            const TypeIcon = typeIcons[res.type] || FileText;
            return (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border/80 bg-card p-5 flex flex-col justify-between hover:border-border hover:bg-secondary/20 transition-colors group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary border border-border/60">
                      {res.category}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground uppercase">
                      <TypeIcon className="h-3.5 w-3.5" />
                      {res.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {res.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>{res.author || "Curated Resource"}</span>
                  <span className="flex items-center gap-1 group-hover:text-primary transition-colors font-medium">
                    Open <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3">
          <p className="font-mono text-sm text-foreground">
            No resources match your search criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium hover:bg-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
