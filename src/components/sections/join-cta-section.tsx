import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function JoinCtaSection() {
  return (
    <section className="py-24 border-b border-border bg-gradient-to-b from-card/30 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1 text-xs font-mono text-muted-foreground backdrop-blur-sm mx-auto">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>ACM BIT Mesra · Membership & Inductions</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
            Your next problem could be the one that changes everything.
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
            Whether you are preparing for international collegiate contests, architecting campus software systems, or wanting to master core computer science, ACM BIT Mesra is where builders congregate.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/join"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 gap-2"
          >
            <span>Join ACM Chapter</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/join#process"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-secondary/80 px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            See How Induction Works
          </Link>
        </div>

        <p className="text-xs font-mono text-muted-foreground pt-4">
          Open to all engineering undergraduates and postgraduates at BIT Mesra.
        </p>
      </div>
    </section>
  );
}
