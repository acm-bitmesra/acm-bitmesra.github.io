import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getPublishedCategories } from "@/db/queries/blog";
import { MediumStoryRow } from "@/components/blog/medium-story-row";
import { siteConfig } from "@/config/site";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  return {
    title: `${decoded} — Articles | ACM BIT Mesra Journal`,
    description: `Engineering articles and technical notes in ${decoded} from ACM BIT Mesra.`,
    alternates: {
      canonical: `${siteConfig.url}/blog/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedCategory = decodeURIComponent(slug);

  // Find matching category (case-insensitive)
  const categories = await getPublishedCategories();
  const matched = categories.find(
    (c) => c.category.toLowerCase() === decodedCategory.toLowerCase()
  );

  const categoryName = matched ? matched.category : decodedCategory;
  const posts = await getPublishedPosts({ category: categoryName, limit: 30 });

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="space-y-3 border-b border-border/50 pb-6 sm:pb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>All Stories</span>
          </Link>
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Topic</span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {categoryName}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            Curated engineering publications and research summaries in {categoryName}.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="divide-y divide-border/50">
            {posts.map((post) => (
              <MediumStoryRow key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/80 p-12 text-center space-y-3">
            <div className="text-sm text-foreground font-semibold">
              No published articles found in topic &quot;{categoryName}&quot;.
            </div>
            <Link href="/blog" className="text-xs text-primary hover:underline font-medium">
              Browse all stories →
            </Link>
          </div>
        )}

        {/* Other Categories */}
        <div className="pt-8 border-t border-border/50 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Explore Other Topics
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.category}
                href={`/blog/category/${encodeURIComponent(c.category.toLowerCase())}`}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  c.category.toLowerCase() === decodedCategory.toLowerCase()
                    ? "bg-foreground text-background font-semibold"
                    : "bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.category} ({c.count})
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
