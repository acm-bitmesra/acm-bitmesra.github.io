"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { events } from "@/data/events";
import { getPublishedBlogPosts } from "@/data/blog";
import { studentResources } from "@/data/resources";
import { activitiesData } from "@/data/activities";
import { getPublicTeamMembers } from "@/data/team";
import { siteConfig } from "@/config/site";
import { Search, X, Calendar, FileText, BookOpen, Layers, User, ArrowRight } from "lucide-react";

interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: "PAGE" | "EVENT" | "BLOG" | "RESOURCE" | "ACTIVITY" | "TEAM";
  href: string;
  meta?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Aggregate search index
  const allItems: SearchResultItem[] = React.useMemo(() => {
    const list: SearchResultItem[] = [];

    // Core static pages
    list.push(
      { id: "page-about", title: "About ACM BIT Mesra", description: "Mission, vision, beliefs, and institutional history.", category: "PAGE", href: "/about" },
      { id: "page-activities", title: "Chapter Activities & SIGs", description: "Competitive programming, hackathons, workshops, and open source.", category: "PAGE", href: "/activities" },
      { id: "page-events", title: "Events & Contests", description: "Hack-A-Bit, CodeZilla, CQM, and regional workshops.", category: "PAGE", href: "/events" },
      { id: "page-team", title: "Executive Team & Advisory", description: "Faculty sponsor, leadership, and domain leads.", category: "PAGE", href: "/team" },
      { id: "page-resources", title: "Curated Student Resources", description: "DSA guides, systems textbooks, and development roadmaps.", category: "PAGE", href: "/resources" },
      { id: "page-blog", title: "Technical Editorial & Blog", description: "Engineering articles, contest editorials, and systems notes.", category: "PAGE", href: "/blog" },
      { id: "page-cp", title: "Competitive Programming Hub", description: "Algorithmic progression roadmap, platforms, and contest strategy.", category: "PAGE", href: "/competitive-programming" },
      { id: "page-icpc", title: "ICPC Regional Track", description: "Collegiate contest pipeline and team formation guide.", category: "PAGE", href: "/icpc" },
      { id: "page-alumni", title: "Alumni Archive", description: "Historical leadership rosters and alumni engagement avenues.", category: "PAGE", href: "/alumni" },
      { id: "page-history", title: "History Timeline", description: "Chronological evolution of the ACM student charter at BIT Mesra.", category: "PAGE", href: "/history" },
      { id: "page-gallery", title: "Visual Gallery", description: "Campus moments, hackathon stages, and contest halls.", category: "PAGE", href: "/gallery" },
      { id: "page-sponsors", title: "Sponsors & Partners", description: "Institutional patrons, past partners, and sponsorship tiers.", category: "PAGE", href: "/sponsors" },
      { id: "page-join", title: "Join ACM Chapter", description: "Recruitment criteria, selection flow, and induction FAQs.", category: "PAGE", href: "/join" },
      { id: "page-contact", title: "Contact & Campus Location", description: "Official email, Department of CSE, and social channels.", category: "PAGE", href: "/contact" }
    );

    // Events
    events.forEach((e) => {
      list.push({
        id: `event-${e.slug}`,
        title: e.title,
        description: e.shortDescription,
        category: "EVENT",
        href: `/events/${e.slug}`,
        meta: e.category,
      });
    });

    // Activities
    activitiesData.forEach((a) => {
      list.push({
        id: `act-${a.slug}`,
        title: a.title,
        description: a.tagline,
        category: "ACTIVITY",
        href: `/activities/${a.slug}`,
        meta: a.categoryName,
      });
    });

    // Blog posts (published only)
    getPublishedBlogPosts().forEach((b) => {
      list.push({
        id: `blog-${b.slug}`,
        title: b.title,
        description: b.description,
        category: "BLOG",
        href: `/blog/${b.slug}`,
        meta: b.category,
      });
    });

    // Resources
    studentResources.forEach((r, idx) => {
      list.push({
        id: `res-${idx}`,
        title: r.title,
        description: r.description,
        category: "RESOURCE",
        href: r.url,
        meta: r.category,
      });
    });

    // Verified Team
    getPublicTeamMembers().forEach((m) => {
      list.push({
        id: `team-${m.slug}`,
        title: `${m.name} (${m.role})`,
        description: m.bio,
        category: "TEAM",
        href: `/team/${m.slug}`,
        meta: m.role,
      });
    });

    return list;
  }, []);

  // Filtered results
  const results = React.useMemo(() => {
    if (!query.trim()) {
      return allItems.slice(0, 8); // show popular pages initially
    }
    const q = query.toLowerCase().trim();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.meta?.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [allItems, query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? results.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      const target = results[selectedIndex];
      if (target.href.startsWith("http")) {
        window.open(target.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(target.href);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search events, articles, resources, team, activities..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded hover:bg-secondary text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.href.startsWith("http")) {
                      window.open(item.href, "_blank", "noopener,noreferrer");
                    } else {
                      router.push(item.href);
                    }
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.category === "EVENT" && <Calendar className="h-4 w-4 text-primary" />}
                    {item.category === "BLOG" && <FileText className="h-4 w-4 text-primary" />}
                    {item.category === "RESOURCE" && <BookOpen className="h-4 w-4 text-primary" />}
                    {item.category === "ACTIVITY" && <Layers className="h-4 w-4 text-primary" />}
                    {item.category === "TEAM" && <User className="h-4 w-4 text-primary" />}
                    {item.category === "PAGE" && <ArrowRight className="h-4 w-4 text-primary" />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {item.title}
                      </span>
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded border border-border/80 text-muted-foreground bg-background/50 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2">
              <p className="font-mono text-sm text-foreground">
                No matching results found for &quot;{query}&quot;
              </p>
              <p className="text-xs text-muted-foreground">
                Try searching for &quot;Hack-A-Bit&quot;, &quot;CodeZilla&quot;, &quot;DSA&quot;, or &quot;Induction&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="border-t border-border px-4 py-2.5 bg-secondary/30 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-primary font-bold">ACM BIT Mesra</span>
        </div>
      </div>
    </div>
  );
}
