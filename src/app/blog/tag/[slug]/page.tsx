import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getPublishedTags, PublishedPostListItem } from "@/db/queries/blog";
import { getPublishedBlogPosts } from "@/data/blog";
import { ArticleCard } from "@/components/blog/article-card";
import { siteConfig } from "@/config/site";
import { ArrowLeft, Tag } from "@animateicons/react/lucide";

export const dynamic = "force-dynamic";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `#${slug} — Articles | ACM BIT Mesra Journal`,
    description: `Engineering articles and technical notes tagged with #${slug} from ACM BIT Mesra.`,
    alternates: {
      canonical: `${siteConfig.url}/blog/tag/${slug}`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  let posts: PublishedPostListItem[] = [];
  let allTags: { name: string; slug: string; count: number }[] = [];

  try {
    const [fetchedPosts, fetchedTags] = await Promise.all([
      getPublishedPosts({ tag: slug, limit: 30 }),
      getPublishedTags(),
    ]);
    posts = fetchedPosts;
    allTags = fetchedTags;
  } catch (error) {
    console.error("Failed to query live blog posts by tag, using static:", error);
  }

  if (posts.length === 0) {
    const staticPosts = getPublishedBlogPosts().filter((p) =>
      p.tags.some((t) => t.toLowerCase() === slug.toLowerCase())
    );
    posts = staticPosts.map((p) => ({
      id: p.slug,
      title: p.title,
      slug: p.slug,
      excerpt: p.description,
      category: p.category,
      featured: false,
      readingTimeMinutes: parseInt(p.readingTime) || 5,
      publishedAt: new Date(p.date),
      authors: [{ name: p.author, role: "ACM Student Chapter" }],
      tags: p.tags.map((t) => ({ name: t, slug: t.toLowerCase() })),
    }));
  }

  if (allTags.length === 0) {
    const tagCount = new Map<string, { name: string; slug: string; count: number }>();
    for (const p of getPublishedBlogPosts()) {
      for (const t of p.tags) {
        const s = t.toLowerCase();
        const existing = tagCount.get(s);
        if (existing) existing.count += 1;
        else tagCount.set(s, { name: t, slug: s, count: 1 });
      }
    }
    allTags = Array.from(tagCount.values());
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-4 border-b border-border/60 pb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to All Articles
          </Link>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              #{slug}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Technical publications and student engineering notes tagged with #{slug}.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/80 p-12 text-center space-y-3">
            <div className="font-mono text-sm text-foreground font-semibold">
              No published articles found with tag #{slug}.
            </div>
            <Link href="/blog" className="text-xs font-mono text-primary hover:underline">
              Browse all articles →
            </Link>
          </div>
        )}

        {/* Other Tags */}
        <div className="pt-8 border-t border-border/60 space-y-3">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Other Topics
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((t) => (
              <Link
                key={t.slug}
                href={`/blog/tag/${t.slug}`}
                className={`rounded border px-2.5 py-1 text-xs font-mono transition-colors ${
                  t.slug === slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/30 border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                #{t.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
