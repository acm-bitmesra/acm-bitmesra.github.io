import type { Metadata } from "next";
import Link from "next/link";
import { chapterHistory } from "@/data/history";
import { History as HistoryIcon, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Chapter History & Timeline",
  description:
    "Explore the chronological journey, milestones, and algorithmic traditions of the ACM Student Chapter at BIT Mesra.",
};

export default function HistoryPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <HistoryIcon className="h-4 w-4" />
            <span>Institutional Memory · Evolution</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Chapter History & Timeline
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            The narrative of how a student-led computing collective at Birla Institute of Technology, Mesra grew into a premier hub for competitive programmers, hackathon builders, and systems engineers.
          </p>
        </div>

        {/* Timeline Sequence */}
        <div className="relative border-l-2 border-border/80 ml-4 sm:ml-8 space-y-12 pb-8">
          {chapterHistory.map((item, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-10 space-y-4 group">
              {/* Dot marker */}
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-primary group-hover:scale-125 transition-transform" />

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm hover:border-border/80 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {item.year}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.era}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground/80 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Documented Record
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {item.title}
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {item.summary}
                </p>

                <div className="space-y-2 pt-2 border-t border-border/60">
                  <span className="font-mono text-xs text-muted-foreground uppercase font-semibold">
                    Key Milestones:
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary font-bold">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <Link
            href="/about"
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            ← About the Chapter
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary hover:underline"
          >
            <span>Explore Event Archives</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
