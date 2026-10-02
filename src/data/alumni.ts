export interface AlumniBatch {
  academicYear: string;
  graduatingBatch: string;
  leadership: {
    role: string;
    note: string;
    isVerified: boolean;
  }[];
  initiatives: string[];
}

export const alumniBatches: AlumniBatch[] = [
  {
    academicYear: "2024–2025",
    graduatingBatch: "Class of 2025",
    leadership: [
      { role: "Executive Board", note: "Handled Hack-A-Bit and regional ICPC qualifiers.", isVerified: true },
      { role: "Technical Leads", note: "Mentored first-year problem solvers in weekly editorial sessions.", isVerified: true },
    ],
    initiatives: [
      "Hack-A-Bit offline hackathon execution",
      "CodeZilla algorithmic tournament",
      "Regular Codeforces and CodeChef practice contests",
    ],
  },
  {
    academicYear: "2023–2024",
    graduatingBatch: "Class of 2024",
    leadership: [
      { role: "Chapter Leadership", note: "Coordinated campus hackathon sponsorships and workshop modules.", isVerified: true },
    ],
    initiatives: [
      "Departmental peer mentoring labs",
      "CQM monthly contest series continuation",
      "GSoC & open-source preparation seminars",
    ],
  },
  {
    academicYear: "2022–2023",
    graduatingBatch: "Class of 2023",
    leadership: [
      { role: "Chapter Leadership", note: "Navigated transition back to full in-person lab and contest sessions.", isVerified: true },
    ],
    initiatives: [
      "Post-lockdown algorithmic bootcamp",
      "Campus developer tooling roadmap",
    ],
  },
];

export const alumniEngagementPaths = [
  {
    title: "Guest Speaker & Tech Talks",
    description: "Share real-world engineering experiences, distributed architecture insights, or graduate research with current students.",
  },
  {
    title: "ICPC & Hackathon Mentorship",
    description: "Offer contest problem reviews, pitch critique, or mock interviews for final-year students.",
  },
  {
    title: "Chapter Archive & Verification",
    description: "Help document historical chapter achievements, previous contest editions, and alumni rosters.",
  },
];
