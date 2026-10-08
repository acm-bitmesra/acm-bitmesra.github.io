import Link from "next/link";
import { ArrowRight, BookOpen } from "@animateicons/react/lucide";
import { getPublishedPosts, PublishedPostListItem } from "@/db/queries/blog";
import { getPublishedBlogPosts } from "@/data/blog";
import { ArticleCard } from "@/components/blog/article-card";

export async function HomepageBlogSection() {
  let posts: PublishedPostListItem[] = [];

  try {
    posts = await getPublishedPosts({ limit: 3 });
  } catch (error) {
    console.error("Failed to query live blog posts for homepage, falling back to static:", error);
  }

  // Fallback to static articles if database returns empty or encountered network error
  if (!posts || posts.length === 0) {
    const staticPosts = getPublishedBlogPosts().slice(0, 3);
    posts = staticPosts.map((p) => ({
      id: p.slug,
      title: p.title,
      slug: p.slug,
      excerpt: p.description,
      category: p.category,
      featured: false,
      readingTimeMinutes: parseInt(p.readingTime) || 5,
      publishedAt: new Date(p.date),
      authors: [
        {
          name: p.author,
          role: "ACM Student Chapter",
        },
      ],
      tags: p.tags.map((t) => ({ name: t, slug: t.toLowerCase() })),
    }));
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 md:py-20 border-b border-border/80 bg-background/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider mb-1">
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              <span>Engineering & Research Publications</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Chapter Dispatches
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Deep dives into algorithms, systems engineering, research, and student computing initiatives.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-xs sm:text-sm font-mono font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group shrink-0"
          >
            <span>All articles</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
