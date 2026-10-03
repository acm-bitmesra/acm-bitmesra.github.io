export function ImpactSection() {
  return (
    <section className="py-14 sm:py-16 md:py-20 border-b border-border/80 bg-secondary/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 space-y-4 shadow-xs">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Chapter Culture
          </div>
          <p className="text-base sm:text-lg md:text-xl text-foreground font-medium leading-relaxed max-w-3xl">
            From algorithmic problem sets to production systems: ACM BIT Mesra connects students who enjoy solving hard problems, competing globally, contributing to open source, and teaching one another.
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono text-muted-foreground pt-3 border-t border-border/60">
            <span className="text-foreground font-medium">Learn</span>
            <span>→</span>
            <span className="text-foreground font-medium">Practice</span>
            <span>→</span>
            <span className="text-foreground font-medium">Compete</span>
            <span>→</span>
            <span className="text-foreground font-medium">Build</span>
            <span>→</span>
            <span className="text-foreground font-medium">Mentor</span>
          </div>
        </div>
      </div>
    </section>
  );
}
