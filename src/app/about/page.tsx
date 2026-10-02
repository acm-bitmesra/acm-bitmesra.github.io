import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CheckCircle2, ExternalLink, ShieldCheck, Compass, Lightbulb, Building2 } from "lucide-react";

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
    era: "Foundational Era",
    period: "Early Chapter Establishment",
    description:
      "Formed by passionate computing students and faculty advisors in the Department of Computer Science & Engineering at BIT Mesra, inaugurating an institutional student charter affiliated with ACM Global.",
  },
  {
    era: "Contest Culture & CodeZilla",
    period: "Algorithmic Growth",
    description:
      "Initiated regular campus coding contests and CodeZilla, creating a consistent pipeline of students training for ACM-ICPC regional contests and algorithmic competitions.",
  },
  {
    era: "Hackathon Expansion & Hack-A-Bit",
    period: "Flagship Hackathon Era",
    description:
      "Launched Hack-A-Bit, expanding the chapter's reach across Eastern India with multi-day, multi-track student hackathons featuring real-world product prototyping.",
  },
  {
    era: "Modern Developer & Open-Source Community",
    period: "Present Day",
    description:
      "Evolving into an integrated developer ecosystem combining competitive programming, full-stack systems engineering, research exposure, and open-source contributions.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-mono text-muted-foreground backdrop-blur-sm">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span>Birla Institute of Technology, Mesra · Established Chapter</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-foreground leading-tight">
            What is ACM BIT Mesra?
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            We are the official student chapter of the Association for Computing Machinery (ACM) at Birla Institute of Technology, Mesra. We are a technical society run by students, for students, dedicated to advancing computing as a science and a craft.
          </p>
        </section>

        {/* Mission & Vision Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-border bg-card p-8 space-y-4 relative overflow-hidden">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Compass className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Our Mission</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              To cultivate an enduring culture of problem solving, software excellence, and technical leadership at BIT Mesra. We empower students across disciplines to gain competence in algorithmic thinking, production engineering, and collaborative development.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 space-y-4 relative overflow-hidden">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Our Vision</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              To serve as the premier student-led computing hub in the region, bridging the gap between foundational computer science education and real-world technology challenges, fostering alumni who build meaningful software systems globally.
            </p>
          </div>
        </section>

        {/* Section: What We Believe */}
        <section className="space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Foundations</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              What We Believe
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Principles that guide our workshops, hackathons, contest preparation, and community interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beliefs.map((belief, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-6 space-y-2 hover:border-border/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <h3 className="text-base font-bold text-foreground">
                    {belief.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  {belief.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Chapter History Timeline */}
        <section className="space-y-8 border-t border-border pt-16">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Timeline</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Chapter History & Milestones
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              A chronology of algorithmic contests, hackathons, and community growth at BIT Mesra.
            </p>
          </div>

          <div className="space-y-6">
            {historyMilestones.map((milestone, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 rounded-xl border border-border bg-card p-6"
              >
                <div className="sm:w-48 shrink-0 space-y-1">
                  <span className="font-mono text-xs font-bold text-primary block">
                    {milestone.era}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground block">
                    {milestone.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Institutional Relationships */}
        <section className="rounded-2xl border border-border bg-secondary/30 p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>INSTITUTIONAL AFFILIATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              ACM + BIT Mesra & Global Connection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <span>Birla Institute of Technology, Mesra</span>
                <a href={siteConfig.institution.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 text-primary" />
                </a>
              </h3>
              <p>
                Founded in 1955 by philanthropist and industrialist B.M. Birla, BIT Mesra is a premier technical deemed university in Ranchi, Jharkhand. The ACM Student Chapter operates under the guidance of the Department of Computer Science & Engineering.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <span>ACM Global Student Charter</span>
                <a href={siteConfig.parentOrganization.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 text-primary" />
                </a>
              </h3>
              <p>
                The Association for Computing Machinery is the world&apos;s largest educational and scientific computing society. Our chapter is chartered by ACM Global as a student chapter, operating locally at BIT Mesra while connecting our members to ACM&apos;s global digital library, student competitions, and professional ethics.
              </p>
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="pt-4 text-center space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Ready to build with us?
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Discover upcoming inductions or attend our weekly coding and development meetups.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/join"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Join the Chapter
            </Link>
            <Link
              href="/activities"
              className="inline-flex h-10 items-center justify-center rounded-md border border-border px-5 text-sm font-medium hover:bg-secondary transition-colors"
            >
              Explore Activities
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
