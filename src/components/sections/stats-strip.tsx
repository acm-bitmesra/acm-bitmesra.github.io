import { chapterStats } from "@/data/stats";

export function StatsStrip() {
  return (
    <section className="border-b border-border/80 bg-secondary/20 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {chapterStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col space-y-1.5 rounded-xl border border-border/60 bg-card/70 p-4 sm:p-5 md:border-0 md:bg-transparent md:p-0 md:pl-6 md:first:pl-0 md:border-l md:first:border-l-0 md:border-border/60"
            >
              <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base font-semibold text-foreground">
                {stat.label}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
