import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStudentProfileBySlug } from "@/db/queries/students";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { PersonalBlogPost } from "@/db/schema/students";

interface BlogPostPageProps {
  params: Promise<{ slug: string; postSlug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug, postSlug } = await params;
  const profile = await getStudentProfileBySlug(slug);

  if (!profile) {
    return { title: "Blog Not Found | ACM BIT Mesra" };
  }

  const blocks = profile.portfolioBlocks || [];
  const blogsBlock = blocks.find((b) => b.type === "blogs");
  const blogs: PersonalBlogPost[] = Array.isArray(blogsBlock?.content)
    ? (blogsBlock.content as PersonalBlogPost[])
    : [];

  const post = blogs.find((b) => b.slug === postSlug || b.id === postSlug);
  if (!post) {
    return { title: "Article Not Found | ACM BIT Mesra" };
  }

  const authorName = profile.displayName || profile.user.name || "Student Developer";
  const title = `${post.title} — ${authorName} (@${profile.slug})`;
  const description = post.excerpt || `Read ${post.title} by ${authorName} on ACM BIT Mesra.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://acmbitm.campsy.app/u/${profile.slug}/blog/${post.slug}`,
      siteName: "ACM BIT Mesra Student Platform",
      authors: [authorName],
      images: profile.user.image ? [{ url: profile.user.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function StudentBlogPostPage({ params }: BlogPostPageProps) {
  const { slug, postSlug } = await params;
  const profile = await getStudentProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const blocks = profile.portfolioBlocks || [];
  const blogsBlock = blocks.find((b) => b.type === "blogs");
  const blogs: PersonalBlogPost[] = Array.isArray(blogsBlock?.content)
    ? (blogsBlock.content as PersonalBlogPost[])
    : [];

  const post = blogs.find((b) => b.slug === postSlug || b.id === postSlug);
  if (!post) {
    notFound();
  }

  const words = (post.content || "").trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const theme = profile.theme || "minimal";
  const isTerminal = theme === "terminal";
  const isEditorial = theme === "editorial";

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Navigation Breadcrumbs */}
      <div>
        <Link
          href={`/u/${profile.slug}`}
          className={`inline-flex items-center gap-2 text-xs font-semibold transition-all ${
            isTerminal
              ? "text-zinc-400 hover:text-emerald-400 font-mono"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to @{profile.slug}&apos;s profile</span>
        </Link>
      </div>

      {/* Article Header */}
      <header
        className={`space-y-6 pb-8 border-b ${
          isTerminal ? "border-zinc-800" : "border-border"
        }`}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>
                {new Date(post.publishedAt || Date.now()).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime} min read</span>
            </span>
          </div>

          <h1
            className={`text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground ${
              isEditorial ? "font-serif" : isTerminal ? "font-mono" : ""
            }`}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base text-muted-foreground leading-relaxed sm:text-lg">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Author info pill */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Link
            href={`/u/${profile.slug}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            {profile.user.image ? (
              <img
                src={profile.user.image}
                alt={profile.displayName || profile.slug}
                className="h-10 w-10 rounded-xl object-cover border border-border"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                {(profile.displayName || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                <span>{profile.displayName || profile.user.name}</span>
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/20" />
              </div>
              <p className="text-xs text-muted-foreground font-mono">@{profile.slug}</p>
            </div>
          </Link>

          <Link
            href={`/u/${profile.slug}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
          >
            View Profile
          </Link>
        </div>
      </header>

      {/* Blog Markdown Content */}
      <section
        className={`prose prose-zinc dark:prose-invert max-w-none ${
          isTerminal
            ? "prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 font-mono"
            : isEditorial
            ? "font-serif prose-headings:font-sans"
            : ""
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content || "_No content in this post yet._"}
        </ReactMarkdown>
      </section>

      {/* Footer Author Card */}
      <footer className="mt-14 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Written by
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-foreground">
                {profile.displayName || profile.user.name}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-3 w-3" />
                Verified BIT Mesra Student
              </span>
            </div>
          </div>
          <Link
            href={`/u/${profile.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            <span>Full Profile</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {profile.bio && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {profile.bio}
          </p>
        )}
      </footer>
    </article>
  );
}
