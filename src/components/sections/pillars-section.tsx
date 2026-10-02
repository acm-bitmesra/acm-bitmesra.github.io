import Link from "next/link";
import { corePillars } from "@/data/pillars";
import { ArrowRight, Code2, Laptop, Cpu, Users } from "lucide-react";

export function PillarsSection() {
  const pillarIcons = [Code2, Laptop, Cpu, Users];

  return (
    <section className="py-16 border-b border-border/80 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Focus Areas
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Core computing domains actively practiced and mentored inside the chapter.
            </p>
          </div>
          <Link
            href="/activities"
            className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 group"
          >
            All activities <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Notion-style clean rows / 2-column list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {corePillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx % pillarIcons.length];
            return (
              <div
                key={pillar.number}
                className="rounded-lg border border-border/70 bg-card p-5 space-y-3 transition-colors hover:border-border hover:bg-secondary/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">
                      {pillar.title}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    #{pillar.number}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pillar.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-mono bg-secondary text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
