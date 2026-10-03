import type { Metadata } from "next";
import Link from "next/link";
import { getPublicTeamMembers } from "@/data/team";
import { MemberCard } from "@/components/team/member-card";
import { ShieldCheck, Info, ArrowRight } from "lucide-react";

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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Document Header */}
        <div className="space-y-4 border-b border-border/70 pb-8">
          <div className="text-xs sm:text-sm font-mono text-muted-foreground">
            Governance / Leadership & Mentors
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
          <section className="space-y-5">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <ShieldCheck className="h-5 w-5 text-foreground" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Faculty Advisory
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {faculty.map((member) => (
                <MemberCard key={member.slug} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Student Leadership Notice / Verified Members */}
        {executive.length > 0 && (
          <section className="space-y-5">
            <div className="border-b border-border/60 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Executive Body
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {executive.map((member) => (
                <MemberCard key={member.slug} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Section Verification Transparency Banner */}
        <section className="rounded-xl border border-border/80 bg-secondary/30 p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-foreground font-semibold uppercase tracking-wider">
            <Info className="h-4 w-4 shrink-0" />
            <span>Annual Executive Roster Verification</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In accordance with chapter verification standards, active student executive appointments are confirmed following each academic session&apos;s induction cycle under the Department of Computer Science & Engineering. Unverified student rosters are withheld from public indexing to preserve archival accuracy.
          </p>
          <div className="pt-1">
            <Link
              href="/alumni"
              className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm text-foreground hover:underline font-medium"
            >
              <span>Explore previous leadership batches in Alumni Archive</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* Leads & Coordinators if verified */}
        {leads.length > 0 && (
          <section className="space-y-5">
            <div className="border-b border-border/60 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Domain Leads & Coordinators
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {leads.map((member) => (
                <MemberCard key={member.slug} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Join the Team Callout */}
        <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Want to lead chapter initiatives?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Annual inductions are conducted for competitive programming mentors, technical developers, event coordinators, and designers. Open to all branches and years.
          </p>
          <div className="pt-2">
            <Link
              href="/join"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-neutral-900 px-5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 transition-colors"
            >
              See Induction Process →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
