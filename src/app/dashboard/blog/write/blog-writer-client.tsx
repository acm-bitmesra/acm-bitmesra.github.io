"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
  Tag,
  FileText,
} from "lucide-react";
import type { PersonalBlogPost } from "@/db/schema/students";

// Dynamically import BlockNoteEditor to avoid any SSR/document execution
const DynamicBlockNoteEditor = dynamic(
  () => import("@/components/blog/blocknote-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 w-full items-center justify-center rounded-xl border border-border bg-card p-8">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <BookOpen className="h-8 w-8 animate-pulse text-primary" />
          <span className="text-xs font-mono">Initializing BlockNote Studio...</span>
        </div>
      </div>
    ),
  }
);

interface BlogWriterClientProps {
  initialBlog?: PersonalBlogPost | null;
  profileSlug?: string | null;
}

export function BlogWriterClient({ initialBlog, profileSlug }: BlogWriterClientProps) {
  const router = useRouter();

  const [title, setTitle] = React.useState(initialBlog?.title || "");
  const [slug, setSlug] = React.useState(initialBlog?.slug || "");
  const [excerpt, setExcerpt] = React.useState(initialBlog?.excerpt || "");
  const [content, setContent] = React.useState(initialBlog?.content || "");
  const [tagsInput, setTagsInput] = React.useState((initialBlog?.tags || []).join(", "));
  const [saving, setSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Auto-slug from title if not already manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(Boolean(initialBlog?.slug));

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60);
      setSlug(generated);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMessage("Please enter an article title.");
      return;
    }

    if (!content.trim()) {
      setErrorMessage("Please write some content in your article before saving.");
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/profile/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialBlog?.id,
          title: title.trim(),
          slug: slug.trim() || undefined,
          excerpt: excerpt.trim() || undefined,
          content,
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save blog post");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);

      if (!initialBlog?.id && data.blog?.id) {
        // Redirect to edit mode for the newly created article
        router.push(`/dashboard/blog/write?id=${data.blog.id}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error saving article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <Link
          href="/dashboard/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blog Studio</span>
        </Link>

        <div className="flex items-center gap-3">
          {initialBlog && profileSlug && (
            <Link
              href={`/u/${profileSlug}/blog/${initialBlog.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Live Article</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-press inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : savedSuccess ? (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-300" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>{saving ? "Publishing..." : savedSuccess ? "Published!" : "Publish Article"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
          {errorMessage}
        </div>
      )}

      {savedSuccess && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Article published successfully to your public developer profile!</span>
        </div>
      )}

      {/* Article Metadata Fields */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Article Title..."
            className="w-full text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground placeholder:text-muted-foreground/40 bg-transparent border-0 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Slug Preview */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono pt-1 border-t border-border/60">
          <span className="shrink-0 text-[11px] text-muted-foreground/70">
            acmbitm.campsy.app/u/{profileSlug || "your-profile"}/blog/
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugManuallyEdited(true);
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]+/g, "-")
                  .replace(/^-|-$/g, "")
              );
            }}
            placeholder="custom-slug"
            className="flex-1 text-xs text-foreground bg-transparent border-b border-border/80 focus:border-primary focus:outline-none font-mono py-0.5"
          />
        </div>

        {/* Excerpt Input */}
        <div className="pt-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>Short Excerpt / Summary</span>
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short summary of this article shown on cards and social shares..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Tags Input */}
        <div className="pt-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1">
            <Tag className="h-3.5 w-3.5 text-primary" />
            <span>Tags & Topics</span>
            <span className="text-[10px] text-muted-foreground font-normal">(comma-separated)</span>
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. Next.js, Rust, Open Source, Distributed Systems"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* BlockNote Rich Text Editor Studio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>BlockNote Visual Content Studio</span>
          </span>
          <span className="font-mono text-[11px]">Type &apos;/&apos; for commands & blocks</span>
        </div>

        <DynamicBlockNoteEditor
          initialMarkdown={content}
          onChangeMarkdown={(md) => setContent(md)}
        />
      </div>
    </div>
  );
}
