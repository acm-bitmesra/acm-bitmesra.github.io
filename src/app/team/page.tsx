import type { Metadata } from "next";
import Link from "next/link";
import { getPublicTeamMembers } from "@/data/team";
import { MemberCard } from "@/components/team/member-card";
import { ShieldCheck, Info, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Executive Team & Mentors",
  description:
    "Meet the leadership, faculty advisors, technical leads, and mentors of the ACM Student Chapter at BIT Mesra.",
};

export default function TeamPage() {
  const publicMembers = getPublicTeamMembers();
  const faculty = publicMembers.filter((m) => m.category === "faculty");
  const executive = publicMembers.filter((m) => m.category === "executive");
  const leads = publicMembers.filter((m) => m.category === "leads");

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <span>Chapter Leadership · Governance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Executive Team & Mentors
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            The team guiding academic coordination, competitive programming leagues, hackathons, and software engineering initiatives at BIT Mesra.
          </p>
        </div>

        {/* Faculty Sponsor Section */}
        {faculty.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Faculty Advisory
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty.map((member) => (
                <MemberCard key={member.slug} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Student Leadership Notice / Verified Members */}
        {executive.length > 0 ? (
          <section className="space-y-6">
            <div className="border-b border-border pb-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Executive Body
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {executive.map((member) => (
                <MemberCard key={member.slug} member={member} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Section 67 Verification Transparency Banner */}
        <section className="rounded-xl border border-border/80 bg-secondary/30 p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-primary font-bold">
            <Info className="h-4 w-4" />
            <span>ANNUAL EXECUTIVE ROSTER UPDATE</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In accordance with chapter verification standards, the active 2026–2027 student executive appointments are confirmed following each academic session&apos;s induction cycle under the Department of Computer Science & Engineering. Unverified student rosters are withheld from public indexing to preserve archival accuracy.
          </p>
          <div className="pt-2">
            <Link
              href="/alumni"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary hover:underline"
            >
              <span>Explore previous leadership batches in Alumni Archive</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* Leads & Coordinators if verified */}
        {leads.length > 0 && (
          <section className="space-y-6">
            <div className="border-b border-border pb-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Domain Leads & Coordinators
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leads.map((member) => (
                <MemberCard key={member.slug} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* Join the Team CTA */}
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 text-center space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Want to lead chapter initiatives?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Annual inductions are conducted for competitive programming mentors, technical developers, event coordinators, and designers.
          </p>
          <div className="pt-2">
            <Link
              href="/join"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              See Induction Process
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
