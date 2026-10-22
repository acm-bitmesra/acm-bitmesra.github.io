"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface BlogSearchProps {
  categories: { category: string; count: number }[];
  tags?: { name: string; slug: string; count: number }[];
  currentCategory?: string;
  currentTag?: string;
  currentSearch?: string;
}

export function BlogSearch({
  categories,
  currentCategory,
  currentSearch,
}: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState(currentSearch || "");
  const [, startTransition] = React.useTransition();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  const handleCategorySelect = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!category || currentCategory?.toLowerCase() === category.toLowerCase()) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar (Medium style minimalist rounded-full) */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search stories, algorithms, or topics..."
          className="w-full h-9 pl-9 pr-9 rounded-full border border-border/70 bg-secondary/30 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-background transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Medium-style Horizontal Topic Navigation Bar */}
      <nav
        aria-label="Publication topics"
        className="flex items-center gap-6 overflow-x-auto border-b border-border/50 text-xs sm:text-sm scrollbar-none pt-2"
      >
        <button
          type="button"
          onClick={() => handleCategorySelect(null)}
          className={`pb-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
            !currentCategory
              ? "border-foreground text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          All Stories
        </button>

        {categories.map((c) => {
          const isSelected = currentCategory?.toLowerCase() === c.category.toLowerCase();
          return (
            <button
              key={c.category}
              type="button"
              onClick={() => handleCategorySelect(c.category)}
              className={`pb-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                isSelected
                  ? "border-foreground text-foreground font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.category}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
