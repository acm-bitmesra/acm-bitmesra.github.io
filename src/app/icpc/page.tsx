import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, Users, ShieldCheck, ArrowRight, Award, Compass, Timer } from "lucide-react";

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

export default function IcpcPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-mono text-primary backdrop-blur-sm">
            <Trophy className="h-3.5 w-3.5" />
            <span>Collegiate Contest Track · Asia-West</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-foreground leading-tight">
            ICPC Track at BIT Mesra
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            The International Collegiate Programming Contest is the oldest, largest, and most prestigious algorithmic programming competition in the world. ACM BIT Mesra guides students through team formation, team dynamics, and mock contest simulations.
          </p>
        </section>

        {/* Section: What is ICPC */}
        <section className="rounded-2xl border border-border bg-card p-8 sm:p-10 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            What is the ICPC?
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              The International Collegiate Programming Contest traces its roots to 1970. In the collegiate format, a team of three students shares a single computer for five grueling hours to solve 10 to 14 complex real-world algorithmic problems.
            </p>
            <p>
              Unlike individual coding rounds, ICPC requires exceptional collaboration: while one member writes code at the keyboard, teammates model math equations on paper, trace edge cases, or debug printed code traces.
            </p>
          </div>
        </section>

        {/* 4 Phases of ICPC */}
        <section className="space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Journey</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              The ICPC Contest Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {icpcPhases.map((phase) => (
              <div
                key={phase.phase}
                className="rounded-xl border border-border bg-card p-6 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {phase.phase}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    {phase.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Formation Strategy */}
        <section className="rounded-2xl border border-border bg-secondary/30 p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-primary font-bold">
              <Users className="h-4 w-4" />
              <span>TEAM DYNAMICS</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              How to Build an ICPC Team at BIT Mesra
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-primary" /> Complementary Roles
              </h3>
              <p>
                Ensure at least one member is fast at implementation (STL & basic data structures), one strong in discrete mathematics and combinatorics, and one specializing in graphs and advanced DP.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-1.5">
                <Timer className="h-4 w-4 text-primary" /> Single-Keyboard Discipline
              </h3>
              <p>
                Never keep the keyboard idle if someone has a typed solution ready. Time management is often more decisive than individual raw algorithmic rating.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" /> Stress Testing
              </h3>
              <p>
                Write generator scripts to compare your optimal solution against a slow brute-force implementation when you receive Wrong Answer on unknown test cases.
              </p>
            </div>
          </div>
        </section>

        {/* Institutional Record Footnote (Section 67) */}
        <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>BIT Mesra teams regularly qualify and compete at ICPC Asia-West regional onsite sites.</span>
          </span>
          <Link href="/competitive-programming" className="text-primary font-semibold hover:underline">
            CP Roadmap →
          </Link>
        </div>
      </div>
    </div>
  );
}
