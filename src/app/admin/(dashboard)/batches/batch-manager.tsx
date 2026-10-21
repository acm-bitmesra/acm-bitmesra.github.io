"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface Batch {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  program: string;
  isActive: boolean;
  displayOrder: number;
}

export function BatchManager({ initialBatches }: { initialBatches: Batch[] }) {
  const router = useRouter();
  const [batches, setBatches] = React.useState<Batch[]>(initialBatches);
  const [id, setId] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [endYear, setEndYear] = React.useState(new Date().getFullYear() + 4);
  const [displayOrder] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          label,
          startYear: Number(endYear) - 4,
          endYear: Number(endYear),
          displayOrder: Number(displayOrder),
          isActive: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add batch");
      }

      setId("");
      setLabel("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving batch");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (batchId: string) => {
    if (!confirm(`Are you sure you want to delete batch ${batchId}?`)) return;

    setDeletingId(batchId);
    try {
      const res = await fetch(`/api/admin/batches?id=${encodeURIComponent(batchId)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBatches(batches.filter((b) => b.id !== batchId));
        router.refresh();
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Add New Batch Form */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-bold text-foreground">Add Academic Cohort / Batch</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Define university graduating batches available for student profiles.
        </p>

        <form onSubmit={handleAddBatch} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Batch ID</label>
            <input
              type="text"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. 2024-2028"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Display Label</label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Batch of 2028 (2024–2028)"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Graduation Year</label>
            <input
              type="number"
              required
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              <span>Add Batch</span>
            </button>
          </div>
        </form>
      </div>

      {/* Batches Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-sm text-foreground">Configured Academic Batches</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Batch ID</th>
                <th className="px-4 py-3">Display Name</th>
                <th className="px-4 py-3">Graduation Year</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono font-semibold text-foreground">{batch.id}</td>
                  <td className="px-4 py-3 text-foreground">{batch.label}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{batch.endYear}</td>
                  <td className="px-4 py-3">
                    {batch.isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Archived</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(batch.id)}
                      disabled={deletingId === batch.id}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-red-600 disabled:opacity-50"
                      title="Delete batch"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No academic batches configured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
