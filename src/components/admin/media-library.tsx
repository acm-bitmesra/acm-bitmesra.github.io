"use client";

import * as React from "react";
import { Image as ImageIcon, Copy, Check, ExternalLink, Search, Filter } from "lucide-react";

export interface MediaItem {
  id: string;
  name?: string;
  filename?: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  category: string;
}

interface MediaLibraryProps {
  initialMedia: MediaItem[];
}

export function MediaLibrary({ initialMedia }: MediaLibraryProps) {
  const [mediaList] = React.useState<MediaItem[]>(initialMedia);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  const categories = ["ALL", "BRANDING", "EVENTS", "TEAM", "GENERAL"];

  const filteredMedia = mediaList.filter((item) => {
    const displayName = item.name || item.filename || "";
    const matchesSearch =
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || item.category.toUpperCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search media by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <Filter className="h-3.5 w-3.5 text-zinc-500 mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                selectedCategory === cat
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredMedia.length === 0 ? (
        <div className="p-12 text-center text-xs text-zinc-500 border border-zinc-800 rounded-xl bg-zinc-950/40">
          No media items match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden group hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div className="aspect-video bg-zinc-900/80 relative flex items-center justify-center overflow-hidden border-b border-zinc-800/80">
                {item.url.endsWith(".svg") ||
                item.url.endsWith(".png") ||
                item.url.endsWith(".jpg") ||
                item.url.endsWith(".webp") ? (
                  <img
                    src={item.url}
                    alt={item.name || item.filename || "Media asset"}
                    className="max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-zinc-600" />
                )}
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-zinc-400 border border-zinc-800">
                  {item.category}
                </span>
              </div>

              <div className="p-3.5 space-y-2 text-xs">
                <div className="font-semibold text-white truncate" title={item.name || item.filename}>
                  {item.name || item.filename}
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>{formatBytes(item.sizeBytes)}</span>
                  <span>{item.mimeType}</span>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(item.url)}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-500 hover:text-zinc-300"
                    title="Open asset in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
