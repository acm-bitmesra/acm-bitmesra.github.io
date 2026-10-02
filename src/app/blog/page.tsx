import type { Metadata } from "next";
import { getPublishedBlogPosts } from "@/data/blog";
import { ArticleCard } from "@/components/blog/article-card";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Technical Blog & Engineering Notes",
  description:
    "Engineering insights, algorithmic problem-solving tutorials, open-source guides, and chapter updates from ACM BIT Mesra.",
};

export default function BlogIndexPage() {
  const publishedPosts = getPublishedBlogPosts();

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Technical Editorial · Engineering Insights</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Chapter Technical Blog
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Written by students and mentors at BIT Mesra. Deep dives into algorithmic invariants, distributed systems, open-source maintainership, and modern software architecture.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
