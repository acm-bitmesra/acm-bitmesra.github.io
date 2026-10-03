import Link from "next/link";
import { studentResources } from "@/data/resources";
import { ArrowRight, ArrowUpRight, BookMarked } from "lucide-react";

export function ResourcesPreviewSection() {
  return (
    <section className="py-14 sm:py-16 md:py-20 border-b border-border/80 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Curated Roadmaps
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Foundational problem sets, contest guides, and systems engineering references.
            </p>
          </div>
          <Link
            href="/resources"
            className="text-xs sm:text-sm font-mono font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group shrink-0"
          >
            <span>All resources</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Clean Bookmarks List */}
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden divide-y divide-border/60 shadow-2xs">
          {studentResources.slice(0, 4).map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <BookMarked className="h-4 w-4 mt-0.5 sm:mt-0 text-muted-foreground shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <div className="text-sm sm:text-base font-semibold text-foreground group-hover:underline truncate">
                    {resource.title}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1 max-w-xl">
                    {resource.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/50">
                  {resource.category}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/70 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
