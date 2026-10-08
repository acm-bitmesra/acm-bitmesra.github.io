import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CircleCheck as CheckCircle2, ExternalLink, ShieldCheck } from "@animateicons/react/lucide";

export const metadata: Metadata = {
  title: "About Chapter | ACM BIT Mesra",
  description:
    "Learn about the ACM Student Chapter at BIT Mesra — our mission, foundational beliefs, history, and institutional relationship.",
  openGraph: {
    title: "About Chapter | ACM BIT Mesra",
    description:
      "Learn about the ACM Student Chapter at BIT Mesra — our mission, foundational beliefs, history, and institutional relationship.",
  },
};

const beliefs = [
  {
    title: "Learn by building",
    description:
      "Theory without implementation remains abstract. True comprehension emerges when software is built, tested, and shipped.",
  },
  {
    title: "Compete to improve",
    description:
      "Healthy algorithmic competition pushes problem-solving limits, teaches time discipline, and exposes blind spots.",
  },
  {
    title: "Teach what you learn",
    description:
      "Knowledge solidifies when explained to others. Every senior is expected to mentor incoming junior engineers.",
  },
  {
    title: "Share knowledge publicly",
    description:
      "Open source, open notes, transparent contest editorials, and collaborative learning enrich the entire campus.",
  },
  {
    title: "Think beyond the syllabus",
    description:
      "University curricula set baselines; curiosity, self-directed exploration, and passion define great engineers.",
  },
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
    <div className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Document Header */}
        <div className="space-y-4 border-b border-border/70 pb-8">
          <div className="text-xs sm:text-sm font-mono text-muted-foreground">
            Overview / About the Chapter
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            About ACM BIT Mesra
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            The official Association for Computing Machinery student chapter at Birla Institute of Technology, Mesra, chartered to advance computing education, contest culture, and systems engineering.
          </p>
        </div>

        {/* Mission & Vision Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-7 space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">Our Mission</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Empower engineering students to build production-grade software, compete globally in algorithmic contests, contribute to open source, and develop strong engineering leadership.
            </p>
          </div>
          <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-7 space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">Our Vision</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              To be the premier student computing hub in the region, bridging the gap between computational theory and real-world technology challenges, fostering alumni who ship impactful systems globally.
            </p>
          </div>
        </div>

        {/* Section: Foundational Principles */}
        <section className="space-y-5">
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beliefs.map((belief, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/70 bg-card p-5 space-y-2 transition-colors hover:bg-secondary/20"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
                  <h3 className="text-base font-semibold text-foreground">
                    {belief.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-6.5">
                  {belief.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Chapter History Timeline */}
        <section className="space-y-5">
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Chapter History & Milestones
            </h2>
          </div>

          <div className="divide-y divide-border/60 rounded-xl border border-border/80 bg-card overflow-hidden">
            {historyMilestones.map((milestone, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8 p-5 sm:p-6 hover:bg-secondary/20 transition-colors"
              >
                <div className="sm:w-52 shrink-0 space-y-1">
                  <span className="font-mono text-sm sm:text-base font-bold text-foreground block">
                    {milestone.era}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground block">
                    {milestone.period}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Institutional Relationships */}
        <section className="rounded-xl border border-border/80 bg-secondary/30 p-6 sm:p-8 space-y-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-foreground" />
              <span>Institutional Affiliation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Institutional Relationship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-2.5">
              <h3 className="font-bold text-foreground flex items-center gap-1.5 text-base">
                <span>Birla Institute of Technology, Mesra</span>
                <a href={siteConfig.institution.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </a>
              </h3>
              <p>
                Founded in 1955 by philanthropist and industrialist B.M. Birla, BIT Mesra is a premier technical university in Ranchi, Jharkhand. The ACM Student Chapter operates under the guidance of the Department of Computer Science & Engineering.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-bold text-foreground flex items-center gap-1.5 text-base">
                <span>ACM Global Student Charter</span>
                <a href={siteConfig.parentOrganization.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </a>
              </h3>
              <p>
                The Association for Computing Machinery is the world&apos;s largest educational computing society. Our chapter is chartered by ACM Global, connecting our student members to international resources, conferences, and ethics.
              </p>
            </div>
          </div>
        </section>

        {/* Join Link */}
        <div className="pt-4 border-t border-border/60 flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-mono">Ready to get involved?</span>
          <Link
            href="/join"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-neutral-900 px-4 text-xs sm:text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 transition-colors"
          >
            Induction Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
