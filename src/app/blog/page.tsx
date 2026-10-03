import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getPublishedCategories, getPublishedTags } from "@/db/queries/blog";
import { ArticleCard } from "@/components/blog/article-card";
import { BlogSearch } from "@/components/blog/blog-search";
import { siteConfig } from "@/config/site";
import { Rss, BookOpen, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Journal — Engineering & Knowledge Publication | ACM BIT Mesra",
  description:
    "Official publication of ACM BIT Mesra. In-depth technical articles, algorithmic intuition, open-source maintainer guides, and systems architecture written by chapter students and mentors.",
  alternates: {
    canonical: `${siteConfig.url}/blog`,
    types: {
      "application/rss+xml": `${siteConfig.url}/api/blog/rss.xml`,
    },
  },
  openGraph: {
    title: "ACM BIT Mesra Technical Journal",
    description: "In-depth engineering notes, competitive programming intuition, and systems architecture.",
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

interface BlogIndexPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
  }>;
}

export default async function BlogIndexPage({ searchParams }: BlogIndexPageProps) {
  const { q, category, tag } = await searchParams;

  const [posts, categories, tags] = await Promise.all([
    getPublishedPosts({
      search: q,
      category,
      tag,
      limit: 30,
    }),
    getPublishedCategories(),
    getPublishedTags(),
  ]);

  // JSON-LD Breadcrumb List
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.url}/blog`,
      },
    ],
  };

  return (
    <div className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Document Header */}
        <div className="space-y-4 border-b border-border/60 pb-8">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Official ACM BIT Mesra Publication
            </div>
            <Link
              href="/api/blog/rss.xml"
              target="_blank"
              title="RSS Feed"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              <Rss className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden sm:inline">RSS Feed</span>
            </Link>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            The Technical Journal
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
            Engineering insights, algorithmic problem-solving techniques, open-source maintainer guides, and systems architecture authored by students and mentors at BIT Mesra.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-2">
            <BlogSearch
              categories={categories}
              tags={tags}
              currentCategory={category}
              currentTag={tag}
              currentSearch={q}
            />
          </div>
        </div>

        {/* Filter State Banner (if active filter) */}
        {(category || tag || q) && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-md bg-secondary/30 border border-border/60 text-xs font-mono">
            <span className="text-muted-foreground break-words">
              Filtering by:{" "}
              {category && <span className="font-semibold text-foreground">Category: {category}</span>}
              {tag && <span className="font-semibold text-foreground">Tag: #{tag}</span>}
              {q && <span className="font-semibold text-foreground">Search: &quot;{q}&quot;</span>}
            </span>
            <Link href="/blog" className="text-primary hover:underline shrink-0">
              Reset filters
            </Link>
          </div>
        )}

        {/* Articles Grid or Intentional Empty State */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/80 p-12 text-center space-y-3">
            <div className="font-mono text-sm text-foreground font-semibold">
              No published articles match your criteria.
            </div>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Try adjusting your search query, selecting a different topic, or resetting your filters.
            </p>
            <div className="pt-2">
              <Link
                href="/blog"
                className="inline-flex h-8 items-center justify-center rounded-md bg-secondary px-3 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                Clear all filters
              </Link>
            </div>
          </div>
        )}

        {/* Tags Cloud Footer */}
        {tags.length > 0 && (
          <div className="pt-10 border-t border-border/60 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag className="h-3 w-3" />
              Explore Topics & Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <Link
                  key={t.slug}
                  href={`/blog/tag/${t.slug}`}
                  className={`rounded border px-2.5 py-1 text-xs font-mono transition-colors ${
                    tag === t.slug
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/30 border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  #{t.name} <span className="opacity-60 text-[10px]">({t.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
