"use client";

import * as React from "react";
import { Resource } from "@/types";
import {
  Search,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Bookmark,
  Sparkles,
  SlidersHorizontal,
  Compass,
  Layers,
  Code,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";

interface ResourcesExplorerProps {
  initialResources: Resource[];
}

const CATEGORIES = [
  "All",
  "DSA",
  "Competitive Programming",
  "Systems",
  "System Design",
  "Development",
  "Open Source",
  "AI & Machine Learning",
  "Foundations",
  "Career",
] as const;

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"] as const;

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  article: FileText,
  video: Video,
  course: BookOpen,
  github: GithubIcon,
  document: Bookmark,
  interactive: Layers,
  roadmap: Compass,
};

const typeLabels: Record<string, string> = {
  article: "Article & Guide",
  video: "Video Series",
  course: "Structured Course",
  github: "GitHub Repository",
  document: "Book & Docs",
  interactive: "Interactive Tool",
  roadmap: "Visual Roadmap / Sheet",
};

export function ResourcesExplorer({ initialResources }: ResourcesExplorerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedLevel, setSelectedLevel] = React.useState<string>("All Levels");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [onlyFeatured, setOnlyFeatured] = React.useState<boolean>(false);

  const filteredResources = React.useMemo(() => {
    let result = [...initialResources];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.author?.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q)) ||
          r.highlights?.some((h) => h.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((r) => r.category === selectedCategory);
    }

    if (selectedLevel !== "All Levels") {
      result = result.filter((r) => {
        if (!r.level) return false;
        if (selectedLevel === "Beginner") return r.level.includes("Beginner");
        if (selectedLevel === "Intermediate") return r.level.includes("Intermediate");
        if (selectedLevel === "Advanced") return r.level.includes("Advanced");
        return true;
      });
    }

    if (onlyFeatured) {
      result = result.filter((r) => r.featured);
    }

    return result;
  }, [initialResources, searchQuery, selectedCategory, selectedLevel, onlyFeatured]);

  // Featured flagship items for quick highlights
  const featuredHighlights = React.useMemo(() => {
    return initialResources.filter((r) => r.featured);
  }, [initialResources]);

  return (
    <div className="space-y-10">
      {/* Featured Masterclasses Banner / Curated Hero Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-foreground" />
            <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
              Core Engineering Masterclasses & Benchmark Curricula
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
            Handpicked by ACM BIT Mesra Mentors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredHighlights.slice(0, 3).map((feat, idx) => (
            <a
              key={idx}
              href={feat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col justify-between hover:border-foreground/30 hover:bg-secondary/20 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-foreground border border-border/70">
                    {feat.category}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-acm-red" />
                    Featured
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {feat.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {feat.description}
                </p>

                {feat.tags && feat.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {feat.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs font-mono px-2 py-0.5 rounded bg-secondary/70 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-6 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="truncate max-w-[170px]">{feat.author || "Curated"}</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground group-hover:text-primary transition-colors">
                  Open Guide <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Explorer Controls: Search + Filters */}
      <div className="space-y-5 rounded-xl border border-border/80 bg-secondary/20 p-5 sm:p-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search roadmaps, algorithms, authors (e.g. roadmap.sh, AlgoForge, Striver, OSTEP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 rounded-lg border border-border bg-card pl-10 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Filter by Domain / Track:</span>
            <span className="hidden sm:inline">Keyboard friendly</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
        </div>

        {/* Level and Feature Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground mr-1 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" />
              Difficulty:
            </span>
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                  selectedLevel === lvl
                    ? "bg-primary text-primary-foreground font-medium"
                    : "border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={onlyFeatured}
                onChange={(e) => setOnlyFeatured(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border"
              />
              <span>Featured Only</span>
            </label>

            {(selectedCategory !== "All" ||
              selectedLevel !== "All Levels" ||
              searchQuery ||
              onlyFeatured) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedLevel("All Levels");
                  setSearchQuery("");
                  setOnlyFeatured(false);
                }}
                className="text-muted-foreground hover:underline text-xs font-mono"
              >
                Reset All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count & Track Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-muted-foreground border-b border-border/60 pb-3">
        <span>
          Showing <span className="font-semibold text-foreground">{filteredResources.length}</span>{" "}
          vetted resource{filteredResources.length === 1 ? "" : "s"}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {selectedLevel !== "All Levels" && ` (${selectedLevel})`}
        </span>

        {selectedCategory !== "All" && (
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className="hover:underline transition-colors hidden sm:inline"
          >
            Show All Tracks
          </button>
        )}
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res, idx) => {
            const TypeIcon = typeIcons[res.type] || FileText;
            const typeLabel = typeLabels[res.type] || res.type;

            return (
              <div
                key={idx}
                className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col justify-between hover:border-foreground/30 hover:bg-secondary/15 transition-all group"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted-foreground uppercase px-2 py-0.5 rounded-md bg-secondary border border-border/60">
                      {res.category}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <TypeIcon className="h-3.5 w-3.5" />
                      {typeLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline inline-flex items-baseline gap-1"
                    >
                      <span>{res.title}</span>
                    </a>
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {res.description}
                  </p>

                  {/* Highlights Bullet List (if available) */}
                  {res.highlights && res.highlights.length > 0 && (
                    <ul className="space-y-1 pt-1 border-t border-border/50 text-xs text-muted-foreground">
                      {res.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tags */}
                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {res.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary/80 text-foreground/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-6 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <div className="flex flex-col">
                    <span className="truncate max-w-[160px] text-foreground/90 font-medium">
                      {res.author || "Curated"}
                    </span>
                    {res.level && (
                      <span className="text-[11px] text-muted-foreground">
                        {res.level}
                      </span>
                    )}
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-3.5 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white transition-colors gap-1.5 shadow-xs"
                  >
                    <span>Launch</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-4">
          <p className="font-mono text-base text-foreground font-semibold">
            No resources match your search criteria.
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Try broadening your search term or resetting the category and level filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSelectedLevel("All Levels");
              setSearchQuery("");
              setOnlyFeatured(false);
            }}
            className="inline-flex h-9 items-center rounded-md border border-border px-4 text-xs font-mono font-medium hover:bg-secondary transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Community Contribution Box */}
      <section className="rounded-xl border border-border/80 bg-secondary/20 p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Suggest or Curate a Learning Material
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Found an exceptional book, interactive playground, algorithm visualizer, or benchmark sheet that helped your engineering journey at BIT Mesra? Submit a pull request on the ACM GitHub repository or message the Technical Lead.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/acm-bitmesra/acm-bitmesra.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-card px-4 text-xs font-mono font-medium text-foreground hover:bg-secondary transition-colors gap-1.5"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>Open Pull Request</span>
          </a>
        </div>
      </section>
    </div>
  );
}
