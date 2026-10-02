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
  return members.map((m) => ({
    slug: m.slug,
  }));
}

export async function generateMetadata({
  params,
}: MemberDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getPublicTeamMembers().find((m) => m.slug === slug);

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
  const member = getPublicTeamMembers().find((m) => m.slug === slug);

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
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="h-24 w-24 rounded-full border-2 border-primary/20 bg-secondary flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
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

          {/* Social / Direct Channels */}
          {(member.github || member.linkedin || member.website) && (
            <div className="border-t border-border pt-6 space-y-3">
              <h3 className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                Official Profiles
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <GithubIcon className="h-4 w-4" /> GitHub
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <LinkedinIcon className="h-4 w-4" /> LinkedIn
                  </a>
                )}
                {member.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Globe className="h-4 w-4" /> Personal Website
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
