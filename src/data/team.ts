import { TeamMember } from "@/types";

export const teamMembers: TeamMember[] = [
  {
    slug: "faculty-sponsor",
    name: "Faculty Sponsor",
    role: "Faculty Sponsor & Chapter Advisor",
    category: "faculty",
    program: "Department of Computer Science & Engineering",
    bio: "Guiding the student chapter in academic alignment, institutional coordination, and computing ethics at BIT Mesra.",
    isVerified: true,
  },
  {
    slug: "president",
    name: "President",
    role: "President",
    category: "executive",
    batch: "2023–2027",
    program: "B.Tech Computer Science & Engineering",
    bio: "Overseeing chapter strategy, institutional partnerships, flagship events, and executive coordination.",
    isVerified: false, // TODO: VERIFY with student affairs / official induction list
  },
  {
    slug: "vice-president",
    name: "Vice President",
    role: "Vice President",
    category: "executive",
    batch: "2023–2027",
    program: "B.Tech Computer Science & Engineering",
    bio: "Driving internal operations, cross-SIG collaboration, and student engagement initiatives.",
    isVerified: false, // TODO: VERIFY with student affairs / official induction list
  },
  {
    slug: "general-secretary",
    name: "General Secretary",
    role: "General Secretary",
    category: "executive",
    batch: "2023–2027",
    program: "B.Tech Information Technology",
    bio: "Managing chapter documentation, external correspondence, and event logistics.",
    isVerified: false, // TODO: VERIFY with student affairs / official induction list
  },
  {
    slug: "cp-lead",
    name: "CP Lead",
    role: "Competitive Programming Lead",
    category: "leads",
    batch: "2023–2027",
    program: "B.Tech Computer Science & Engineering",
    bio: "Curating problem sets, hosting CodeZilla and CQM, and conducting weekly contest editorial sessions.",
    isVerified: false, // TODO: VERIFY with student affairs / official induction list
  },
  {
    slug: "technical-lead",
    name: "Technical Lead",
    role: "Technical & Systems Lead",
    category: "leads",
    batch: "2023–2027",
    program: "B.Tech Computer Science & Engineering",
    bio: "Leading development of chapter infrastructure, open-source initiatives, and engineering workshops.",
    isVerified: false, // TODO: VERIFY with student affairs / official induction list
  },
];

/**
 * Filter verified team members only for public display
 * Unverified placeholders marked TODO: VERIFY are never shown to visitors
 */
export function getPublicTeamMembers(): TeamMember[] {
  return teamMembers.filter((m) => m.isVerified);
}

export function getAllTeamMembersForAudit(): TeamMember[] {
  return teamMembers;
}
