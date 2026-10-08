import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getPublishedCategories } from "@/db/queries/blog";
import { ArticleCard } from "@/components/blog/article-card";
import { siteConfig } from "@/config/site";
import { ArrowLeft, Folder } from "lucide-react";

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
            <Folder className="h-5 w-5 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {categoryName}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Curated engineering publications and research summaries in {categoryName}.
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
              No published articles found in category &quot;{categoryName}&quot;.
            </div>
            <Link href="/blog" className="text-xs font-mono text-primary hover:underline">
              Browse all articles →
            </Link>
          </div>
        )}

        {/* Other Categories */}
        <div className="pt-8 border-t border-border/60 space-y-3">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            All Categories
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <Link
                key={c.category}
                href={`/blog/category/${encodeURIComponent(c.category.toLowerCase())}`}
                className={`rounded border px-2.5 py-1 text-xs font-mono transition-colors ${
                  c.category.toLowerCase() === decodedCategory.toLowerCase()
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/30 border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
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
