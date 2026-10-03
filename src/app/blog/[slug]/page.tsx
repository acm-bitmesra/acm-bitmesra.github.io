import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPublishedPostBySlug, getRelatedPosts } from "@/db/queries/blog";
import { formatDate } from "@/lib/date";
import { siteConfig } from "@/config/site";
import { ArticleCard } from "@/components/blog/article-card";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { ArrowLeft, Calendar, Clock, Tag, User, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post, redirectSlug } = await getPublishedPostBySlug(slug);

  if (redirectSlug) {
    redirect(`/blog/${redirectSlug}`);
  }

  if (!post) {
    return { title: "Article Not Found | ACM BIT Mesra" };
  }

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: `${post.title} | ACM BIT Mesra Journal`,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: `${post.title} | ACM BIT Mesra Technical Journal`,
      description: post.excerpt,
      url: postUrl,
      type: "article",
      publishedTime: post.publishedAt ? post.publishedAt.toISOString() : undefined,
      modifiedTime: post.updatedAt ? post.updatedAt.toISOString() : undefined,
      authors: post.authors.map((a) => a.name),
      images: post.coverImageUrl ? [{ url: post.coverImageUrl, alt: post.coverImageAlt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ACM BIT Mesra`,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { post, redirectSlug } = await getPublishedPostBySlug(slug);

  if (redirectSlug) {
    redirect(`/blog/${redirectSlug}`);
  }

  // Strictly return 404 for unapproved drafts or non-existent articles
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category, 3);
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  // JSON-LD BlogPosting Structured Data (Section 24)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    articleBody: post.contentMarkdown,
    image: post.coverImageUrl || undefined,
    datePublished: post.publishedAt ? post.publishedAt.toISOString() : undefined,
    dateModified: post.updatedAt ? post.updatedAt.toISOString() : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    author: post.authors.map((a) => ({
      "@type": "Person",
      name: a.name,
      jobTitle: a.role,
      worksFor: {
        "@type": "Organization",
        name: "ACM BIT Mesra Student Chapter",
        url: siteConfig.url,
      },
    })),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon.svg`,
      },
    },
  };

  return (
    <article className="py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link & Navigation */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Journal
          </Link>

          <Link
            href={`/blog/category/${encodeURIComponent(post.category.toLowerCase())}`}
            className="font-mono text-xs text-muted-foreground uppercase px-2.5 py-0.5 rounded bg-secondary/80 border border-border/60 hover:text-foreground transition-colors"
          >
            {post.category}
          </Link>
        </div>

        {/* Article Header (Section 23: Editorial Hierarchy) */}
        <header className="space-y-6">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.12]">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>

          {/* Author Byline with Immutable Role Snapshot (Section 14 & 15) */}
          <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-4">
              {post.authors.map((author, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-secondary border border-border/80 flex items-center justify-center text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      {author.name}
                      <span title="Verified Chapter Author">
                        <ShieldCheck className="h-3 w-3 text-primary" />
                      </span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">{author.role}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {post.publishedAt ? formatDate(post.publishedAt.toISOString()) : "Recently published"}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTimeMinutes} min read
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image if provided */}
        {post.coverImageUrl && (
          <div className="rounded-lg overflow-hidden border border-border/80 bg-card">
            <img
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.title}
              className="w-full h-auto max-h-[460px] object-cover"
            />
          </div>
        )}

        {/* Article Body (Sanitized Markdown) */}
        <div className="mx-auto max-w-[760px] pt-4">
          <MarkdownRenderer content={post.contentMarkdown} />
        </div>

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 border-t border-border/60 space-y-3">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3 w-3" />
              Article Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <Link
                  key={t.slug}
                  href={`/blog/tag/${t.slug}`}
                  className="rounded bg-secondary/40 border border-border/60 px-2.5 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Chapter Attribution Box (Section 39 & 67) */}
        <div className="rounded-lg border border-border/80 bg-secondary/20 p-6 sm:p-8 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Official Chapter Publication
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            This article is an official peer-reviewed publication produced by members of the{" "}
            <span className="text-foreground font-semibold">ACM Student Chapter at BIT Mesra</span>.
            Our technical journal documents software systems, competitive programming intuition, research findings, and open-source tooling built by students.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/about"
              className="text-xs font-mono text-primary hover:underline"
            >
              About the Chapter →
            </Link>
            <span className="text-border">·</span>
            <Link
              href="/resources"
              className="text-xs font-mono text-muted-foreground hover:text-foreground"
            >
              Browse Student Roadmaps →
            </Link>
          </div>
        </div>

        {/* Related Articles Section (Section 64) */}
        {relatedPosts.length > 0 && (
          <section className="pt-12 border-t border-border/80 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Related Reading from ACM BIT Mesra
              </h2>
              <p className="text-xs text-muted-foreground">
                More technical articles from the {post.category} collection.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <ArticleCard key={related.slug} post={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
