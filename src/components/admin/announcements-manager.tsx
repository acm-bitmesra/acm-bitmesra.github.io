"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createAnnouncementAction,
  toggleAnnouncementActiveAction,
  deleteAnnouncementAction,
} from "@/db/mutations/announcements";
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from "lucide-react";

interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  linkUrl?: string | null;
  linkText?: string | null;
  type: "INFO" | "WARNING" | "ALERT" | "SUCCESS";
  isActive: boolean;
  priority: number;
  createdAt: Date;
}

interface AnnouncementsManagerProps {
  initialAnnouncements: AnnouncementItem[];
}

export function AnnouncementsManager({ initialAnnouncements }: AnnouncementsManagerProps) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Form State
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");
  const [linkText, setLinkText] = React.useState("");
  const [type, setType] = React.useState<AnnouncementItem["type"]>("INFO");
  const [priority, setPriority] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      setStatusMessage({ type: "error", text: "Title and message are mandatory." });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      await createAnnouncementAction({
        title,
        message,
        linkUrl: linkUrl || undefined,
        linkText: linkText || undefined,
        type,
        priority,
        isActive: true,
      });

      setStatusMessage({ type: "success", text: "Announcement broadcasted successfully." });
      setTitle("");
      setMessage("");
      setLinkUrl("");
      setLinkText("");
      setShowAddForm(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create announcement.";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await toggleAnnouncementActiveAction(id, !current);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error toggling status.");
    }
  };

  const handleDelete = async (id: string, annTitle: string) => {
    if (!confirm(`Delete announcement "${annTitle}"?`)) return;
    try {
      await deleteAnnouncementAction(id);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting announcement.");
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

      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-zinc-400">
          Showing {initialAnnouncements.length} broadcast banners
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white text-xs font-mono font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{showAddForm ? "Close Form" : "New Broadcast Banner"}</span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4"
        >
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-semibold text-white">Create Announcement Banner</h3>
            <p className="text-xs text-zinc-400">
              Broadcast critical chapter notices, urgent deadlines, and contest announcements across the site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Banner Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CQM Round 42 Registration Open"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Banner Urgency / Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AnnouncementItem["type"])}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              >
                <option value="INFO">Informational (Blue)</option>
                <option value="SUCCESS">Achievement / Launch (Green)</option>
                <option value="WARNING">Important Notice (Amber)</option>
                <option value="ALERT">Urgent Deadline (Red)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Action Link URL (optional)</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/events/hacktoberfest-2026 or https://..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Action Button Text (optional)</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. Register Now, Learn More"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Display Priority (higher = first)</label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Message Content *</label>
            <textarea
              required
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Concise text displayed directly in the broadcast banner..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white text-xs font-mono font-medium disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? "Broadcasting..." : "Broadcast Banner"}
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

      {/* Announcements List */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="divide-y divide-zinc-800/60">
          {initialAnnouncements.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-zinc-500">
              No broadcast banners created yet.
            </div>
          ) : (
            initialAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-900/30 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        ann.isActive
                          ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500"
                      }`}
                    >
                      {ann.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        ann.type === "ALERT"
                          ? "bg-red-950/40 border-red-800/60 text-red-400"
                          : ann.type === "WARNING"
                          ? "bg-amber-950/40 border-amber-800/60 text-amber-400"
                          : ann.type === "SUCCESS"
                          ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400"
                          : "bg-blue-950/40 border-blue-800/60 text-blue-400"
                      }`}
                    >
                      {ann.type}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white">{ann.title}</h3>
                  <p className="text-xs text-zinc-400 max-w-2xl">{ann.message}</p>

                  {ann.linkUrl && (
                    <div className="pt-1">
                      <a
                        href={ann.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-red-400 hover:underline"
                      >
                        <span>{ann.linkText || ann.linkUrl}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleToggle(ann.id, ann.isActive)}
                    className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {ann.isActive ? (
                      <>
                        <ToggleRight className="h-4 w-4 text-emerald-400" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-4 w-4 text-zinc-500" />
                        <span>Activate</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(ann.id, ann.title)}
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
