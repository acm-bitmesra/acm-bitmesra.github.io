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

export default function ActivitiesPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <span>Engineering Initiatives · Chapter Programs</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Chapter Activities & SIGs
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Our initiatives are structured around five specialized wings designed to take students from fundamental computational knowledge to competitive excellence and production system design.
          </p>
        </div>

        {/* 5 Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activitiesData.map((act) => {
            const Icon = iconMap[act.slug] || Code2;
            return (
              <div
                key={act.slug}
                className="rounded-2xl border border-border bg-card p-8 flex flex-col justify-between transition-all hover:border-border/80 hover:shadow-md group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {act.categoryName}
                    </span>
                    <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    <Link href={`/activities/${act.slug}`}>{act.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {act.tagline}
                  </p>

                  {/* Focus areas preview */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <span className="font-mono text-[11px] text-muted-foreground uppercase font-bold block">
                      Core Disciplines:
                    </span>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {act.focusAreas.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <span className="text-primary font-bold">›</span>
                          <span>{f.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between">
                  <Link
                    href={`/activities/${act.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-primary transition-colors"
                  >
                    <span>Explore {act.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Pathways */}
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-foreground">
              Interested in contributing to chapter projects?
            </h3>
            <p className="text-sm text-muted-foreground">
              We welcome code contributors, problem setters, technical writers, and workshop leads.
            </p>
          </div>
          <Link
            href="/join"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors shrink-0"
          >
            Join Chapter Activities
          </Link>
        </div>
      </div>
    </div>
  );
}
