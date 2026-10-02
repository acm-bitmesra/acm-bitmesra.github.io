import Link from "next/link";
import { corePillars } from "@/data/pillars";
import { ArrowRight, Code2, Cpu, Laptop, Users } from "lucide-react";

export function PillarsSection() {
  const pillarIcons = [Code2, Laptop, Cpu, Users];

  return (
    <section className="py-20 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
              <span>01 / Core Pillars</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              What happens inside ACM?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              From algorithms and ICPC preparation to production engineering and hackathon sprints, our four pillars define student activity.
            </p>
          </div>
          <Link
            href="/activities"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary hover:underline"
          >
            View all chapter activities <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {corePillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx % pillarIcons.length];
            return (
              <div
                key={pillar.number}
                className="group relative rounded-xl border border-border bg-card p-6 sm:p-8 transition-all hover:border-border/80 hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                      PILLAR {pillar.number}
                    </span>
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Skills / Topic tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {pillar.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded border border-border/80 bg-secondary/50 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border/60">
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground group-hover:text-primary transition-colors"
                  >
                    <span>{pillar.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
