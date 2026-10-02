export interface GalleryItem {
  id: string;
  title: string;
  category: "Workshops" | "Hackathons" | "Contests" | "Team" | "Talks" | "Campus";
  description: string;
  date: string;
  aspectRatio: "square" | "landscape" | "portrait";
}

export const galleryItems: GalleryItem[] = [
  {
    id: "hackabit-stage",
    title: "Hack-A-Bit Hackathon Keynote & Hackers",
    category: "Hackathons",
    description: "Participants gathered in CAT Hall for the opening keynote and challenge release of Hack-A-Bit.",
    date: "October 2024",
    aspectRatio: "landscape",
  },
  {
    id: "codezilla-lab",
    title: "CodeZilla Onsite Contest Session",
    category: "Contests",
    description: "Students solving algorithmic problem sets under live contest conditions in the Department CSE lab.",
    date: "February 2025",
    aspectRatio: "landscape",
  },
  {
    id: "oss-workshop-terminal",
    title: "Hands-on Open Source & Git Sprint",
    category: "Workshops",
    description: "Mentoring junior engineers on git branches, interactive rebasing, and making first upstream PRs.",
    date: "September 2026",
    aspectRatio: "square",
  },
  {
    id: "icpc-team-prep",
    title: "ICPC Regional Team Mock Simulation",
    category: "Contests",
    description: "A 3-member team analyzing problem statements, debugging test cases, and managing single-keyboard time.",
    date: "November 2025",
    aspectRatio: "landscape",
  },
  {
    id: "campus-cse-building",
    title: "Department of Computer Science & Engineering",
    category: "Campus",
    description: "The academic and laboratory home of ACM Student's Chapter at BIT Mesra, Ranchi.",
    date: "Campus Archive",
    aspectRatio: "landscape",
  },
  {
    id: "tech-talk-architecture",
    title: "Alumni Technical Talk on Distributed Systems",
    category: "Talks",
    description: "Guest session exploring high-throughput message queues, latency budgets, and real-world architectures.",
    date: "August 2026",
    aspectRatio: "landscape",
  },
  {
    id: "executive-induction-meet",
    title: "Chapter Orientation & Induction Session",
    category: "Team",
    description: "Introducing newly inducted members to chapter special interest groups, project roadmaps, and mentoring.",
    date: "September 2026",
    aspectRatio: "square",
  },
  {
    id: "bit-mesra-main-building",
    title: "Historic Main Building, BIT Mesra",
    category: "Campus",
    description: "The iconic clock tower and central academic campus of Birla Institute of Technology, Mesra.",
    date: "Campus Archive",
    aspectRatio: "landscape",
  },
];
