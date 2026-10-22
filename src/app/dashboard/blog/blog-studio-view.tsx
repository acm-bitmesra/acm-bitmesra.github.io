"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  PenSquare,
  ExternalLink,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import type { PersonalBlogPost } from "@/db/schema/students";

interface BlogStudioViewProps {
  initialBlogs: PersonalBlogPost[];
  profileSlug?: string | null;
}

export function BlogStudioView({ initialBlogs, profileSlug }: BlogStudioViewProps) {
  const router = useRouter();
  const [blogs, setBlogs] = React.useState<PersonalBlogPost[]>(initialBlogs);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the article "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/profile/blogs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete article");
      }

      setBlogs((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting article");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Personal Blog Studio
              </h1>
            </div>
            <p className="text-xs text-muted-foreground max-w-xl">
              Write rich technical articles, project breakdowns, and competitive programming notes using BlockNote. Articles are published exclusively to your verified profile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/blog/write"
              className="btn-press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              <span>Write New Article</span>
            </Link>
          </div>
        </div>

        {!profileSlug && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>
              You haven&apos;t set up your public profile handle yet.{" "}
              <Link href="/dashboard/profile" className="font-semibold underline">
                Claim your profile handle
              </Link>{" "}
              so your articles can be viewed publicly at /u/[your-handle]/blog.
            </span>
          </div>
        )}
      </div>

      {/* Articles List */}
      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="text-base font-bold text-foreground">No articles published yet</h2>
          <p className="mt-1 max-w-md text-xs text-muted-foreground leading-relaxed">
            Share what you learn with the BIT Mesra community and tech recruiters. Document your open-source projects, system designs, or algorithm tips.
          </p>
          <Link
            href="/dashboard/blog/write"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span>Start Writing with BlockNote</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">
              {blogs.length} {blogs.length === 1 ? "Article" : "Articles"} Published
            </span>
            <span className="font-mono text-[11px]">Powered by BlockNote Editor</span>
          </div>

          <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {blogs.map((b) => (
              <div
                key={b.id}
                className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/dashboard/blog/write?id=${b.id}`}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors hover:underline truncate"
                    >
                      {b.title}
                    </Link>
                    {b.tags && b.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {b.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-secondary px-1.5 py-0.2 font-mono text-[9px] text-secondary-foreground"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {b.excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {b.excerpt}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(b.publishedAt).toLocaleDateString()}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{b.readingTimeMinutes || 2} min read</span>
                    </span>
                    {profileSlug && (
                      <>
                        <span>·</span>
                        <span className="font-mono text-[10px] text-muted-foreground/80 truncate">
                          /u/{profileSlug}/blog/{b.slug}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  {profileSlug && (
                    <Link
                      href={`/u/${profileSlug}/blog/${b.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      <span>Live View</span>
                    </Link>
                  )}

                  <Link
                    href={`/dashboard/blog/write?id=${b.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <PenSquare className="h-3 w-3" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(b.id, b.title)}
                    disabled={deletingId === b.id}
                    title="Delete Article"
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
