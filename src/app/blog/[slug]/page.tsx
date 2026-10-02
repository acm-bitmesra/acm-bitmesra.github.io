import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getPublishedBlogPosts, getRelatedBlogPosts } from "@/data/blog";
import { formatDate } from "@/lib/date";
import { siteConfig } from "@/config/site";
import { ArticleCard } from "@/components/blog/article-card";
import { ArrowLeft, Calendar, Clock, Share2, User } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getPublishedBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: `${post.title} | Blog`,
    description: post.description,
    openGraph: {
      title: `${post.title} | ACM BIT Mesra Blog`,
      description: post.description,
      url: postUrl,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ACM BIT Mesra Blog`,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.slug);
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  // JSON-LD Article Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: post.author,
      url: siteConfig.url,
    },
    datePublished: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <article className="py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Articles
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {post.description}
          </p>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs font-mono text-muted-foreground border-t border-border/60">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <User className="h-3.5 w-3.5 text-primary" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime}
              </span>
            </div>

            {/* Share Links */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  post.title
                )}&url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
                className="p-1 rounded hover:text-foreground transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>
        </header>

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6 text-base sm:text-lg leading-relaxed">
          {post.content.split("\n\n").map((block, idx) => {
            const trimmed = block.trim();
            if (trimmed.startsWith("### ")) {
              return (
                <h2
                  key={idx}
                  className="text-2xl sm:text-3xl font-extrabold text-foreground pt-6 pb-2 border-b border-border/40"
                >
                  {trimmed.replace("### ", "")}
                </h2>
              );
            }
            if (trimmed.startsWith("---")) {
              return <hr key={idx} className="my-8 border-border/60" />;
            }
            if (trimmed.startsWith("- ")) {
              const items = trimmed.split("\n").map((li) => li.replace("- ", ""));
              return (
                <ul key={idx} className="list-disc list-inside space-y-2 pl-2 text-sm sm:text-base">
                  {items.map((item, i) => (
                    <li key={i} className="text-foreground/90">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            if (trimmed.startsWith("1. ")) {
              const items = trimmed.split("\n").map((li) => li.replace(/^\d+\.\s*/, ""));
              return (
                <ol key={idx} className="list-decimal list-inside space-y-2 pl-2 text-sm sm:text-base">
                  {items.map((item, i) => (
                    <li key={i} className="text-foreground/90">
                      {item}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={idx} className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="pt-8 border-t border-border flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Topics:</span>
            {post.tags.map((t) => (
              <span
                key={t}
                className="font-mono text-xs rounded border border-border bg-secondary/50 px-2.5 py-1 text-foreground"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="space-y-6 pt-12 border-t border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                More Technical Articles
              </h2>
              <Link href="/blog" className="text-xs font-mono text-primary hover:underline">
                View all articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rPost) => (
                <ArticleCard key={rPost.slug} post={rPost} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
