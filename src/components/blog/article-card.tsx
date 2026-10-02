import Link from "next/link";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/date";
import { Clock, Calendar, ArrowRight } from "lucide-react";

interface ArticleCardProps {
  post: BlogPost;
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="rounded-lg border border-border/80 bg-card p-5 flex flex-col justify-between hover:border-border hover:bg-secondary/20 transition-colors group">
      <div className="space-y-3">
        {/* Category & Reading Time */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary border border-border/60">
            {post.category}
          </span>
          <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {post.readingTime}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:underline leading-snug">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.description}
          </p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded bg-secondary/50 border border-border/60 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          {formatDate(post.date)}
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
