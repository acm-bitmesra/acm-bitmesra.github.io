"use client";

import * as React from "react";
import Link from "next/link";
import { formatDate } from "@/lib/date";
import { PublishedPostListItem } from "@/db/queries/blog";
import { Share2, Check, Bookmark, Sparkles, Terminal, Code2, Cpu, Globe } from "lucide-react";

interface MediumStoryRowProps {
  post: PublishedPostListItem;
  isFeatured?: boolean;
}

export function MediumStoryRow({ post, isFeatured }: MediumStoryRowProps) {
  const [copied, setCopied] = React.useState(false);
  const primaryAuthor = post.authors?.[0] || { name: "ACM BIT Mesra", role: "Student Chapter" };
  const formattedDate = post.publishedAt ? formatDate(post.publishedAt) : "Recent";

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/blog/${post.slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Get iconic graphic based on category
  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes("competitive") || c.includes("algorithm")) return Code2;
    if (c.includes("system") || c.includes("architecture")) return Cpu;
    if (c.includes("open source")) return Terminal;
    return Globe;
  };

  const CategoryIcon = getCategoryIcon(post.category);

  return (
    <article className="group py-7 sm:py-8 border-b border-border/50 last:border-b-0 transition-colors">
      <div className="space-y-3">
        {/* Byline: Author Avatar + Name + Category + Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-foreground border border-border/80 shrink-0">
            {primaryAuthor.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span className="font-medium text-foreground text-xs sm:text-sm">
              {primaryAuthor.name}
            </span>
            <span className="text-muted-foreground/60">in</span>
            <Link
              href={`/blog/category/${encodeURIComponent(post.category.toLowerCase())}`}
              className="font-medium text-foreground/80 hover:text-primary transition-colors truncate max-w-[150px]"
            >
              {post.category}
            </Link>
            <span className="text-muted-foreground/60">·</span>
            <span className="text-muted-foreground font-mono text-[11px]">{formattedDate}</span>
            {isFeatured && (
              <>
                <span className="text-muted-foreground/60">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-3 w-3" />
                  Staff Pick
                </span>
              </>
            )}
          </div>
        </div>

        {/* Content Row: Text on Left + Optional Thumbnail on Right */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
          <div className="flex-1 space-y-1.5 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug sm:leading-tight">
              <Link href={`/blog/${post.slug}`} className="focus:outline-none focus:underline decoration-1 underline-offset-4">
                {post.title}
              </Link>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          {/* Medium-style Article Thumbnail / Topic Illustration */}
          <Link
            href={`/blog/${post.slug}`}
            tabIndex={-1}
            aria-hidden="true"
            className="hidden sm:flex h-24 w-28 md:h-28 md:w-36 shrink-0 rounded-lg border border-border/70 bg-secondary/40 items-center justify-center p-3 text-muted-foreground/70 group-hover:border-primary/40 group-hover:text-primary transition-all overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center gap-1.5 text-center">
              <CategoryIcon className="h-6 w-6 stroke-[1.5]" />
              <span className="font-mono text-[9px] uppercase tracking-wider line-clamp-1 opacity-70">
                {post.category.split(" ")[0]}
              </span>
            </div>
          </Link>
        </div>

        {/* Story Footer Meta: Tags, Reading Time, Action Icons */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-3">
            <Link
              href={`/blog/category/${encodeURIComponent(post.category.toLowerCase())}`}
              className="inline-flex items-center rounded-full bg-secondary/80 hover:bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {post.category}
            </Link>

            <span className="font-mono text-[11px] text-muted-foreground">
              {post.readingTimeMinutes} min read
            </span>

            {post.tags && post.tags.length > 0 && (
              <div className="hidden md:flex items-center gap-1.5">
                {post.tags.slice(0, 2).map((t) => (
                  <Link
                    key={t.slug}
                    href={`/blog/tag/${t.slug}`}
                    className="text-[11px] font-mono text-muted-foreground/70 hover:text-foreground transition-colors"
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              title={copied ? "Link Copied!" : "Share Article"}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Share2 className="h-3.5 w-3.5" />
              )}
            </button>

            <Link
              href={`/blog/${post.slug}`}
              title="Bookmark / Save"
              className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Bookmark className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
