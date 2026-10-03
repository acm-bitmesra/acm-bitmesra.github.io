import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminPostById } from "@/db/queries/admin-blog";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { formatDate } from "@/lib/date";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  ShieldAlert,
  Edit3,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PreviewArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PreviewArticlePage({ params }: PreviewArticlePageProps) {
  const { id } = await params;
  const post = await getAdminPostById(id);

  if (!post) {
    notFound();
  }

  const primaryAuthor = post.authors[0] || {
    name: "ACM BIT Mesra",
    role: "Student Chapter Contributor",
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Draft Preview Alert Banner */}
      <div className="rounded-xl border border-amber-800/80 bg-amber-950/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <div className="text-xs font-mono text-amber-300 font-semibold uppercase tracking-wider">
              Draft Preview · Status: {post.status}
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              This preview matches exactly how readers will see it once published. Public access returns 404 until published.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/admin/blog/${post.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-900 font-medium text-xs hover:bg-zinc-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Article</span>
          </Link>
          <Link
            href="/admin/blog"
            className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
          >
            All Articles
          </Link>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="space-y-8 rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 sm:p-10">
        {/* Navigation Breadcrumb */}
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Articles list</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 border-b border-zinc-800 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-zinc-400 uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
              {post.category}
            </span>
            <span className="text-zinc-600 font-mono text-xs">/</span>
            <span className="font-mono text-xs text-zinc-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>

          {/* Author Byline & Date */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-900 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 font-semibold">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-white">{primaryAuthor.name}</div>
                <div className="text-[11px] text-zinc-500">{primaryAuthor.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {post.publishedAt
                  ? formatDate(post.publishedAt.toISOString())
                  : "Unpublished Draft"}
              </span>
            </div>
          </div>
        </div>

        {/* Article Markdown Content */}
        <div className="pt-4">
          <MarkdownRenderer content={post.contentMarkdown} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-zinc-500 mr-1">Tags:</span>
            {post.tags.map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
