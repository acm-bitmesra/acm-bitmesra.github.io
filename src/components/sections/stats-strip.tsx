import { chapterStats } from "@/data/stats";

export function StatsStrip() {
  return (
    <section className="border-b border-border/80 bg-secondary/20 py-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-border/60">
          {chapterStats.map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col space-y-1 ${idx > 0 ? "pt-4 md:pt-0 md:pl-6" : ""}`}
            >
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </div>
              <div className="text-xs font-medium text-foreground">
                {stat.label}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
