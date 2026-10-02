import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, ShieldCheck, Award, Compass, Timer } from "lucide-react";

export const metadata: Metadata = {
  title: "ICPC Regional Track",
  description:
    "International Collegiate Programming Contest (ICPC) preparation, team formation guidelines, and contest training at ACM BIT Mesra.",
};

const icpcPhases = [
  {
    phase: "Phase 01",
    title: "Team Formation & Chemistry",
    desc: "Forming 3-member teams with complementary strengths across data structures, graph theory, geometry, and number theory.",
  },
  {
    phase: "Phase 02",
    title: "Regional Online Prelims",
    desc: "Competing in the official multi-site online preliminary contests hosted by Indian regional sites (e.g., Amritapuri, Kanpur, Gwalior).",
  },
  {
    phase: "Phase 03",
    title: "Onsite Regional Finals",
    desc: "5-hour onsite contest with 1 computer per team of 3, live balloon awards, and physical contest notebook templates.",
  },
  {
    phase: "Phase 04",
    title: "World Finals Qualification",
    desc: "Top regional champions represent their respective universities at the annual ICPC World Finals.",
  },
];

import { Callout } from "@/components/ui/callout";

export default function IcpcPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-12">
        {/* Document Header */}
        <div className="space-y-3 border-b border-border pb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            ICPC Regional Track
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            The International Collegiate Programming Contest is the premier algorithmic competition for universities globally. ACM BIT Mesra organizes team formation, mock simulations, and training for Asia-West regionals.
          </p>
        </div>

        {/* Overview Callout */}
        <Callout icon={<Trophy className="h-4 w-4 text-neutral-500" />}>
          <div className="space-y-1 text-sm text-foreground">
            <p className="font-medium">The ICPC Format</p>
            <p className="text-muted-foreground leading-relaxed">
              Teams of 3 students share a single workstation for 5 hours to solve 10–14 complex algorithmic problems. Success demands strict keyboard discipline, offline problem modeling on paper, and rapid debugging.
            </p>
          </div>
        </Callout>

        {/* 4 Phases of ICPC */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Contest Pipeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {icpcPhases.map((phase) => (
              <div
                key={phase.phase}
                className="rounded-lg border border-border bg-card p-5 space-y-2 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-muted-foreground">
                    {phase.phase}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {phase.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Formation Strategy */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Team Dynamics & Strategy
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-5 space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Compass className="h-4 w-4 text-neutral-500" />
                Complementary Roles
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Balance speed implementation (STL, syntax fluency) with deep math/combinatorics and graph/DP specializations.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5 space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Timer className="h-4 w-4 text-neutral-500" />
                Single Keyboard Discipline
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Never keep the keyboard idle if code is designed on paper. Time allocation decides onsite qualification.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5 space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-neutral-500" />
                Stress Testing
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Write input generators and brute-force scripts to locate silent corner cases before submitting solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Footnote */}
        <div className="rounded-lg border border-border bg-secondary/50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>BIT Mesra teams participate annually across Amritapuri, Kanpur, and Gwalior onsite regionals.</span>
          </span>
          <Link href="/competitive-programming" className="text-foreground font-medium hover:underline shrink-0">
            View CP Roadmap →
          </Link>
        </div>
      </div>
    </div>
  );
}
