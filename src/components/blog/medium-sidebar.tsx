import Link from "next/link";
import { PublishedPostListItem } from "@/db/queries/blog";
import { formatDate } from "@/lib/date";
import { Sparkles, PenSquare, Rss, ArrowRight } from "lucide-react";

interface MediumSidebarProps {
  featuredPosts: PublishedPostListItem[];
  tags: { name: string; slug: string; count: number }[];
  currentTag?: string;
}

export function MediumSidebar({ featuredPosts, tags, currentTag }: MediumSidebarProps) {
  return (
    <aside className="space-y-10">
      {/* Staff Picks Section */}
      {featuredPosts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Staff Picks</span>
          </div>

          <div className="space-y-5">
            {featuredPosts.slice(0, 3).map((post) => {
              const author = post.authors?.[0] || { name: "ACM BIT Mesra" };
              const date = post.publishedAt ? formatDate(post.publishedAt) : "Recent";

              return (
                <div key={post.slug} className="space-y-1.5 group">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-foreground">
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-medium text-foreground">{author.name}</span>
                    <span className="text-muted-foreground/60">in</span>
                    <span className="truncate max-w-[110px]">{post.category}</span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary group-hover:underline decoration-1 underline-offset-2 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <div className="text-[11px] font-mono text-muted-foreground/80">
                    {date} · {post.readingTimeMinutes} min read
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Topics / Tags */}
      {tags.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-border/50">
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Recommended Topics
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 10).map((t) => {
              const isSelected = currentTag === t.slug;
              return (
                <Link
                  key={t.slug}
                  href={`/blog/tag/${t.slug}`}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-foreground text-background font-semibold"
                      : "bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  #{t.name}
                </Link>
              );
            })}
          </div>

          {tags.length > 10 && (
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium pt-1"
            >
              <span>See more topics</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}

      {/* Write on ACM BIT Mesra CTA */}
      <div className="rounded-xl border border-border/70 bg-card/60 p-5 space-y-3">
        <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
          <PenSquare className="h-4 w-4 text-primary" />
          <span>Write on ACM BIT Mesra</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Share your algorithmic insights, engineering post-mortems, and open-source learnings with fellow students.
        </p>
        <Link
          href="/dashboard/blog/write"
          className="btn-press inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span>Start writing</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Minimal Footer Links */}
      <div className="pt-6 border-t border-border/50 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <Link
          href="/api/blog/rss.xml"
          target="_blank"
          className="hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <Rss className="h-3 w-3 text-amber-500" />
          <span>RSS Feed</span>
        </Link>
        <Link href="/about" className="hover:text-foreground transition-colors">
          About Chapter
        </Link>
        <Link href="/privacy" className="hover:text-foreground transition-colors">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-foreground transition-colors">
          Terms
        </Link>
      </div>
    </aside>
  );
}
