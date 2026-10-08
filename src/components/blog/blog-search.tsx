"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "@animateicons/react/lucide";

interface BlogSearchProps {
  categories: { category: string; count: number }[];
  tags: { name: string; slug: string; count: number }[];
  currentCategory?: string;
  currentTag?: string;
  currentSearch?: string;
}

export function BlogSearch({
  categories,
  tags: _tags,
  currentCategory,
  currentTag: _currentTag,
  currentSearch,
}: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(currentSearch || "");
  const [, startTransition] = useTransition();

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

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentCategory === category) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search engineering articles by title, topic, or keyword..."
          className="w-full h-10 pl-10 pr-10 rounded-md border border-border/80 bg-secondary/30 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-muted-foreground mr-1">Categories:</span>
          {categories.map((c) => {
            const isSelected = currentCategory === c.category;
            return (
              <button
                key={c.category}
                type="button"
                onClick={() => handleCategoryClick(c.category)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-secondary"
                }`}
              >
                {c.category} <span className="opacity-60 text-[10px]">({c.count})</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
