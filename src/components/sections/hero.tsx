import Link from "next/link";
import { ArrowRight, Code2, Trophy, Terminal, BookOpen } from "lucide-react";

const focusAreas = [
  {
    href: "/competitive-programming",
    icon: Code2,
    title: "Competitive programming",
    description: "CQM contests, Codeforces practice, and ICPC preparation.",
  },
  {
    href: "/events/hack-a-bit",
    icon: Trophy,
    title: "Hack-A-Bit",
    description: "The chapter's flagship student-led hackathon.",
  },
  {
    href: "/activities/open-source",
    icon: Terminal,
    title: "Open source",
    description: "Student repositories, developer tooling, and collaborative engineering.",
  },
  {
    href: "/resources",
    icon: BookOpen,
    title: "Learning hub",
    description: "Curated roadmaps, practice sheets, and interview resources.",
  },
];

export function HeroSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-20 lg:px-8 lg:py-24">
        <div className="min-w-0">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
            Build. Compete. Ship.
          </h1>

          <p className="mt-6 max-w-[68ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            A student-led computing society at Birla Institute of Technology, Mesra. We practice algorithms, build software systems, compete in ICPC, and organize Hack-A-Bit.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/events"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Upcoming events
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resources"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Browse resources
            </Link>
            <Link
              href="/join"
              className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Join the chapter →
            </Link>
          </div>
        </div>

        <div className="border-t border-border lg:border-l lg:border-t-0 lg:pl-8">
          <div className="pt-6 lg:pt-0">
            <p className="text-sm font-semibold text-foreground">What we work on</p>
            <div className="mt-3 divide-y divide-border border-y border-border">
              {focusAreas.map(({ href, icon: Icon, title, description }) => (
                <Link
                  key={href}
                  href={href}
                  className="group grid min-h-24 grid-cols-[1.5rem_minmax(0,1fr)] gap-3 py-5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="mt-0.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  <span>
                    <span className="block text-sm font-semibold text-foreground group-hover:text-primary sm:text-base">
                      {title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
