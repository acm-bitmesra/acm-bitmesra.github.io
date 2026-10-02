import Link from "next/link";
import { studentResources } from "@/data/resources";
import { ArrowRight, ArrowUpRight, BookMarked } from "lucide-react";

export function ResourcesPreviewSection() {
  return (
    <section className="py-16 border-b border-border/80 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Curated Roadmaps
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Foundational problem sets, contest guides, and systems references.
            </p>
          </div>
          <Link
            href="/resources"
            className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 group"
          >
            All resources <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Notion-style Bookmarks List */}
        <div className="rounded-lg border border-border/80 bg-card overflow-hidden divide-y divide-border/60">
          {studentResources.slice(0, 4).map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 transition-colors hover:bg-secondary/40"
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <BookMarked className="h-4 w-4 mt-0.5 sm:mt-0 text-muted-foreground shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <div className="text-sm font-semibold text-foreground group-hover:underline truncate">
                    {resource.title}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
                    {resource.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-border/50">
                  {resource.category}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
