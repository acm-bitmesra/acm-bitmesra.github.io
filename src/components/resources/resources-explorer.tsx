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
  CircleCheck as CheckCircle2,
  X,
} from "@animateicons/react/lucide";
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
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Featured flagship items for hero banner
  const featuredHighlights = React.useMemo(() => {
    return initialResources.filter((r) => r.featured);
  }, [initialResources]);

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedLevel !== "All Levels" ||
    searchQuery.trim().length > 0 ||
    onlyFeatured;

  const resetAllFilters = () => {
    setSelectedCategory("All");
    setSelectedLevel("All Levels");
    setSearchQuery("");
    setOnlyFeatured(false);
  };

  return (
    <div className="space-y-12">
      {/* Featured Masterclasses Banner / Curated Hero Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
              Core Engineering Masterclasses & Benchmark Curricula
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
            Handpicked by ACM BIT Mesra Mentors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHighlights.slice(0, 3).map((feat, idx) => (
            <a
              key={idx}
              href={feat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover rounded-2xl border border-border/80 bg-card/85 p-6 flex flex-col justify-between hover:border-foreground/30 hover:bg-card transition-all duration-300 group shadow-sm"
            >
              <div className="space-y-3.5">
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-secondary text-foreground border border-border/70">
                    {feat.category}
                  </span>
                  <span className="font-mono text-xs text-amber-400 flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-medium">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {feat.description}
                </p>

                {/* Tags */}
                {feat.tags && feat.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {feat.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs font-mono px-2 py-0.5 rounded bg-secondary/80 text-muted-foreground border border-border/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Robust, Un-cramped Card Footer */}
              <div className="pt-4 mt-6 border-t border-border/60 flex items-center justify-between gap-3 text-xs font-mono">
                <span className="truncate min-w-0 flex-1 text-muted-foreground font-medium" title={feat.author}>
                  {feat.author || "Curated"}
                </span>
                <span className="btn-press whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/80 text-foreground text-xs font-medium group-hover:bg-foreground group-hover:text-background transition-colors">
                  <span>Open Guide</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Explorer Controls: Search + Filters */}
      <div className="space-y-6 rounded-2xl border border-border/80 bg-secondary/20 p-6 sm:p-7 backdrop-blur-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search roadmaps, algorithms, authors (e.g. roadmap.sh, AlgoForge, Striver, OSTEP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 rounded-xl border border-border bg-card/90 pl-10 pr-20 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="btn-press p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <span className="hidden sm:inline-block text-[11px] font-mono text-muted-foreground/70 border border-border/80 bg-secondary/50 px-1.5 py-0.5 rounded">
                /
              </span>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Filter by Domain / Track:</span>
            <span className="hidden sm:inline">Interactive filters</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn-press px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-mono transition-all ${
                    isSelected
                      ? "bg-foreground text-background font-semibold shadow-xs"
                      : "border border-border/70 bg-card/80 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level and Feature Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground mr-1 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Difficulty:
            </span>
            {LEVELS.map((lvl) => {
              const isSelected = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`btn-press px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                    isSelected
                      ? "bg-foreground text-background font-semibold shadow-xs"
                      : "border border-border/60 bg-card/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {/* Featured Only Pill Button */}
            <button
              type="button"
              onClick={() => setOnlyFeatured(!onlyFeatured)}
              className={`btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all border ${
                onlyFeatured
                  ? "bg-amber-400/15 border-amber-400/40 text-amber-300 font-semibold"
                  : "border-border/70 bg-card/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>Featured Only</span>
            </button>

            {/* Reset All Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="btn-press text-xs font-mono text-muted-foreground hover:text-foreground hover:underline transition-colors px-2 py-1"
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
          {onlyFeatured && " (Featured only)"}
        </span>

        {selectedCategory !== "All" && (
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className="hover:text-foreground hover:underline transition-colors hidden sm:inline"
          >
            Show All Tracks
          </button>
        )}
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res, idx) => {
            const TypeIcon = typeIcons[res.type] || FileText;
            const typeLabel = typeLabels[res.type] || res.type;

            return (
              <div
                key={idx}
                className="card-hover rounded-2xl border border-border/80 bg-card/85 p-6 flex flex-col justify-between hover:border-foreground/30 hover:bg-card transition-all duration-300 group shadow-sm"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-foreground/80 uppercase px-2.5 py-0.5 rounded-md bg-secondary border border-border/70">
                      {res.category}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
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
                      className="hover:underline inline-flex items-baseline gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span>{res.title}</span>
                    </a>
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {res.description}
                  </p>

                  {/* Highlights Bullet List (if available) */}
                  {res.highlights && res.highlights.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-border/50 text-xs text-muted-foreground">
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
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary/80 text-foreground/80 border border-border/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-6 border-t border-border/60 flex items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
                  <div className="flex flex-col min-w-0 flex-1 mr-2">
                    <span className="truncate text-foreground/90 font-medium" title={res.author}>
                      {res.author || "Curated"}
                    </span>
                    {res.level && (
                      <span className="text-[11px] text-muted-foreground truncate">
                        {res.level}
                      </span>
                    )}
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press whitespace-nowrap shrink-0 inline-flex h-9 items-center justify-center rounded-lg bg-foreground text-background px-3.5 text-xs font-semibold hover:bg-foreground/90 transition-colors gap-1.5 shadow-xs"
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
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4 bg-secondary/10">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <p className="font-mono text-base text-foreground font-semibold">
            No resources match your search criteria.
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Try broadening your search term or resetting the category and difficulty filters.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="btn-press inline-flex h-9 items-center rounded-lg border border-border bg-card px-4 text-xs font-mono font-medium hover:bg-secondary transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Community Contribution Box */}
      <section className="rounded-2xl border border-border/80 bg-secondary/20 p-6 sm:p-8 md:p-10 space-y-4">
        <div className="flex items-center gap-2.5">
          <Code className="h-5 w-5 text-primary" />
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Suggest or Curate a Learning Material
          </h3>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
          Found an exceptional book, interactive playground, algorithm visualizer, or benchmark sheet that helped your engineering journey at BIT Mesra? Submit a pull request on the ACM GitHub repository or reach out to chapter leads.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/acm-bitmesra/acm-bitmesra.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-mono font-medium text-foreground hover:bg-secondary transition-colors gap-1.5 shadow-xs"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>Open Pull Request</span>
          </a>
        </div>
      </section>
    </div>
  );
}
