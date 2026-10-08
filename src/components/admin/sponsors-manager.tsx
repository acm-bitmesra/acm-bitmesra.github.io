"use client";

import * as React from "react";
import { chapterSponsors, SponsorTier } from "@/db/schema";
import { createSponsorAction, deleteSponsorAction } from "@/db/mutations/sponsors";
import { Award } from "lucide-react";
import { Plus, Trash2, ExternalLink, Sparkles } from "@animateicons/react/lucide";

type Sponsor = typeof chapterSponsors.$inferSelect;

interface SponsorsManagerProps {
  initialSponsors: Sponsor[];
}

export function SponsorsManager({ initialSponsors }: SponsorsManagerProps) {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>(initialSponsors);
  const [showForm, setShowForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [tier, setTier] = React.useState<SponsorTier>("COMMUNITY");
  const [logoUrl, setLogoUrl] = React.useState("/icon.svg");
  const [websiteUrl, setWebsiteUrl] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [year, setYear] = React.useState("2026");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    setError(null);

    try {
      const res = await createSponsorAction({
        name,
        tier,
        logoUrl: logoUrl || "/icon.svg",
        websiteUrl,
        description,
        year,
      });

      if (res.success) {
        setSponsors([
          {
            id: res.id,
            name,
            tier,
            logoUrl: logoUrl || "/icon.svg",
            websiteUrl: websiteUrl || null,
            description: description || null,
            year,
            active: true,
            displayOrder: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          ...sponsors,
        ]);
        setName("");
        setDescription("");
        setWebsiteUrl("");
        setShowForm(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add sponsor.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;

    try {
      await deleteSponsorAction(id);
      setSponsors(sponsors.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete sponsor.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-400" />
            <span>Sponsors & Partners</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage institutional patrons, hackathon title sponsors, and developer tooling partners.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white hover:bg-zinc-800 hover:border-zinc-700 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 text-emerald-400" />
          <span>{showForm ? "Cancel" : "Add Sponsor"}</span>
        </button>
      </div>

      {/* Creation Drawer */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-4 max-w-xl"
        >
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>New Sponsor / Partner</span>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Organization / Sponsor Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. JetBrains, GitHub, Google Cloud"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Partnership Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as SponsorTier)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600"
                >
                  <option value="TITLE">Title Sponsor</option>
                  <option value="PLATINUM">Platinum Partner</option>
                  <option value="GOLD">Gold Partner</option>
                  <option value="SILVER">Silver Partner</option>
                  <option value="COMMUNITY">Community / Tooling</option>
                  <option value="PARTNER">Institutional Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2026"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Logo URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="/icon.svg or https://..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://company.com"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Description / Engagement Focus</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="How the partner empowers BIT Mesra student developers..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
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
              {loading ? "Saving..." : "Save Partner"}
            </button>
          </div>
        </form>
      )}

      {/* Grid of Sponsor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsors.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-3 hover:border-zinc-700 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-amber-900/60 bg-amber-950/40 text-amber-400 font-semibold">
                  {s.tier}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{s.year}</span>
              </div>

              <h3 className="text-base font-semibold text-white">{s.name}</h3>

              {s.description && (
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              {s.websiteUrl ? (
                <a
                  href={s.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1"
                >
                  <span>Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-[11px] font-mono text-zinc-600">No URL</span>
              )}

              <button
                onClick={() => handleDelete(s.id)}
                title="Delete sponsor"
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
