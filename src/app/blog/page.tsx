import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getPublishedCategories, getPublishedTags, PublishedPostListItem } from "@/db/queries/blog";
import { getPublishedBlogPosts } from "@/data/blog";
import { MediumStoryRow } from "@/components/blog/medium-story-row";
import { MediumSidebar } from "@/components/blog/medium-sidebar";
import { BlogSearch } from "@/components/blog/blog-search";
import { siteConfig } from "@/config/site";
import { Rss, BookOpen, PenSquare } from "lucide-react";

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

  let posts: PublishedPostListItem[] = [];
  let categories: { category: string; count: number }[] = [];
  let tags: { name: string; slug: string; count: number }[] = [];

  try {
    const [fetchedPosts, fetchedCategories, fetchedTags] = await Promise.all([
      getPublishedPosts({
        search: q,
        category,
        tag,
        limit: 30,
      }),
      getPublishedCategories(),
      getPublishedTags(),
    ]);
    posts = fetchedPosts;
    categories = fetchedCategories;
    tags = fetchedTags;
  } catch (error) {
    console.error("Failed to query live blog posts for /blog, falling back to static:", error);
  }

  // Fallback to static articles if database is offline or empty
  if (!posts || posts.length === 0) {
    let staticPosts = getPublishedBlogPosts();
    if (q) {
      const query = q.toLowerCase();
      staticPosts = staticPosts.filter(
        (p) => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }
    if (category) {
      staticPosts = staticPosts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (tag) {
      staticPosts = staticPosts.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
    }
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

    if (categories.length === 0) {
      const allStatic = getPublishedBlogPosts();
      const catCount = new Map<string, number>();
      const tagCount = new Map<string, { name: string; slug: string; count: number }>();
      for (const p of allStatic) {
        catCount.set(p.category, (catCount.get(p.category) || 0) + 1);
        for (const t of p.tags) {
          const s = t.toLowerCase();
          const existing = tagCount.get(s);
          if (existing) {
            existing.count += 1;
          } else {
            tagCount.set(s, { name: t, slug: s, count: 1 });
          }
        }
      }
      categories = Array.from(catCount.entries()).map(([c, count]) => ({ category: c, count }));
      tags = Array.from(tagCount.values());
    }
  }

  // Staff Picks / Featured Selection
  const staffPicks = posts.filter((p) => p.featured).length > 0
    ? posts.filter((p) => p.featured)
    : posts.slice(0, 3);

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
    <div className="min-h-screen bg-background py-8 sm:py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Medium-style Publication Masthead */}
        <header className="border-b border-border/50 pb-6 sm:pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                <span>ACM BIT Mesra Publication</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.08]">
                The Technical Journal
              </h1>
              <p className="max-w-[62ch] text-sm sm:text-base text-muted-foreground leading-relaxed">
                In-depth engineering notes, algorithmic intuition, open-source maintainer guides, and systems architecture written by BIT Mesra student developers.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
              <Link
                href="/dashboard/blog/write"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <PenSquare className="h-3.5 w-3.5" />
                <span>Write a story</span>
              </Link>

              <Link
                href="/api/blog/rss.xml"
                target="_blank"
                title="RSS Feed"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Rss className="h-3.5 w-3.5 text-amber-500" />
                <span className="hidden sm:inline">RSS</span>
              </Link>
            </div>
          </div>

          {/* Medium Topic Navigation & Search */}
          <div className="mt-6 pt-2">
            <BlogSearch
              categories={categories}
              currentCategory={category}
              currentSearch={q}
            />
          </div>
        </header>

        {/* Filter State Pill Banner */}
        {(category || tag || q) && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-md bg-secondary/30 border border-border/50 text-xs font-mono">
            <span className="text-muted-foreground">
              Filtering by:{" "}
              {category && <span className="font-semibold text-foreground">Topic: {category}</span>}
              {tag && <span className="font-semibold text-foreground">Tag: #{tag}</span>}
              {q && <span className="font-semibold text-foreground">Search: &quot;{q}&quot;</span>}
            </span>
            <Link href="/blog" className="text-primary hover:underline font-sans font-semibold text-xs shrink-0">
              Clear filter
            </Link>
          </div>
        )}

        {/* Main Grid: 2-Column Medium Architecture (Feed Left, Sidebar Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Story Feed (Column 1 - 8 cols) */}
          <main className="lg:col-span-8 min-w-0">
            {posts.length > 0 ? (
              <div className="divide-y divide-border/50">
                {posts.map((post, idx) => (
                  <MediumStoryRow
                    key={post.slug}
                    post={post}
                    isFeatured={idx === 0 && !category && !tag && !q}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3 rounded-lg border border-dashed border-border/80 p-8">
                <div className="font-semibold text-base text-foreground">
                  No stories match your criteria
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                  Try searching for a different keyword or explore other topic tabs above.
                </p>
                <div className="pt-2">
                  <Link
                    href="/blog"
                    className="inline-flex h-8 items-center justify-center rounded-full bg-secondary px-4 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    View all stories
                  </Link>
                </div>
              </div>
            )}
          </main>

          {/* Medium Sidebar (Column 2 - 4 cols) */}
          <div className="hidden lg:block lg:col-span-4 lg:border-l lg:border-border/50 lg:pl-10">
            <MediumSidebar
              featuredPosts={staffPicks}
              tags={tags}
              currentTag={tag}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
