import type { Metadata } from "next";
import Link from "next/link";
import { activitiesData } from "@/data/activities";
import { ArrowRight, Code2, Cpu, Laptop, Users, Presentation } from "lucide-react";

export const metadata: Metadata = {
  title: "Activities & Focus Areas",
  description:
    "Explore ACM BIT Mesra focus areas: competitive programming, hackathons, technical workshops, open source, and technical talks.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "competitive-programming": Code2,
  hackathons: Laptop,
  workshops: Cpu,
  "open-source": Users,
  "technical-talks": Presentation,
};

import { Callout } from "@/components/ui/callout";

export default function ActivitiesPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-12">
        {/* Document Header */}
        <div className="space-y-3 border-b border-border pb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Activities & Focus Areas
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            Five core wings structured to support students from fundamental algorithmic problem solving to production systems engineering, open-source work, and technical hackathons.
          </p>
        </div>

        {/* 5 Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activitiesData.map((act) => {
            const Icon = iconMap[act.slug] || Code2;
            return (
              <div
                key={act.slug}
                className="rounded-lg border border-border bg-card p-6 flex flex-col justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      {act.categoryName}
                    </span>
                    <Icon className="h-4 w-4 text-neutral-400 group-hover:text-foreground transition-colors" />
                  </div>

                  <h2 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                    <Link href={`/activities/${act.slug}`}>{act.title}</Link>
                  </h2>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {act.tagline}
                  </p>

                  {/* Focus areas preview */}
                  <div className="pt-2">
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {act.focusAreas.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <span className="text-neutral-400">›</span>
                          <span>{f.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                  <Link
                    href={`/activities/${act.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
                  >
                    <span>View track</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <Callout>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Want to lead or contribute to chapter tracks?
              </p>
              <p className="text-xs text-muted-foreground">
                We accept problem setters, open-source maintainers, and workshop leads during annual inductions.
              </p>
            </div>
            <Link
              href="/join"
              className="inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 text-xs font-medium text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shrink-0"
            >
              Join the Chapter
            </Link>
          </div>
        </Callout>
      </div>
    </div>
  );
}
