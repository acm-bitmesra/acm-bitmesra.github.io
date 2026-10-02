import { chapterStats } from "@/data/stats";

export function StatsStrip() {
  return (
    <section className="border-b border-border bg-card/40 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {chapterStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col space-y-1.5 border-l border-border/80 pl-4 transition-all hover:border-primary"
            >
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {stat.label}
              </span>
              <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
