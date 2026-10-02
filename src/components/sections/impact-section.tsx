export function ImpactSection() {
  return (
    <section className="py-14 border-b border-border/80 bg-secondary/15">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border/80 bg-card p-6 sm:p-8 space-y-4">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Chapter Culture
          </div>
          <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed max-w-3xl">
            From algorithmic problem sets to production systems: ACM BIT Mesra connects students who enjoy solving hard problems, competing globally, contributing to open source, and teaching one another.
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono text-muted-foreground pt-2 border-t border-border/60">
            <span className="text-foreground">Learn</span>
            <span>→</span>
            <span className="text-foreground">Practice</span>
            <span>→</span>
            <span className="text-foreground">Compete</span>
            <span>→</span>
            <span className="text-foreground">Build</span>
            <span>→</span>
            <span className="text-foreground">Mentor</span>
          </div>
        </div>
      </div>
    </section>
  );
}
