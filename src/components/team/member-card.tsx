import Link from "next/link";
import { TeamMember } from "@/types";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { Globe, ArrowRight, User } from "lucide-react";

interface MemberCardProps {
  member: TeamMember;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="rounded-lg border border-border/80 bg-card p-5 flex flex-col justify-between transition-colors hover:border-border hover:bg-secondary/20 group">
      <div className="space-y-3">
        {/* Avatar Placeholder or Image */}
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-full border border-border/80 bg-secondary flex items-center justify-center text-muted-foreground transition-colors shrink-0">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </div>
          <div className="space-y-0.5 overflow-hidden">
            <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:underline truncate">
              <Link href={`/team/${member.slug}`}>{member.name}</Link>
            </h3>
            <p className="text-xs font-mono text-muted-foreground truncate">
              {member.role}
            </p>
            {member.batch && (
              <p className="text-[11px] font-mono text-muted-foreground">
                {member.batch}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {member.bio}
        </p>

        {member.program && (
          <p className="text-[11px] font-mono text-muted-foreground/80 border-t border-border/60 pt-2">
            {member.program}
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
        {/* Social Links */}
        <div className="flex items-center gap-2 text-muted-foreground">
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} GitHub`}
              className="p-1.5 rounded hover:text-foreground hover:bg-secondary transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="p-1.5 rounded hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LinkedinIcon className="h-3.5 w-3.5" />
            </a>
          )}
          {member.website && (
            <a
              href={member.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} Website`}
              className="p-1.5 rounded hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        <Link
          href={`/team/${member.slug}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground group-hover:text-primary transition-colors"
        >
          <span>Profile</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
