import Link from "next/link";
import { corePillars } from "@/data/pillars";
import { ArrowRight, Code2, Laptop, Cpu, Users } from "lucide-react";

export function PillarsSection() {
  const pillarIcons = [Code2, Laptop, Cpu, Users];

  return (
    <section className="py-14 sm:py-16 md:py-20 border-b border-border/80 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Focus Areas
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Core computing domains actively practiced and mentored inside the chapter.
            </p>
          </div>
          <Link
            href="/activities"
            className="text-xs sm:text-sm font-mono font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group shrink-0"
          >
            <span>All activities</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Clean 2-column list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {corePillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx % pillarIcons.length];
            return (
              <div
                key={pillar.number}
                className="rounded-xl border border-border/70 bg-card p-5 sm:p-6 space-y-3.5 transition-colors hover:border-foreground/30 hover:bg-secondary/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                    <h3 className="text-base font-semibold text-foreground">
                      {pillar.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    #{pillar.number}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pillar.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono bg-secondary text-secondary-foreground"
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
