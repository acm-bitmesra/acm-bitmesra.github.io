"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createChapterResourceAction,
  updateChapterResourceAction,
  deleteChapterResourceAction,
} from "@/db/mutations/resources";
import {
  Plus,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  AlertCircle,
  Tag,
} from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: "ROADMAP" | "GUIDE" | "ACADEMIC_PYQ" | "COMPETITIVE_PROGRAMMING" | "SYSTEMS" | "CAREER" | "OPEN_SOURCE";
  type: "LINK" | "DOCUMENT" | "GITHUB_REPO" | "PDF";
  url: string;
  difficulty: string;
  featured: boolean;
  tags: string[];
  createdAt: Date;
}

interface ResourcesManagerProps {
  initialResources: ResourceItem[];
}

export function ResourcesManager({ initialResources }: ResourcesManagerProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Form State
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [category, setCategory] = React.useState<ResourceItem["category"]>("ROADMAP");
  const [type, setType] = React.useState<ResourceItem["type"]>("LINK");
  const [url, setUrl] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("ALL_LEVELS");
  const [description, setDescription] = React.useState("");
  const [featured, setFeatured] = React.useState(false);
  const [tagsInput, setTagsInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const filteredResources = initialResources.filter((r) => {
    if (selectedCategory === "ALL") return true;
    return r.category === selectedCategory;
  });

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 50)
      );
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description || !url) {
      setStatusMessage({ type: "error", text: "Please fill in all mandatory fields." });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await createChapterResourceAction({
        title,
        slug,
        description,
        category,
        type,
        url,
        difficulty,
        featured,
        tags,
      });

      setStatusMessage({ type: "success", text: "Resource cataloged successfully." });
      setTitle("");
      setSlug("");
      setDescription("");
      setUrl("");
      setTagsInput("");
      setShowAddForm(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create resource.";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (resourceId: string, currentFeatured: boolean) => {
    try {
      await updateChapterResourceAction(resourceId, { featured: !currentFeatured });
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating featured status.");
    }
  };

  const handleDelete = async (resourceId: string, resourceTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${resourceTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteChapterResourceAction(resourceId);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting resource.");
    }
  };

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 font-mono text-xs ${
            statusMessage.type === "success"
              ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
              : "bg-red-950/40 border-red-800 text-red-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Filter and Create Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          {[
            { id: "ALL", label: `All (${initialResources.length})` },
            { id: "COMPETITIVE_PROGRAMMING", label: "CP & DSA" },
            { id: "SYSTEMS", label: "Systems & Architecture" },
            { id: "ROADMAP", label: "Roadmaps" },
            { id: "ACADEMIC_PYQ", label: "Academics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                selectedCategory === tab.id
                  ? "bg-zinc-800 text-white font-semibold shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white text-xs font-mono font-medium transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{showAddForm ? "Close Form" : "Add Resource"}</span>
        </button>
      </div>

      {/* Add Resource Form Modal */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-5"
        >
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-semibold text-white">Add Knowledge Resource</h3>
            <p className="text-xs text-zinc-400">
              Curate authoritative learning tracks, cheat sheets, interview roadmaps, and tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Resource Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. AlgoForge Interactive DSA, CS61B Data Structures"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Resource URL *</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceItem["category"])}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              >
                <option value="ROADMAP">Curated Roadmap</option>
                <option value="COMPETITIVE_PROGRAMMING">Competitive Programming & DSA</option>
                <option value="SYSTEMS">Core Systems & Architecture</option>
                <option value="ACADEMIC_PYQ">Academics & PYQs</option>
                <option value="GUIDE">Technical Guide / Tutorial</option>
                <option value="CAREER">Interview & Career Prep</option>
                <option value="OPEN_SOURCE">Open Source Tool</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              >
                <option value="ALL_LEVELS">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Resource Format / Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ResourceItem["type"])}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              >
                <option value="LINK">Interactive Website / Link</option>
                <option value="GITHUB_REPO">GitHub Repository</option>
                <option value="DOCUMENT">Document / Sheet</option>
                <option value="PDF">PDF Handbook</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What students learn from this resource and why it is recommended..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Blind 75, Dynamic Programming, C++, Rust"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="resFeatured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-0"
            />
            <label htmlFor="resFeatured" className="text-xs font-mono text-zinc-300">
              Pin as Featured on Student Resources Portal
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white text-xs font-mono font-medium disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? "Adding..." : "Add to Knowledge Hub"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Resources Table / Cards */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="divide-y divide-zinc-800/60">
          {filteredResources.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-zinc-500">
              No resources found in this category.
            </div>
          ) : (
            filteredResources.map((res) => (
              <div
                key={res.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-900/30 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border bg-zinc-900 border-zinc-800 text-zinc-400">
                      {res.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      {res.difficulty}
                    </span>
                    {res.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-yellow-950/40 border border-yellow-800/60 text-yellow-400">
                        <Star className="h-3 w-3 fill-current" />
                        PINNED
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white">
                    {res.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 max-w-3xl">
                    {res.description}
                  </p>

                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {res.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800/60"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleToggleFeatured(res.id, res.featured)}
                    title={res.featured ? "Unpin from featured" : "Pin as featured"}
                    className={`p-2 rounded border text-xs font-mono transition-colors ${
                      res.featured
                        ? "bg-yellow-950/40 border-yellow-800 text-yellow-400 hover:bg-yellow-900/40"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${res.featured ? "fill-current" : ""}`} />
                  </button>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(res.id, res.title)}
                    className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
