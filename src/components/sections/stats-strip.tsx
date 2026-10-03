import { chapterStats } from "@/data/stats";

export function StatsStrip() {
  return (
    <section className="border-b border-border/80 bg-secondary/15 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {chapterStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col space-y-1.5 lg:border-l lg:first:border-l-0 lg:pl-6 lg:first:pl-0 border-border/60"
            >
              <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                {stat.label}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
