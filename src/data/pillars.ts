export interface Pillar {
  number: string;
  title: string;
  shortDescription: string;
  description: string;
  href: string;
  skills: string[];
  ctaText: string;
}

export const corePillars: Pillar[] = [
  {
    number: "01",
    title: "Competitive Programming",
    shortDescription: "Algorithms, data structures, contest strategy, and ICPC preparation.",
    description:
      "A structured environment for mastering problem solving, algorithmic paradigms, code speed, and ICPC regional contest training through regular contests and peer analysis.",
    href: "/activities/competitive-programming",
    skills: ["Data Structures", "Graph Theory", "Dynamic Programming", "Contest Math", "ICPC"],
    ctaText: "Explore CP Track",
  },
  {
    number: "02",
    title: "Developer Community",
    shortDescription: "Build production software, learn modern architectures, and collaborate.",
    description:
      "Translating ideas into robust software systems. From modern full-stack engineering and distributed services to campus infrastructure and public open-source contributions.",
    href: "/activities/open-source",
    skills: ["Full-Stack Engineering", "Distributed Systems", "Cloud Edge", "Git & GitHub", "Code Reviews"],
    ctaText: "Explore Projects",
  },
  {
    number: "03",
    title: "Hackathons",
    shortDescription: "Prototype real-world solutions, test limits, and compete in multidisciplinary teams.",
    description:
      "Organizers of Hack-A-Bit, one of Eastern India's premier student hackathons. Fostering product intuition, rapid prototyping, hardware-software integration, and technical presentations.",
    href: "/activities/hackathons",
    skills: ["Rapid Prototyping", "Product Design", "API Integrations", "Pitching", "Teamwork"],
    ctaText: "Explore Hackathons",
  },
  {
    number: "04",
    title: "Technical Learning",
    shortDescription: "Workshops, peer mentoring, study groups, and deep technical discussions.",
    description:
      "Demystifying foundational computer science. Peer-led workshops on C++, systems, web technologies, operating systems, networking, and emerging engineering tools.",
    href: "/activities/workshops",
    skills: ["Workshops", "Peer Mentorship", "Paper Reading", "Core CS Fundamentals", "Labs"],
    ctaText: "Explore Workshops",
  },
];
