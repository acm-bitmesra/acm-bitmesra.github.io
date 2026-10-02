export interface TimelineStep {
  step: string;
  title: string;
  description: string;
}

export const impactSteps: TimelineStep[] = [
  {
    step: "01",
    title: "Learn",
    description: "Begin with strong computational fundamentals, languages, algorithmic paradigms, and systems thinking.",
  },
  {
    step: "02",
    title: "Practice",
    description: "Tackle problem sets, participate in weekly contests, and refine algorithmic speed through peer reviews.",
  },
  {
    step: "03",
    title: "Compete",
    description: "Represent the institute at ICPC regionals, global coding hackathons, and collegiate coding platforms.",
  },
  {
    step: "04",
    title: "Build",
    description: "Architect and ship reliable tools, campus utilities, developer toolkits, and open-source systems.",
  },
  {
    step: "05",
    title: "Lead",
    description: "Direct chapter initiatives, organize flagship events like Hack-A-Bit and CodeZilla, and manage operations.",
  },
  {
    step: "06",
    title: "Teach",
    description: "Close the loop by conducting technical workshops and mentoring the incoming batch of junior engineers.",
  },
];

export const whyStudentsParticipate = [
  {
    title: "Learn from Peers",
    description: "Work alongside seniors and peers who have tackled ICPC regionals, contributed to major OSS, and built real systems.",
  },
  {
    title: "Consistent Practice",
    description: "Break the cycle of passive tutorials through active contests, coding sprints, and hands-on build nights.",
  },
  {
    title: "Collaborative Teams",
    description: "Form multi-disciplinary squads for hackathons, engineering competitions, and collaborative software projects.",
  },
  {
    title: "Real System Exposure",
    description: "Move beyond toy problem sets to writing production-ready code with code reviews, testing, and modern deployment.",
  },
  {
    title: "Institutional Community",
    description: "Connect with a proud network of BIT Mesra alumni working in engineering and research across the globe.",
  },
];
