import { TeamMember } from "@/types";

export const teamMembers: TeamMember[] = [
  {
    slug: "dr-sumit-srivastava",
    name: "Dr. Sumit Srivastava",
    role: "Faculty Sponsor & Chapter Advisor",
    category: "faculty",
    program: "Assistant Professor, Department of Computer Science & Engineering",
    bio: "Faculty Sponsor & Chapter Advisor for the ACM Student Chapter at BIT Mesra. Assistant Professor in the Department of Computer Science & Engineering with 14+ years of academic and research experience. Leading research in cybersecurity, artificial intelligence, signal processing, voice biometrics, and digital forensics.",
    avatar: "/images/team/dr-sumit-srivastava.jpg",
    website: "https://bitmesra.ac.in/Show_profile/35614D7A75715142676139346B6156434248324B56413D3D",
    interests: [
      "Cybersecurity & Network Security",
      "Artificial Intelligence & Machine Learning",
      "Signal Processing",
      "Voice Biometrics & Speaker Identification",
      "Digital Forensics",
    ],
    contributions: [
      "Faculty Sponsor & Chapter Advisor, ACM BIT Mesra",
      "Academic & Research Mentorship in Computer Science",
      "Institutional Coordination with ACM Global",
    ],
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
