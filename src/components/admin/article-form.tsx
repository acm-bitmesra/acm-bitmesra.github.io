"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createDraftAction,
  updatePostAction,
  submitForReviewAction,
  publishPostAction,
  unpublishPostAction,
  archivePostAction,
} from "@/db/mutations/blog";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import { slugify } from "@/lib/blog/slugify";
import { BlogPostStatus } from "@/db/schema";
import {
  Save,
  Send,
  Globe,
  Archive,
  Eye,
  Edit3,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Code,
  List,
  Quote,
  Table,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

interface ArticleFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    tags: string[];
    contentMarkdown: string;
    coverImageUrl?: string | null;
    coverImageAlt?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    featured: boolean;
    status: BlogPostStatus;
  };
  userPermissions: string[];
  userRoleName: string;
  userName: string;
}

const CATEGORIES = [
  "Systems & Architecture",
  "Competitive Programming",
  "Algorithms & Math",
  "Open Source & Tooling",
  "Web & Distributed Systems",
  "AI & Machine Learning",
  "Chapter Dispatches",
];

export function ArticleForm({
  mode,
  initialData,
  userPermissions,
  userRoleName,
  userName,
}: ArticleFormProps) {
  const router = useRouter();

  // Form State
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(mode === "edit");
  const [excerpt, setExcerpt] = React.useState(initialData?.excerpt || "");
  const [category, setCategory] = React.useState(
    initialData?.category || CATEGORIES[0]
  );
  const [tagsString, setTagsString] = React.useState(
    initialData?.tags ? initialData.tags.join(", ") : ""
  );
  const [coverImageUrl, setCoverImageUrl] = React.useState(
    initialData?.coverImageUrl || ""
  );
  const [contentMarkdown, setContentMarkdown] = React.useState(
    initialData?.contentMarkdown || ""
  );
  const [featured, setFeatured] = React.useState(initialData?.featured || false);
  const [status, setStatus] = React.useState<BlogPostStatus>(
    initialData?.status || "DRAFT"
  );

  // Editor UI State
  const [activeTab, setActiveTab] = React.useState<"write" | "preview">("write");
  const [loadingAction, setLoadingAction] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Live Metrics
  const readingTime = calculateReadingTime(contentMarkdown);
  const wordCount = contentMarkdown.trim() ? contentMarkdown.trim().split(/\s+/).length : 0;

  // Auto-slug generation on title change if not manually edited
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  // Insert markdown snippet at cursor
  const insertMarkdown = (before: string, after: string = "", defaultText: string = "") => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = contentMarkdown.substring(start, end) || defaultText;
    const replacement = `${before}${selected}${after}`;
    const newContent =
      contentMarkdown.substring(0, start) +
      replacement +
      contentMarkdown.substring(end);

    setContentMarkdown(newContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 10);
  };

  // Permissions helpers
  const canPublish = userPermissions.includes("blog:publish");
  const canSubmit = userPermissions.includes("blog:submit");
  const canArchive = userPermissions.includes("blog:delete");

  // Handler: Save Draft / Update Post
  const handleSave = async () => {
    try {
      setLoadingAction("save");
      setFeedback(null);

      const parsedTags = tagsString
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (!title.trim()) {
        throw new Error("Article title is required.");
      }
      if (!contentMarkdown.trim()) {
        throw new Error("Article content cannot be empty.");
      }

      if (mode === "create") {
        const result = await createDraftAction({
          title,
          slug,
          excerpt,
          category,
          tags: parsedTags,
          contentMarkdown,
          coverImageUrl: coverImageUrl || undefined,
          featured,
        });

        setFeedback({
          type: "success",
          message: "Draft created successfully!",
        });

        router.push(`/admin/blog/${result.postId}/edit`);
        router.refresh();
      } else {
        await updatePostAction({
          id: initialData!.id,
          title,
          slug,
          excerpt,
          category,
          tags: parsedTags,
          contentMarkdown,
          coverImageUrl: coverImageUrl || undefined,
          featured,
          changeNote: "Updated via admin console",
        });

        setFeedback({
          type: "success",
          message: "Article saved successfully!",
        });
        router.refresh();
      }
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save article.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  // Handler: Submit for Review
  const handleSubmitReview = async () => {
    if (!initialData?.id) return;
    try {
      setLoadingAction("review");
      setFeedback(null);
      await submitForReviewAction(initialData.id);
      setStatus("IN_REVIEW");
      setFeedback({
        type: "success",
        message: "Article submitted for editorial review!",
      });
      router.refresh();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to submit for review.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  // Handler: Publish
  const handlePublish = async () => {
    if (!initialData?.id) return;
    try {
      setLoadingAction("publish");
      setFeedback(null);
      await publishPostAction(initialData.id);
      setStatus("PUBLISHED");
      setFeedback({
        type: "success",
        message: "Article published live to acmbitm.campsy.app/blog!",
      });
      router.refresh();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to publish article.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  // Handler: Unpublish
  const handleUnpublish = async () => {
    if (!initialData?.id) return;
    try {
      setLoadingAction("unpublish");
      setFeedback(null);
      await unpublishPostAction(initialData.id);
      setStatus("DRAFT");
      setFeedback({
        type: "success",
        message: "Article reverted to Draft status.",
      });
      router.refresh();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to unpublish article.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  // Handler: Archive
  const handleArchive = async () => {
    if (!initialData?.id) return;
    if (!confirm("Are you sure you want to archive this article? It will be hidden from public view.")) return;
    try {
      setLoadingAction("archive");
      setFeedback(null);
      await archivePostAction(initialData.id);
      setStatus("ARCHIVED");
      setFeedback({
        type: "success",
        message: "Article archived.",
      });
      router.refresh();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to archive article.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-300"
              : "bg-red-950/40 border-red-800/80 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-zinc-500 hover:text-white px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-mono uppercase px-2.5 py-1 rounded-md border font-semibold ${
              status === "PUBLISHED"
                ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-400"
                : status === "IN_REVIEW"
                ? "bg-amber-950/40 border-amber-800/80 text-amber-400"
                : status === "ARCHIVED"
                ? "bg-zinc-900 border-zinc-800 text-zinc-500"
                : "bg-sky-950/40 border-sky-800/80 text-sky-400"
            }`}
          >
            {status}
          </span>
          <div className="text-xs font-mono text-zinc-400">
            Author: <span className="text-white font-semibold">{userName}</span> ({userRoleName})
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === "edit" && initialData?.id && (
            <button
              type="button"
              onClick={() => router.push(`/admin/blog/${initialData.id}/preview`)}
              className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Full Preview</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={loadingAction !== null}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-3.5 w-3.5 text-zinc-300" />
            <span>{loadingAction === "save" ? "Saving..." : "Save Draft"}</span>
          </button>

          {status === "DRAFT" && canSubmit && mode === "edit" && (
            <button
              type="button"
              onClick={handleSubmitReview}
              disabled={loadingAction !== null}
              className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{loadingAction === "review" ? "Submitting..." : "Submit for Review"}</span>
            </button>
          )}

          {canPublish && mode === "edit" && status !== "PUBLISHED" && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={loadingAction !== null}
              className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white text-xs font-medium transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{loadingAction === "publish" ? "Publishing..." : "Publish Live"}</span>
            </button>
          )}

          {canPublish && mode === "edit" && status === "PUBLISHED" && (
            <button
              type="button"
              onClick={handleUnpublish}
              disabled={loadingAction !== null}
              className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg border border-amber-800/60 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 text-xs font-mono transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>Revert to Draft</span>
            </button>
          )}

          {canArchive && mode === "edit" && status !== "ARCHIVED" && (
            <button
              type="button"
              onClick={handleArchive}
              disabled={loadingAction !== null}
              className="inline-flex items-center gap-1.5 py-2 px-2.5 rounded-lg border border-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 text-xs font-mono transition-colors disabled:opacity-50 cursor-pointer"
              title="Archive article"
            >
              <Archive className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Form Left (2 cols), Metadata Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Article Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Profiling Cache Invalidation in Distributed Systems"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#E31B23] focus:outline-none text-white text-base sm:text-lg font-semibold placeholder:text-zinc-600 transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Abstract / Excerpt (Card & SEO Summary) *
            </label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A concise technical overview of the core problem, engineering methodology, and key insights."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#E31B23] focus:outline-none text-white text-xs sm:text-sm placeholder:text-zinc-600 transition-colors leading-relaxed"
            />
          </div>

          {/* Markdown Content Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              {/* Write / Preview Tab Switcher */}
              <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === "write"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Write Markdown</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingTime} min read
                </span>
                <span>·</span>
                <span>{wordCount} words</span>
              </div>
            </div>

            {/* Markdown Toolbar (only in write mode) */}
            {activeTab === "write" && (
              <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-zinc-400">
                <button
                  type="button"
                  onClick={() => insertMarkdown("## ", "\n", "Heading 2")}
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  title="Heading 2"
                >
                  <Heading2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("### ", "\n", "Heading 3")}
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  title="Heading 3"
                >
                  <Heading3 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("**", "**", "bold text")}
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  title="Bold"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("*", "*", "italic text")}
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  title="Italic"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("`", "`", "inline code")}
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  title="Inline Code"
                >
                  <Code className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertMarkdown("```cpp\n// C++ Implementation\n", "\n```\n", "int main() {\n  return 0;\n}")
                  }
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded text-[11px] font-mono transition-colors"
                  title="Code Block"
                >
                  {"{ }"}
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("> ", "\n", "Blockquote text")}
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  title="Quote"
                >
                  <Quote className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("- ", "\n", "List item")}
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  title="Bullet List"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertMarkdown("\n| Metric | Baseline | Optimized |\n| --- | --- | --- |\n| Latency | 45ms | 8ms |\n\n")
                  }
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  title="Insert Table"
                >
                  <Table className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("[", "](https://example.com)", "link title")}
                  className="p-1.5 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  title="Insert Link"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Editor Body */}
            {activeTab === "write" ? (
              <textarea
                ref={textareaRef}
                rows={22}
                value={contentMarkdown}
                onChange={(e) => setContentMarkdown(e.target.value)}
                placeholder="Write article content using standard GitHub Flavored Markdown..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-[#E31B23] focus:outline-none text-zinc-100 font-mono text-xs sm:text-sm leading-relaxed placeholder:text-zinc-600 transition-colors resize-y"
              />
            ) : (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-6 min-h-[400px]">
                {contentMarkdown.trim() ? (
                  <MarkdownRenderer content={contentMarkdown} />
                ) : (
                  <div className="text-zinc-600 font-mono text-xs italic py-12 text-center">
                    Nothing to preview yet. Switch back to Write mode to draft your article.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Metadata & Taxonomies */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
            <h3 className="font-mono text-xs text-white uppercase tracking-wider font-semibold border-b border-zinc-800 pb-2">
              Publication Settings
            </h3>

            {/* Slug */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-zinc-400 uppercase">
                URL Slug *
              </label>
              <div className="flex items-center">
                <span className="px-2 py-2 rounded-l-lg bg-zinc-900 border border-r-0 border-zinc-800 font-mono text-xs text-zinc-500">
                  /blog/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setSlugManuallyEdited(true);
                  }}
                  className="w-full px-3 py-2 rounded-r-lg bg-zinc-950 border border-zinc-800 focus:border-[#E31B23] focus:outline-none text-white text-xs font-mono"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-zinc-400 uppercase">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-[#E31B23] focus:outline-none text-white text-xs font-mono"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-zinc-400 uppercase">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="c++, algorithms, systems, bit-mesra"
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-[#E31B23] focus:outline-none text-white text-xs font-mono"
              />
            </div>

            {/* Cover Image URL */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-zinc-400 uppercase">
                Cover Image URL (Optional)
              </label>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-[#E31B23] focus:outline-none text-white text-xs font-mono"
              />
            </div>

            {/* Featured Switch */}
            {userPermissions.includes("blog:manage_featured") && (
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Featured Article</div>
                  <div className="text-[10px] text-zinc-400">Pinned to top of blog index and homepage</div>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-[#E31B23] focus:ring-0 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Author Role Snapshot Box */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-2 text-xs">
            <div className="font-mono text-[11px] text-zinc-300 font-semibold uppercase flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Chapter Attribution Snapshot
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              When published, this article will be permanently stamped with:
            </p>
            <div className="rounded bg-zinc-950 border border-zinc-800 p-2 font-mono text-[11px] text-zinc-200">
              <span className="font-semibold">{userName}</span>
              <br />
              <span className="text-zinc-400">{userRoleName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
