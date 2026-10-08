import Link from "next/link";
import { TeamMember } from "@/types";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import {
  Globe,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  GraduationCap,
  Sparkles,
  User,
} from "@animateicons/react/lucide";

interface MemberSpotlightCardProps {
  member: TeamMember;
}

export function MemberSpotlightCard({ member }: MemberSpotlightCardProps) {
  const isFaculty = member.category === "faculty";

  return (
    <div className="card-hover rounded-2xl border border-border/80 bg-card/90 p-6 sm:p-8 md:p-10 transition-all duration-300 hover:border-foreground/30 hover:bg-card group shadow-sm">
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10 items-start">
        {/* Left Column: Portrait, Identity & Socials */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
          {/* Portrait with Badge Ring */}
          <div className="relative">
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-2 border-border/80 bg-secondary/60 p-1 overflow-hidden shadow-md group-hover:border-primary/40 transition-colors">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  width={128}
                  height={128}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>

            {isFaculty ? (
              <span
                title="Verified Institutional Advisor"
                className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 backdrop-blur-md shadow-xs"
              >
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>Advisor</span>
              </span>
            ) : (
              <span
                title="Active Chapter Executive"
                className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary backdrop-blur-md shadow-xs"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                <span>Executive</span>
              </span>
            )}
          </div>

          {/* Name & Primary Role */}
          <div className="space-y-1.5 w-full">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              <Link
                href={`/team/${member.slug}`}
                className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {member.name}
              </Link>
            </h3>

            <p className="text-sm font-semibold text-primary/95">
              {member.role}
            </p>

            {member.batch && (
              <p className="text-xs font-mono text-muted-foreground flex items-center justify-center lg:justify-start gap-1">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Batch of {member.batch}</span>
              </p>
            )}

            {member.program && (
              <p className="text-xs text-muted-foreground/90 leading-snug pt-1">
                {member.program}
              </p>
            )}
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on GitHub (opens in new tab)`}
                title="GitHub Profile"
                className="btn-press inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}

            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn (opens in new tab)`}
                title="LinkedIn Profile"
                className="btn-press inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            )}

            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} Website (opens in new tab)`}
                title="Personal / Institutional Website"
                className="btn-press inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Bio, Specializations & Key Contributions */}
        <div className="space-y-6 lg:border-l lg:border-border/60 lg:pl-10">
          {/* Biography */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              {isFaculty ? "Academic & Mentorship Profile" : "Executive Profile & Focus"}
            </h4>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              {member.bio}
            </p>
          </div>

          {/* Interests & Specializations Tags */}
          {member.interests && member.interests.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                {isFaculty ? "Research Specializations" : "Areas of Expertise"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-xs font-mono px-2.5 py-1 rounded-md bg-secondary/70 text-foreground/90 border border-border/70"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Contributions */}
          {member.contributions && member.contributions.length > 0 && (
            <div className="space-y-2.5 border-t border-border/60 pt-4">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Key Contributions & Chapter Role
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                {member.contributions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/60">
            <Link
              href={`/team/${member.slug}`}
              className="btn-press inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-foreground/90 transition-colors shadow-xs"
            >
              <span>View Full Chapter Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 text-foreground px-4 py-2 text-xs sm:text-sm font-medium hover:bg-secondary transition-colors"
              >
                <span>{isFaculty ? "Official Department Profile" : "Personal Portfolio"}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
