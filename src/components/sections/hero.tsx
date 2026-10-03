import Link from "next/link";
import { ArrowRight, Code2, Trophy, Terminal, BookOpen } from "lucide-react";
import { AcmLogo } from "@/components/ui/icons";

export function HeroSection() {
  return (
    <section className="relative border-b border-border bg-background pt-12 pb-12 sm:pt-16 sm:pb-16 md:pt-20 md:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
              Build. Compete. Ship.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[65ch]">
              A student-led computing society at Birla Institute of Technology, Mesra. We practice algorithms, build software systems, compete in ICPC, and organize Hack-A-Bit.
            </p>
          </div>

          {/* Primary Actions with Clear Hierarchy */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            {/* Primary Action */}
            <Link
              href="/events"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Upcoming Events
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Secondary Action */}
            <Link
              href="/resources"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border/80 bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Browse Resources
            </Link>

            {/* Tertiary Action (Text link style) */}
            <Link
              href="/join"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4 whitespace-nowrap group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            >
              <span>Induction Guide</span>
              <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          {/* Directory Cards / Category Cards */}
          <div className="pt-8 border-t border-border/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/competitive-programming"
                className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 sm:p-5 text-left transition-all hover:border-foreground/30 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-full min-h-[110px]"
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  <div className="text-sm sm:text-base font-semibold text-foreground group-hover:underline">
                    Competitive Prog
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                  Weekly CQM contests, Codeforces practice, and ICPC regional preparation.
                </p>
              </Link>

              <Link
                href="/events/hack-a-bit"
                className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 sm:p-5 text-left transition-all hover:border-foreground/30 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-full min-h-[110px]"
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  <div className="text-sm sm:text-base font-semibold text-foreground group-hover:underline">
                    Hack-A-Bit
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                  Eastern India&apos;s premier annual student-led flagship hackathon.
                </p>
              </Link>

              <Link
                href="/activities/open-source"
                className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 sm:p-5 text-left transition-all hover:border-foreground/30 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-full min-h-[110px]"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  <div className="text-sm sm:text-base font-semibold text-foreground group-hover:underline">
                    Open Source
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                  Collaborative developer tooling, student repositories, and libraries.
                </p>
              </Link>

              <Link
                href="/resources"
                className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 sm:p-5 text-left transition-all hover:border-foreground/30 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-full min-h-[110px]"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  <div className="text-sm sm:text-base font-semibold text-foreground group-hover:underline">
                    Learning Hub
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                  Curated DSA roadmaps, practice sheets, and interview prep guides.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
