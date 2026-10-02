import Link from "next/link";
import { ArrowRight, Code2, Trophy, Terminal, BookOpen } from "lucide-react";
import { AcmLogo } from "@/components/ui/icons";

export function HeroSection() {
  return (
    <section className="relative border-b border-border bg-background pt-16 pb-16 md:pt-24 md:pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Notion-style Document Header & Meta */}
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <AcmLogo className="h-4 w-4" />
              ACM BIT Mesra
            </span>
            <span>/</span>
            <span>Est. 2016</span>
            <span>/</span>
            <span className="text-muted-foreground/80">Ranchi, Jharkhand</span>
          </div>

          {/* Main Title & Value Proposition */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
              Build. Compete. Ship.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              A student-led computing society at Birla Institute of Technology, Mesra. We practice algorithms, build software systems, compete in ICPC, and organize Hack-A-Bit.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/events"
              className="inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 text-xs font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white gap-2 shadow-sm"
            >
              Upcoming Events
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/resources"
              className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-secondary/60 px-4 text-xs font-medium text-foreground transition-colors hover:bg-secondary gap-2"
            >
              Browse Resources
            </Link>
            <Link
              href="/join"
              className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Induction Guide →
            </Link>
          </div>

          {/* Notion-style Directory Cards / Quick Anchors */}
          <div className="pt-6 border-t border-border/70">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link
                href="/competitive-programming"
                className="group flex items-start gap-3 rounded-md border border-border/60 bg-secondary/30 p-3 text-left transition-all hover:border-border hover:bg-secondary/70"
              >
                <Code2 className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-foreground group-hover:underline">
                    Competitive Prog
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">
                    CQM, Codeforces, ICPC
                  </div>
                </div>
              </Link>

              <Link
                href="/events/hack-a-bit"
                className="group flex items-start gap-3 rounded-md border border-border/60 bg-secondary/30 p-3 text-left transition-all hover:border-border hover:bg-secondary/70"
              >
                <Trophy className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-foreground group-hover:underline">
                    Hack-A-Bit
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">
                    Annual flagship hackathon
                  </div>
                </div>
              </Link>

              <Link
                href="/activities/open-source"
                className="group flex items-start gap-3 rounded-md border border-border/60 bg-secondary/30 p-3 text-left transition-all hover:border-border hover:bg-secondary/70"
              >
                <Terminal className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-foreground group-hover:underline">
                    Open Source
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">
                    Student tooling & repos
                  </div>
                </div>
              </Link>

              <Link
                href="/resources"
                className="group flex items-start gap-3 rounded-md border border-border/60 bg-secondary/30 p-3 text-left transition-all hover:border-border hover:bg-secondary/70"
              >
                <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-foreground group-hover:underline">
                    Learning Hub
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">
                    DSA sheets & roadmaps
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
