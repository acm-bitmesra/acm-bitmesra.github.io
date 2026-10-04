"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createChapterEventAction,
  updateChapterEventAction,
  deleteChapterEventAction,
} from "@/db/mutations/events";
import {
  Plus,
  Trash2,
  ExternalLink,
  MapPin,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/date";

interface EventItem {
  id: string;
  slug: string;
  title: string;
  tagline?: string | null;
  description: string;
  category: "HACKATHON" | "CONTEST" | "WORKSHOP" | "TECH_TALK" | "FLAGSHIP";
  status: "UPCOMING" | "ONGOING" | "PAST" | "ARCHIVED";
  startDate: Date;
  endDate?: Date | null;
  location: string;
  isOnline: boolean;
  registrationUrl?: string | null;
  bannerUrl?: string | null;
  featured: boolean;
  prizes?: string | null;
  tags: string[];
}

interface EventsManagerProps {
  initialEvents: EventItem[];
}

export function EventsManager({ initialEvents }: EventsManagerProps) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<"ALL" | "UPCOMING" | "PAST">("ALL");
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Form State
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [category, setCategory] = React.useState<EventItem["category"]>("HACKATHON");
  const [status, setStatus] = React.useState<EventItem["status"]>("UPCOMING");
  const [startDate, setStartDate] = React.useState("");
  const [location, setLocation] = React.useState("BIT Mesra Campus, Ranchi");
  const [description, setDescription] = React.useState("");
  const [registrationUrl, setRegistrationUrl] = React.useState("");
  const [prizes, setPrizes] = React.useState("");
  const [featured, setFeatured] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const filteredEvents = initialEvents.filter((e) => {
    if (filter === "UPCOMING") return e.status === "UPCOMING" || e.status === "ONGOING";
    if (filter === "PAST") return e.status === "PAST" || e.status === "ARCHIVED";
    return true;
  });

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description || !startDate) {
      setStatusMessage({ type: "error", text: "Please fill in all mandatory fields." });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      await createChapterEventAction({
        title,
        slug,
        category,
        status,
        startDate,
        location,
        description,
        registrationUrl: registrationUrl || undefined,
        prizes: prizes || undefined,
        featured,
        isOnline: location.toLowerCase().includes("online"),
      });

      setStatusMessage({ type: "success", text: "Event published successfully." });
      setTitle("");
      setSlug("");
      setDescription("");
      setRegistrationUrl("");
      setPrizes("");
      setShowAddForm(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create event.";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (eventId: string, currentFeatured: boolean) => {
    try {
      await updateChapterEventAction(eventId, { featured: !currentFeatured });
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating featured status.");
    }
  };

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete event "${eventTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteChapterEventAction(eventId);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting event.");
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

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          {(["ALL", "UPCOMING", "PAST"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                filter === tab
                  ? "bg-zinc-800 text-white font-semibold shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab === "ALL" ? `All (${initialEvents.length})` : tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white text-xs font-mono font-medium transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{showAddForm ? "Close Form" : "Create New Event"}</span>
        </button>
      </div>

      {/* Add Event Form Modal/Panel */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-5"
        >
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-semibold text-white">Create Chapter Event</h3>
            <p className="text-xs text-zinc-400">
              Publish upcoming hackathons, contests (CQM), workshops, and technical talks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Hacktoberfest 2026, CodeZilla IX"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. hacktoberfest-2026"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventItem["category"])}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              >
                <option value="HACKATHON">Hackathon (Hack-A-Bit)</option>
                <option value="CONTEST">Contest (CodeZilla / CQM)</option>
                <option value="WORKSHOP">Workshop / Hands-on</option>
                <option value="TECH_TALK">Technical Talk / Speaker</option>
                <option value="FLAGSHIP">Flagship Chapter Event</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventItem["status"])}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="PAST">Past Archive</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Start Date *</label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Location *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. BIT Mesra Campus, Online / Codeforces"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Registration Link (optional)</label>
              <input
                type="url"
                value={registrationUrl}
                onChange={(e) => setRegistrationUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Prizes / Perks (optional)</label>
              <input
                type="text"
                value={prizes}
                onChange={(e) => setPrizes(e.target.value)}
                placeholder="e.g. ₹50,000 Prize Pool + Swag"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed schedule, problem statements, and requirements..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-0"
            />
            <label htmlFor="featured" className="text-xs font-mono text-zinc-300">
              Highlight as Featured Event on Homepage & Events Portal
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#E31B23] hover:bg-red-600 text-white text-xs font-mono font-medium disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? "Publishing..." : "Publish Event"}
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

      {/* Events Table / Cards */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="divide-y divide-zinc-800/60">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-zinc-500">
              No events found in this category.
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-900/30 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        event.status === "UPCOMING"
                          ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400"
                          : event.status === "ONGOING"
                          ? "bg-amber-950/40 border-amber-800/60 text-amber-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500"
                      }`}
                    >
                      {event.status}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 uppercase">
                      {event.category}
                    </span>
                    {event.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-yellow-950/40 border border-yellow-800/60 text-yellow-400">
                        <Star className="h-3 w-3 fill-current" />
                        FEATURED
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{formatDate(event.startDate.toISOString())}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{event.location}</span>
                    </div>
                    {event.prizes && (
                      <span className="text-amber-400/90">{event.prizes}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleToggleFeatured(event.id, event.featured)}
                    title={event.featured ? "Remove from featured" : "Pin as featured"}
                    className={`p-2 rounded border text-xs font-mono transition-colors ${
                      event.featured
                        ? "bg-yellow-950/40 border-yellow-800 text-yellow-400 hover:bg-yellow-900/40"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${event.featured ? "fill-current" : ""}`} />
                  </button>

                  <a
                    href={`/events/${event.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(event.id, event.title)}
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
