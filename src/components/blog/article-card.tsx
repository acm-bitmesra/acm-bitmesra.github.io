import Link from "next/link";
import { formatDate } from "@/lib/date";
import { Clock, Calendar, ArrowRight, User } from "@animateicons/react/lucide";
import { PublishedPostListItem } from "@/db/queries/blog";

interface ArticleCardProps {
  post: PublishedPostListItem;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const primaryAuthor = post.authors?.[0] || { name: "ACM BIT Mesra", role: "Student Chapter" };
  const formattedDate = post.publishedAt ? formatDate(post.publishedAt) : "Recently published";

  return (
    <article className="card-hover rounded-xl border border-border/80 bg-card/60 p-6 flex flex-col justify-between h-full hover:border-border hover:bg-card hover:shadow-lg transition-all duration-200 group relative">
      <div className="space-y-4">
        {/* Category & Reading Time */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/blog/category/${encodeURIComponent(post.category.toLowerCase())}`}
            className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-secondary/80 border border-border/60 hover:text-foreground hover:bg-secondary hover:border-border transition-colors whitespace-nowrap"
          >
            {post.category}
          </Link>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground shrink-0">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {post.readingTimeMinutes} min read
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
            <Link href={`/blog/${post.slug}`} className="focus:outline-none focus:underline">
              {post.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Author Byline with Role Snapshot */}
        <div className="flex items-center gap-2.5 pt-1 text-xs">
          <div className="h-7 w-7 rounded-full bg-secondary border border-border/70 flex items-center justify-center text-muted-foreground shrink-0">
            <User className="h-3.5 w-3.5 shrink-0" />
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-semibold text-foreground text-xs truncate">
              {primaryAuthor.name}
            </span>
            {primaryAuthor.role && (
              <span className="text-[11px] text-muted-foreground font-mono truncate">
                {primaryAuthor.role}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.slice(0, 3).map((t) => (
              <Link
                key={t.slug}
                href={`/blog/tag/${t.slug}`}
                className="rounded-md bg-secondary/50 border border-border/40 px-2 py-0.5 text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-border transition-colors"
              >
                #{t.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="pt-4 mt-5 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>{formattedDate}</span>
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:text-primary transition-colors whitespace-nowrap"
        >
          <span>Read Article</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
