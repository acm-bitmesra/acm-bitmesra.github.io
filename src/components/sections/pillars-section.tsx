import Link from "next/link";
import { corePillars } from "@/data/pillars";
import { ArrowRight, Code2, Laptop, Cpu, Users } from "lucide-react";

export function PillarsSection() {
  const pillarIcons = [Code2, Laptop, Cpu, Users];

  return (
    <section className="border-b border-border bg-background py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
              Focus areas
            </h2>
            <p className="mt-2 max-w-[65ch] text-sm leading-6 text-muted-foreground sm:text-base">
              Core computing domains actively practiced and mentored inside the chapter.
            </p>
          </div>
          <Link
            href="/activities"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            All activities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-2 grid gap-x-10 md:grid-cols-2">
          {corePillars.map((pillar, index) => {
            const Icon = pillarIcons[index % pillarIcons.length];
            return (
              <Link
                key={pillar.number}
                href={pillar.href}
                className="group border-b border-border py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:py-7"
              >
                <div className="flex items-start gap-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  <span className="min-w-0">
                    <span className="flex items-center justify-between gap-4">
                      <span className="text-base font-semibold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                        {pillar.title}
                      </span>
                      <span className="text-sm text-muted-foreground">→</span>
                    </span>
                    <span className="mt-2 block max-w-[65ch] text-sm leading-6 text-muted-foreground">
                      {pillar.description}
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
