import Link from "next/link";
import { studentResources } from "@/data/resources";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";

export function ResourcesPreviewSection() {
  return (
    <section className="py-20 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
              <span>05 / Curated Knowledge</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Developer & Algorithmic Resources
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Curated foundations, competitive programming guides, and systems learning materials recommended by ACM mentors.
            </p>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary hover:underline"
          >
            Browse all resources <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentResources.slice(0, 4).map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between transition-all hover:border-border/80 hover:shadow-sm group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold text-primary uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {resource.category}
                  </span>
                  <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {resource.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>{resource.level || "Curated"}</span>
                <span className="flex items-center gap-1 group-hover:text-foreground transition-colors">
                  Open <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
