"use client";

import * as React from "react";
import { RecommendedRepo } from "@/types";
import { GithubIcon } from "@/components/ui/icons";
import {
  ExternalLink,
  GitBranch,
  Star,
  Search,
  Sparkles,
  Lightbulb,
  BookOpen,
} from "@animateicons/react/lucide";

interface RecommendedReposSectionProps {
  repos: RecommendedRepo[];
}

export function RecommendedReposSection({ repos }: RecommendedReposSectionProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const categories = React.useMemo(() => {
    const cats = new Set<string>();
    repos.forEach((r) => cats.add(r.category));
    return ["All", ...Array.from(cats)];
  }, [repos]);

  const filteredRepos = React.useMemo(() => {
    return repos.filter((repo) => {
      const matchesCategory =
        selectedCategory === "All" || repo.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        repo.name.toLowerCase().includes(q) ||
        repo.description.toLowerCase().includes(q) ||
        (repo.language && repo.language.toLowerCase().includes(q)) ||
        (repo.goodFor && repo.goodFor.toLowerCase().includes(q)) ||
        (repo.tags && repo.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [repos, searchQuery, selectedCategory]);

  const getLanguageColor = (lang?: string) => {
    if (!lang) return "bg-zinc-400";
    const l = lang.toLowerCase();
    if (l.includes("python")) return "bg-blue-400";
    if (l.includes("typescript")) return "bg-sky-400";
    if (l.includes("javascript")) return "bg-amber-400";
    if (l.includes("java")) return "bg-orange-500";
    if (l.includes("markdown") || l.includes("git")) return "bg-emerald-400";
    return "bg-purple-400";
  };

  return (
    <section aria-labelledby="recommended-repos-heading" className="space-y-8">
      {/* Header with theme callout */}
      <div className="border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated for Hacktoberfest 2026</span>
            </div>
            <h3
              id="recommended-repos-heading"
              className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
            >
              Recommended Open Source Repositories
            </h3>
            <p className="max-w-[75ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
              A handpicked selection of top open-source projects welcoming contributions this season.
              Explore beginner-friendly issues, build with open-weight AI architectures, or contribute to
              essential developer tooling. You can also contribute to any public repository maintained by ACM BIT Mesra, not just the projects listed below.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border border-primary/20 bg-primary/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="font-semibold text-foreground">Want to contribute to an ACM-built project?</p>
            <p className="mt-1 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
              Explore any repository in the ACM BIT Mesra GitHub organization. Choose a project you like, read its README and contribution guidelines, and check issues before starting.
            </p>
          </div>
          <a
            href="https://github.com/acm-bitmesra/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <GithubIcon className="h-4 w-4" />
            Browse ACM projects
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Search and Category Filters */}
        <div className="mt-6 flex flex-col gap-4 pt-6 border-t border-border/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by repo name, language, or keyword..."
              aria-label="Filter recommended repositories"
              className="w-full bg-background/80 border border-border pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground rounded-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Repository Categories">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn-press px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/60"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      {filteredRepos.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredRepos.map((repo) => (
            <div
              key={repo.name}
              className="card-hover group relative flex flex-col justify-between border border-border bg-card/75 p-6 transition-all duration-300 hover:border-border/90 hover:bg-card/90"
            >
              <div className="space-y-4">
                {/* Top Meta: Category + Stars */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-mono text-muted-foreground">
                    {repo.category}
                  </span>
                  {repo.stars && (
                    <div className="inline-flex items-center gap-1 font-mono font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 border border-amber-400/20">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{repo.stars}</span>
                    </div>
                  )}
                </div>

                {/* Repo Title */}
                <div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>{repo.name}</span>
                    <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {repo.description}
                  </p>
                </div>

                {/* Good For Recommendation Box */}
                {repo.goodFor && (
                  <div className="border-l-2 border-primary/50 bg-secondary/30 px-3.5 py-2.5 text-xs leading-relaxed text-foreground/90">
                    <span className="font-semibold text-primary">Good for: </span>
                    {repo.goodFor}
                  </div>
                )}

                {/* Tags and Language */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono text-foreground/80 bg-secondary/50 border border-border">
                      <span className={`h-2 w-2 rounded-full ${getLanguageColor(repo.language)}`} />
                      {repo.language}
                    </span>
                  )}
                  {repo.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] font-mono text-muted-foreground bg-secondary/20 border border-border/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border/60 pt-4">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press inline-flex items-center gap-1.5 bg-foreground text-background hover:bg-foreground/90 px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  <span>GitHub Repository</span>
                </a>

                {repo.issuesUrl && (
                  <a
                    href={repo.issuesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press inline-flex items-center gap-1.5 border border-border bg-secondary/30 text-foreground hover:bg-secondary px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <GitBranch className="h-3.5 w-3.5 text-primary" />
                    <span>Good First Issues</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-border/80 bg-secondary/10 p-12 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <p className="mt-3 text-base font-medium text-foreground">
            No repositories found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search query or switching categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Contribution Guidelines & Pro-Tips Callout */}
      <div className="border border-border/80 bg-secondary/15 p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5 text-foreground font-semibold text-base">
          <Lightbulb className="h-5 w-5 text-amber-400 shrink-0" />
          <span>Hacktoberfest 2026 Contribution Best Practices</span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 text-xs leading-relaxed text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong className="text-foreground">Read CONTRIBUTING.md first:</strong> Always inspect setup steps, lint rules, and branch naming guidelines before pushing code.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong className="text-foreground">Filter by beginner labels:</strong> Search GitHub using <code className="bg-secondary/60 px-1 py-0.5 text-foreground">is:issue is:open label:&quot;good first issue&quot;</code> to find curated beginner tasks.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong className="text-foreground">Focus on quality:</strong> Thoughtful bugfixes, test suites, or documentation clarity are far more valuable than volume.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong className="text-foreground">No spam PRs:</strong> Meaningless typo changes or automated PRs without context get marked as spam and disqualify accounts.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
