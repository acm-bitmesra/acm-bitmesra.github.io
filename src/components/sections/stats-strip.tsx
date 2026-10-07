import { chapterStats } from "@/data/stats";

export function StatsStrip() {
  return (
    <section className="border-b border-border bg-secondary/10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 py-9 sm:px-6 sm:py-10 lg:grid-cols-4 lg:px-8">
        {chapterStats.map((stat, index) => (
          <div
            key={index}
            className={[
              "py-2",
              index % 2 === 1 ? "border-l border-border pl-5 sm:pl-7" : "",
              index > 0 ? "lg:border-l lg:border-border lg:pl-7" : "",
            ].join(" ")}
          >
            <div className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              {stat.label}
            </div>
            <p className="mt-1.5 max-w-[28ch] text-xs leading-5 text-muted-foreground sm:text-sm">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
