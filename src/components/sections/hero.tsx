import Link from "next/link";
import { ArrowRight, Code2, Trophy, Terminal, BookOpen } from "lucide-react";
import { AcmLogo } from "@/components/ui/icons";

export function HeroSection() {
  return (
    <section className="relative border-b border-border bg-background pt-16 pb-16 md:pt-24 md:pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 md:space-y-10">
          {/* Header & Meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm font-mono text-muted-foreground">
            <span className="flex items-center gap-2 font-bold text-foreground">
              <AcmLogo className="h-5 w-5" />
              ACM BIT Mesra
            </span>
            <span>/</span>
            <span>Est. 2016</span>
            <span>/</span>
            <span className="text-muted-foreground">Ranchi, Jharkhand</span>
          </div>

          {/* Main Title & Value Proposition */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.06]">
              Build. Compete. Ship.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              A student-led computing society at Birla Institute of Technology, Mesra. We practice algorithms, build software systems, compete in ICPC, and organize Hack-A-Bit.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/events"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white gap-2 shadow-xs"
            >
              Upcoming Events
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resources"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary gap-2"
            >
              Browse Resources
            </Link>
            <Link
              href="/join"
              className="inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Induction Guide →
            </Link>
          </div>

          {/* Directory Cards / Quick Anchors */}
          <div className="pt-8 border-t border-border/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <Link
                href="/competitive-programming"
                className="group flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4 text-left transition-all hover:border-foreground/30 hover:bg-secondary/40"
              >
                <Code2 className="h-5 w-5 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                <div className="space-y-1">
                  <div className="text-sm sm:text-base font-semibold text-foreground group-hover:underline">
                    Competitive Prog
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                    CQM, Codeforces, ICPC
                  </div>
                </div>
              </Link>

              <Link
                href="/events/hack-a-bit"
                className="group flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4 text-left transition-all hover:border-foreground/30 hover:bg-secondary/40"
              >
                <Trophy className="h-5 w-5 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                <div className="space-y-1">
                  <div className="text-sm sm:text-base font-semibold text-foreground group-hover:underline">
                    Hack-A-Bit
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                    Annual flagship hackathon
                  </div>
                </div>
              </Link>

              <Link
                href="/activities/open-source"
                className="group flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4 text-left transition-all hover:border-foreground/30 hover:bg-secondary/40"
              >
                <Terminal className="h-5 w-5 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                <div className="space-y-1">
                  <div className="text-sm sm:text-base font-semibold text-foreground group-hover:underline">
                    Open Source
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                    Student tooling & repos
                  </div>
                </div>
              </Link>

              <Link
                href="/resources"
                className="group flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4 text-left transition-all hover:border-foreground/30 hover:bg-secondary/40"
              >
                <BookOpen className="h-5 w-5 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                <div className="space-y-1">
                  <div className="text-sm sm:text-base font-semibold text-foreground group-hover:underline">
                    Learning Hub
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                    Curated roadmaps & sheets
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
