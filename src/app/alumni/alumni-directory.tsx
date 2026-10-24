"use client";

import * as React from "react";
import { verifiedAlumniList } from "@/data/alumni";
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  MapPin,
  GraduationCap,
  Globe,
  Sparkles,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export function AlumniDirectory() {
  const [query, setQuery] = React.useState("");
  const [selectedDomain, setSelectedDomain] = React.useState<string>("all");
  const [selectedBatch, setSelectedBatch] = React.useState<string>("all");

  const domains = React.useMemo(() => {
    const set = new Set<string>();
    verifiedAlumniList.forEach((a) => a.domain.forEach((d) => set.add(d)));
    return Array.from(set);
  }, []);

  const batches = React.useMemo(() => {
    const set = new Set<string>();
    verifiedAlumniList.forEach((a) => set.add(a.batch));
    return Array.from(set).sort().reverse();
  }, []);

  const filteredAlumni = React.useMemo(() => {
    return verifiedAlumniList.filter((a) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.currentCompany.toLowerCase().includes(q) ||
        a.currentRole.toLowerCase().includes(q) ||
        a.chapterRole.toLowerCase().includes(q) ||
        a.domain.some((d) => d.toLowerCase().includes(q));

      const matchesDomain =
        selectedDomain === "all" || a.domain.includes(selectedDomain);

      const matchesBatch =
        selectedBatch === "all" || a.batch === selectedBatch;

      return matchesQuery && matchesDomain && matchesBatch;
    });
  }, [query, selectedDomain, selectedBatch]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Distinguished Alumni Roster</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Alumni in Engineering & Research
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Former ACM BIT Mesra leaders, Hack-A-BIT organizers, and core contributors shaping engineering across global technology firms.
          </p>
        </div>

        <div className="font-mono text-xs text-muted-foreground shrink-0">
          Showing <span className="font-bold text-foreground">{filteredAlumni.length}</span> of {verifiedAlumniList.length} verified alumni
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search alumni by name, company (Google, Uber, CRED...), role, or tech domain..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Batch Selector */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          >
            <option value="all">All Batches</option>
            {batches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Domain Selector */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          >
            <option value="all">All Domains</option>
            {domains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alumni Cards Grid */}
      {filteredAlumni.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <GraduationCap className="mx-auto h-8 w-8 opacity-40 mb-2" />
          <p className="font-semibold text-sm text-foreground">No alumni found</p>
          <p className="text-xs text-muted-foreground mt-1">
            No alumni match your current search query. Try clearing filters or searching for another company or name.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAlumni.map((alumnus) => (
            <div
              key={alumnus.slug}
              className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm hover:border-primary/50 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Name, Verification, Batch */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-foreground">
                        {alumnus.name}
                      </h3>
                      {alumnus.isVerified && (
                        <span
                          title="Verified ACM BIT Mesra Alumni Record"
                          className="inline-flex items-center text-emerald-500"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-muted-foreground">
                      <span className="rounded bg-secondary px-2 py-0.5 text-secondary-foreground font-semibold">
                        {alumnus.batch}
                      </span>
                      <span>•</span>
                      <span className="text-primary font-medium">
                        {alumnus.chapterRole}
                      </span>
                    </div>
                  </div>

                  {/* Company Badge */}
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-semibold text-foreground shrink-0 font-mono">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span>{alumnus.currentCompany}</span>
                  </div>
                </div>

                {/* Current Role & Location */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    {alumnus.currentRole} @ {alumnus.currentCompany}
                  </p>
                  {alumnus.location && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{alumnus.location}</span>
                    </p>
                  )}
                </div>

                {/* Bio */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {alumnus.bio}
                </p>

                {/* Domain Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {alumnus.domain.map((d, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-secondary/60 border border-border/80 px-2 py-0.5 font-mono text-[10px] text-secondary-foreground"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social / Professional Links Footer */}
              <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                <span className="text-[11px] font-mono text-muted-foreground">
                  Alumni Connection
                </span>

                <div className="flex items-center gap-2">
                  {alumnus.linkedin && (
                    <a
                      href={alumnus.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                      title="LinkedIn Profile"
                    >
                      <LinkedinIcon className="h-3 w-3" />
                      <span>LinkedIn</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                    </a>
                  )}

                  {alumnus.github && (
                    <a
                      href={alumnus.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="GitHub Profile"
                    >
                      <GithubIcon className="h-3 w-3" />
                    </a>
                  )}

                  {alumnus.website && (
                    <a
                      href={alumnus.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="Personal Website"
                    >
                      <Globe className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
