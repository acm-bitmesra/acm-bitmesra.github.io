export interface HistoryEvent {
  year: string;
  era: string;
  title: string;
  summary: string;
  highlights: string[];
}

export const chapterHistory: HistoryEvent[] = [
  {
    year: "Early Era",
    era: "Charter Inception",
    title: "Establishment of ACM Student Chapter at BIT Mesra",
    summary:
      "A group of visionary students and faculty members in the Department of Computer Science & Engineering established the chapter charter to bring world-class computing standards to the Ranchi campus.",
    highlights: [
      "Official institutional charter approved by ACM Global",
      "Established foundational library and study groups in CSE Department",
      "Introduced formal algorithmic problem-solving culture",
    ],
  },
  {
    year: "Contest Era",
    era: "Competitive Programming",
    title: "Emergence of CodeZilla & ICPC Focus",
    summary:
      "With collegiate coding contests gaining prominence, the chapter instituted CodeZilla as its flagship annual competitive programming contest and structured internal selection for ICPC regionals.",
    highlights: [
      "Inauguration of CodeZilla contest series",
      "Regular ICPC Asia-West regional team qualification",
      "Launch of CQM (Code Quotient Monthly) internal leagues",
    ],
  },
  {
    year: "Hackathon Era",
    era: "Product & Prototyping",
    title: "Hack-A-Bit & Open-Source Community Expansion",
    summary:
      "Recognizing the need for end-to-end product development, the chapter conceived Hack-A-Bit, growing it into one of Eastern India's most celebrated multi-day hackathons.",
    highlights: [
      "Hack-A-Bit attracts participants from universities across India",
      "Partnership with open-source communities and tech sponsors",
      "Expansion into modern web frameworks, AI, and systems engineering",
    ],
  },
  {
    year: "Present & Future",
    era: "Integrated Ecosystem",
    title: "A Comprehensive Computing Society",
    summary:
      "Today, ACM BIT Mesra functions as an integrated developer community, research catalyst, and competitive programming guild, preparing future tech leaders.",
    highlights: [
      "Modern Edge & Cloud Architecture for all chapter infrastructure",
      "Collaborative project incubators and open source sprints",
      "Continuous peer-to-peer mentorship across all undergraduate years",
    ],
  },
];
