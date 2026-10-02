import type { Metadata } from "next";
import { getPublishedBlogPosts } from "@/data/blog";
import { ArticleCard } from "@/components/blog/article-card";

export const metadata: Metadata = {
  title: "Technical Blog & Engineering Notes",
  description:
    "Engineering insights, algorithmic problem-solving tutorials, open-source guides, and chapter updates from ACM BIT Mesra.",
};

export default function BlogIndexPage() {
  const publishedPosts = getPublishedBlogPosts();

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Document Header */}
        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="text-xs font-mono text-muted-foreground">
            Editorial / Engineering Articles
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Chapter Technical Blog
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Articles by students and mentors at BIT Mesra covering algorithmic techniques, distributed tools, open-source maintainership, and systems architecture.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publishedPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
