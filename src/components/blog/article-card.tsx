import Link from "next/link";
import { formatDate } from "@/lib/date";
import { Clock, Calendar, ArrowRight, User } from "lucide-react";
import { PublishedPostListItem } from "@/db/queries/blog";

interface ArticleCardProps {
  post: PublishedPostListItem;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const primaryAuthor = post.authors[0] || { name: "ACM BIT Mesra", role: "Student Chapter" };

  return (
    <article className="rounded-lg border border-border/80 bg-card p-5 sm:p-6 flex flex-col justify-between hover:border-border hover:bg-secondary/20 transition-all duration-200 group relative">
      <div className="space-y-3.5">
        {/* Category & Reading Time */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/blog/category/${encodeURIComponent(post.category.toLowerCase())}`}
            className="font-mono text-[10px] text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary/80 border border-border/60 hover:text-foreground hover:bg-secondary transition-colors"
          >
            {post.category}
          </Link>
          <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {post.readingTimeMinutes} min read
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground group-hover:underline leading-snug">
            <Link href={`/blog/${post.slug}`} className="focus:outline-none focus:underline">
              {post.title}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Author Byline with Role Snapshot (Section 22 & 39) */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <div className="h-5 w-5 rounded-full bg-secondary border border-border/80 flex items-center justify-center text-muted-foreground shrink-0">
            <User className="h-3 w-3" />
          </div>
          <div className="flex items-baseline gap-1.5 min-w-0 text-[11px] font-mono">
            <span className="font-semibold text-foreground truncate">{primaryAuthor.name}</span>
            <span className="text-muted-foreground/60 hidden sm:inline">·</span>
            <span className="text-muted-foreground truncate hidden sm:inline">{primaryAuthor.role}</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {post.tags.slice(0, 4).map((t) => (
              <Link
                key={t.slug}
                href={`/blog/tag/${t.slug}`}
                className="rounded bg-secondary/40 border border-border/40 px-2 py-0.5 text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                #{t.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="pt-5 mt-5 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          {post.publishedAt ? formatDate(post.publishedAt.toISOString()) : "Recently published"}
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:text-primary transition-colors"
        >
          <span>Read Article</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
