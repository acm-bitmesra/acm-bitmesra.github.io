import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Chapter",
  description:
    "Learn about the ACM Student Chapter at BIT Mesra — our mission, foundational beliefs, history, and institutional relationship.",
};

const beliefs = [
  { title: "Learn by building", description: "Theory without implementation remains abstract. True comprehension emerges when software is built, tested, and shipped." },
  { title: "Compete to improve", description: "Healthy algorithmic competition pushes problem-solving limits, teaches time discipline, and exposes blind spots." },
  { title: "Teach what you learn", description: "Knowledge solidifies when explained to others. Every senior is expected to mentor incoming junior engineers." },
  { title: "Share knowledge publicly", description: "Open source, open notes, transparent contest editorials, and collaborative learning enrich the entire campus." },
  { title: "Think beyond the syllabus", description: "University curricula set baselines; curiosity, self-directed exploration, and passion define great engineers." },
];

const historyMilestones = [
  {
    era: "Charter Inception",
    period: "Early Establishment",
    description:
      "Formed by computing students and faculty advisors in the Department of Computer Science & Engineering at BIT Mesra, inaugurating an institutional student charter affiliated with ACM Global.",
  },
  {
    era: "Contest Culture & CQM",
    period: "Algorithmic Growth",
    description:
      "Initiated regular campus coding contests and CodeZilla, creating a consistent pipeline of students training for ICPC regional contests and algorithmic competitions.",
  },
  {
    era: "Hackathon Expansion",
    period: "Hack-A-Bit Flagship",
    description:
      "Launched Hack-A-Bit, expanding the chapter's reach across Eastern India with multi-day, multi-track student hackathons featuring real-world product prototyping.",
  },
  {
    era: "Modern Developer Community",
    period: "Present Day",
    description:
      "Integrated developer ecosystem combining competitive programming, full-stack systems engineering, research exposure, and open-source contributions.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Document Header */}
        <div className="space-y-3 border-b border-border/60 pb-6">
          <div className="text-xs font-mono text-muted-foreground">
            Overview / About the Chapter
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            About ACM BIT Mesra
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            The official Association for Computing Machinery student chapter at Birla Institute of Technology, Mesra, chartered to advance computing education, contest culture, and systems engineering.
          </p>
        </div>

        {/* Mission & Vision Callout (Notion Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border/80 bg-card p-5 space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Our Mission</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Empower engineering students to build production-grade software, compete globally in algorithmic contests, contribute to open source, and develop strong engineering leadership.
            </p>
          </div>
          <div className="rounded-lg border border-border/80 bg-card p-5 space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Our Vision</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              To be the premier student computing hub in the region, bridging the gap between computational theory and real-world technology challenges, fostering alumni who ship impactful systems globally.
            </p>
          </div>
        </div>

        {/* Section: Foundational Principles */}
        <section className="space-y-4">
          <div className="border-b border-border/60 pb-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {beliefs.map((belief, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border/70 bg-card p-4 space-y-1 transition-colors hover:bg-secondary/20"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <h3 className="text-xs font-semibold text-foreground">
                    {belief.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-5.5">
                  {belief.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Chapter History Timeline */}
        <section className="space-y-4">
          <div className="border-b border-border/60 pb-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Chapter History & Milestones
            </h2>
          </div>

          <div className="divide-y divide-border/60 rounded-lg border border-border/80 bg-card overflow-hidden">
            {historyMilestones.map((milestone, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 p-4 hover:bg-secondary/20 transition-colors"
              >
                <div className="sm:w-44 shrink-0 space-y-0.5">
                  <span className="font-mono text-xs font-semibold text-foreground block">
                    {milestone.era}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground block">
                    {milestone.period}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Institutional Relationships */}
        <section className="rounded-lg border border-border/80 bg-secondary/30 p-6 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>INSTITUTIONAL AFFILIATION</span>
            </div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Institutional Relationship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-muted-foreground leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                <span>Birla Institute of Technology, Mesra</span>
                <a href={siteConfig.institution.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </a>
              </h3>
              <p>
                Founded in 1955 by philanthropist and industrialist B.M. Birla, BIT Mesra is a premier technical university in Ranchi, Jharkhand. The ACM Student Chapter operates under the guidance of the Department of Computer Science & Engineering.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                <span>ACM Global Student Charter</span>
                <a href={siteConfig.parentOrganization.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </a>
              </h3>
              <p>
                The Association for Computing Machinery is the world&apos;s largest educational computing society. Our chapter is chartered by ACM Global, connecting our student members to international resources, conferences, and ethics.
              </p>
            </div>
          </div>
        </section>

        {/* Join Link */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-mono">Ready to get involved?</span>
          <Link
            href="/join"
            className="inline-flex h-8 items-center justify-center rounded-md bg-neutral-900 px-3 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 transition-colors"
          >
            Induction Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
