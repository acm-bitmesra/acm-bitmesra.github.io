import Link from "next/link";
import { ArrowRight } from "@animateicons/react/lucide";

export function JoinCtaSection() {
  return (
    <section className="py-14 sm:py-16 md:py-20 border-b border-border/80 bg-secondary/15">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 space-y-6 shadow-xs">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs sm:text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Membership & Inductions
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-[1.15]">
              Interested in joining the chapter?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              We conduct annual inductions across Competitive Programming, Systems & Web Development, Design, and Chapter Operations. Open to all students at BIT Mesra.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/join"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors gap-2 shadow-xs whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>Induction Details</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border/80 bg-card px-5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
