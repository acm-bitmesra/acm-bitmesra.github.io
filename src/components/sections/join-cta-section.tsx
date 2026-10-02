import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function JoinCtaSection() {
  return (
    <section className="py-16 border-b border-border/80 bg-secondary/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border/80 bg-card p-6 sm:p-10 space-y-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Membership & Inductions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Interested in joining the chapter?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We conduct inductions across Competitive Programming, Systems & Web Development, Design, and Operations. Open to all students at BIT Mesra.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/join"
              className="inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white transition-colors gap-2 shadow-sm"
            >
              Induction Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-9 items-center justify-center rounded-md border border-border/80 bg-secondary/50 px-4 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
