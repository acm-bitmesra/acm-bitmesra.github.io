import type { Metadata } from "next";
import Link from "next/link";
import { getPublicTeamMembers } from "@/data/team";
import { MemberCard } from "@/components/team/member-card";
import { MemberSpotlightCard } from "@/components/team/member-spotlight-card";
import { ShieldCheck, Info, ArrowRight, Sparkles, Users } from "@animateicons/react/lucide";

export const metadata: Metadata = {
  title: "Executive Team & Mentors | ACM BIT Mesra",
  description:
    "Meet the leadership, faculty advisors, technical leads, and mentors of the ACM Student Chapter at BIT Mesra.",
  openGraph: {
    title: "Executive Team & Mentors | ACM BIT Mesra",
    description:
      "Faculty guidance and student leadership coordinating contests, hackathons, and developer education at BIT Mesra.",
  },
};

export default function TeamPage() {
  const publicMembers = getPublicTeamMembers();
  const faculty = publicMembers.filter((m) => m.category === "faculty");
  const executive = publicMembers.filter((m) => m.category === "executive");
  const leads = publicMembers.filter((m) => m.category === "leads");

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Document Header */}
        <div className="space-y-4 border-b border-border/70 pb-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>Governance</span>
            <span>/</span>
            <span>Leadership & Mentors</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            Executive Team & Mentors
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Faculty guidance and student leadership coordinating contests, hackathons, and developer education under the Department of Computer Science & Engineering at BIT Mesra.
          </p>
        </div>

        {/* Faculty Sponsor Section */}
        {faculty.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Faculty Advisory & Patronage
                </h2>
              </div>
              <span className="hidden sm:inline font-mono text-xs text-muted-foreground">
                Department of CSE, BIT Mesra
              </span>
            </div>

            {faculty.length === 1 ? (
              <MemberSpotlightCard member={faculty[0]} />
            ) : (
              <div
                className={`grid grid-cols-1 ${
                  faculty.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
                } gap-6`}
              >
                {faculty.map((member) => (
                  <MemberCard key={member.slug} member={member} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Student Leadership Notice / Verified Members */}
        {executive.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Executive Committee
                </h2>
              </div>
              <span className="hidden sm:inline font-mono text-xs text-muted-foreground">
                Student Chapter Leadership
              </span>
            </div>

            {executive.length === 1 ? (
              <MemberSpotlightCard member={executive[0]} />
            ) : (
              <div
                className={`grid grid-cols-1 ${
                  executive.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
                } gap-6`}
              >
                {executive.map((member) => (
                  <MemberCard key={member.slug} member={member} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Section Verification Transparency Banner */}
        <section className="rounded-2xl border border-border/80 bg-secondary/25 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 font-mono text-xs text-foreground font-semibold uppercase tracking-wider">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>Academic Session Executive Induction & Verification</span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            In accordance with chapter verification standards, active student executive appointments (President, Vice President, General Secretary, and SIG Leads) are confirmed following each academic session&apos;s induction cycle under the Department of Computer Science & Engineering. Verified profiles appear automatically once official credentials are authenticated.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/alumni"
              className="btn-press inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm text-foreground hover:text-primary transition-colors font-medium border border-border/70 bg-card px-3.5 py-1.5 rounded-lg shadow-xs"
            >
              <span>Explore previous leadership batches in Alumni Archive</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* Leads & Coordinators if verified */}
        {leads.length > 0 && (
          <section className="space-y-6">
            <div className="border-b border-border/60 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Domain Leads & Coordinators
              </h2>
            </div>
            <div
              className={`grid grid-cols-1 ${
                leads.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
              } gap-6`}
            >
              {leads.map((member) => (
                <MemberCard key={member.slug} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Join the Team Callout */}
        <div className="card-hover rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-8 md:p-10 space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Get Involved</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Want to lead chapter initiatives?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Annual inductions are conducted for competitive programming mentors, technical developers, event coordinators, and designers. Open to all branches and years at BIT Mesra.
          </p>
          <div className="pt-2">
            <Link
              href="/join"
              className="btn-press inline-flex h-10 items-center justify-center rounded-lg bg-foreground text-background px-5 text-sm font-semibold hover:bg-foreground/90 transition-colors shadow-xs"
            >
              <span>Join ACM BIT Mesra</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
