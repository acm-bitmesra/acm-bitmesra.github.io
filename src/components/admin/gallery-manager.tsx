"use client";

import * as React from "react";
import { chapterGallery } from "@/db/schema";
import { createGalleryItemAction, deleteGalleryItemAction } from "@/db/mutations/gallery";
import { Image as ImageIcon, Plus, Trash2, Sparkles } from "lucide-react";

type GalleryItem = typeof chapterGallery.$inferSelect;

interface GalleryManagerProps {
  initialItems: GalleryItem[];
}

export function GalleryManager({ initialItems }: GalleryManagerProps) {
  const [items, setItems] = React.useState<GalleryItem[]>(initialItems);
  const [showForm, setShowForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [title, setTitle] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [category, setCategory] = React.useState("EVENTS");
  const [eventYear, setEventYear] = React.useState("2026");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    setLoading(true);
    setError(null);

    try {
      const res = await createGalleryItemAction({
        title,
        caption,
        imageUrl,
        category,
        eventYear,
      });

      if (res.success) {
        setItems([
          {
            id: res.id,
            title,
            caption,
            imageUrl,
            category,
            eventYear,
            displayOrder: 0,
            createdAt: new Date(),
          },
          ...items,
        ]);
        setTitle("");
        setCaption("");
        setImageUrl("");
        setShowForm(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add image to gallery.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      await deleteGalleryItemAction(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete item.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-indigo-400" />
            <span>Chapter Photo Gallery</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Curate photo albums from Hack-A-Bit, CodeZilla, Workshops, ICPC, and campus events.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white hover:bg-zinc-800 hover:border-zinc-700 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 text-emerald-400" />
          <span>{showForm ? "Cancel" : "Add Photo"}</span>
        </button>
      </div>

      {/* Creation Drawer / Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-4 max-w-xl"
        >
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>New Gallery Item</span>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hack-A-Bit Opening Ceremony"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Image URL / Path *</label>
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... or /gallery/photo.jpg"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Caption / Description</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                placeholder="Brief caption documenting the moment..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600"
                >
                  <option value="EVENTS">Events & Contests</option>
                  <option value="HACKATHONS">Hackathons</option>
                  <option value="WORKSHOPS">Workshops & SIGs</option>
                  <option value="ICPC">ICPC Team</option>
                  <option value="CAMPUS">Campus & Labs</option>
                  <option value="TALKS">Talks & Seminars</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Year</label>
                <input
                  type="text"
                  value={eventYear}
                  onChange={(e) => setEventYear(e.target.value)}
                  placeholder="2026"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-mono text-white font-semibold shadow disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : "Save Image"}
            </button>
          </div>
        </form>
      )}

      {/* Grid of Photo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors group"
          >
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {item.eventYear}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white leading-snug">
                {item.title}
              </h3>

              {item.caption && (
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              )}

              <div className="text-[10px] font-mono text-zinc-600 truncate">
                {item.imageUrl}
              </div>
            </div>

            <div className="px-4 py-2.5 bg-zinc-900/40 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500">
                Order: #{item.displayOrder}
              </span>
              <button
                onClick={() => handleDelete(item.id)}
                title="Delete photo"
                className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-zinc-800 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
