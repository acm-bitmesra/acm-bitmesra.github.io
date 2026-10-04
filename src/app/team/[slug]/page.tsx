import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicTeamMembers } from "@/data/team";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { ArrowLeft, Globe, ShieldCheck, User } from "lucide-react";

interface MemberDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const members = getPublicTeamMembers();
  const slugs = members.map((m) => ({
    slug: m.slug,
  }));
  slugs.push({ slug: "faculty-sponsor" });
  return slugs;
}

export async function generateMetadata({
  params,
}: MemberDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getPublicTeamMembers().find(
    (m) => m.slug === slug || (slug === "faculty-sponsor" && m.category === "faculty")
  );

  if (!member) {
    return { title: "Member Not Found" };
  }

  return {
    title: `${member.name} — ${member.role}`,
    description: member.bio,
  };
}

export default async function MemberDetailPage({ params }: MemberDetailPageProps) {
  const { slug } = await params;
  const member = getPublicTeamMembers().find(
    (m) => m.slug === slug || (slug === "faculty-sponsor" && m.category === "faculty")
  );

  if (!member) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/team"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Executive Team
          </Link>
        </div>

        {/* Member Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 lg:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="h-24 w-24 rounded-full border-2 border-primary/20 bg-secondary flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>

            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Official Role</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                {member.name}
              </h1>
              <p className="text-base font-mono text-primary">{member.role}</p>
              {member.program && (
                <p className="text-xs font-mono text-muted-foreground">
                  {member.program}
                  {member.batch ? ` · ${member.batch}` : ""}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Biography & Focus</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {member.bio}
            </p>
          </div>

          {member.interests && member.interests.length > 0 && (
            <div className="border-t border-border pt-6 space-y-3">
              <h3 className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                Specializations & Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-md border border-border/80 bg-secondary/60 px-2.5 py-1 text-xs font-mono text-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {member.contributions && member.contributions.length > 0 && (
            <div className="border-t border-border pt-6 space-y-3">
              <h3 className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                Leadership & Contributions
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {member.contributions.map((contribution, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold">›</span>
                    <span>{contribution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social / Direct Channels */}
          {(member.github || member.linkedin || member.website) && (
            <div className="border-t border-border pt-6 space-y-3">
              <h3 className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                Official Profiles
              </h3>
              <div className="flex flex-wrap items-center gap-2.5 text-sm text-foreground">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on GitHub (opens in new tab)`}
                    className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-border/80 bg-secondary/30 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn (opens in new tab)`}
                    className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-border/80 bg-secondary/30 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {member.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} Personal Website (opens in new tab)`}
                    className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-border/80 bg-secondary/30 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Personal Website</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
