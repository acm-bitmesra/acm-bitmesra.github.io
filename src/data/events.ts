import { Event } from "@/types";

export const events: Event[] = [
  {
    slug: "hacktoberfest-2026",
    title: "Hacktoberfest 2026",
    tagline: "Build. Experiment. Share.",
    theme: "AI belongs to everyone.",
    shortDescription:
      "Hacktoberfest 2026 is here. This October, ACM BIT Mesra invites students and developers to explore open source, experiment with AI and open-weight models, and build something meaningful.",
    description:
      "Hacktoberfest 2026 is here. This October, ACM BIT Mesra invites students and developers to explore open source, experiment with AI and open-weight models, and build something meaningful.\n\nLearn, build, experiment, and showcase what you create throughout the month.\n\nMore challenge details, rules, timelines, judging information, and prizes will be announced on this event page.",
    category: "Open Source / AI / Developer Community",
    status: "upcoming",
    date: "2026-10-01",
    endDate: "2026-10-31",
    time: "Month-long Celebration (October 2026)",
    location: "Online & BIT Mesra Campus, Ranchi",
    organizers: ["ACM BIT Mesra"],
    isFeatured: true,
    registrationOpen: false,
    registrationStatusText: "Registration Opening Soon",
    registrationHelperText:
      "Registrations for the ACM Hacktoberfest Challenge will open soon. Stay tuned for the registration announcement.",
    registrationType: "github",
    registrationUrl: "/events/hacktoberfest-2026",
    tags: [
      "Open Source",
      "Hacktoberfest",
      "AI",
      "Open-Weight Models",
      "Developer Community",
      "Building & Experimentation",
    ],
    about: [
      "Hacktoberfest 2026 is a month-long celebration of open source throughout October 2026. The official 2026 focus is on learning and building with open-source AI and open-weight models, through online and in-person activities.",
      "Pull requests and merge requests are no longer used as the official Hacktoberfest reward metric in 2026. Instead, the season centers on exploring, creating, and experimenting with community-driven computing.",
      "ACM BIT Mesra is proud to host a dedicated challenge during this season to empower campus developers, researchers, and creators to build impactful software together.",
    ],
    expectations: [
      {
        title: "Explore open source",
        description:
          "Discover impactful repositories, open tools, and community-driven computing practices.",
      },
      {
        title: "Experiment with AI",
        description:
          "Engage with open-weight models, local inference runtimes, and accessible intelligence.",
      },
      {
        title: "Build meaningful projects",
        description:
          "Move from passive learning to shipping practical software and prototypes.",
      },
      {
        title: "Learn with the community",
        description:
          "Collaborate alongside peers, mentors, and SIG leads across the chapter.",
      },
      {
        title: "Showcase what you create",
        description:
          "Present your work, share insights, and get peer feedback by the end of October.",
      },
    ],
    challengeTitle: "ACM Hacktoberfest Challenge",
    challengeDescription:
      "ACM BIT Mesra will host a dedicated challenge during Hacktoberfest. Challenge rules, submission requirements, judging criteria, timeline, and other details will be announced soon.",
    timelineNotice: "October 2026 — Challenge Month",
    timelineItems: [
      {
        date: "October 1 – 31, 2026",
        title: "Challenge Month",
        status: "Confirmed",
        description: "Month-long building, exploration, and community experimentation.",
      },
      {
        date: "To Be Announced",
        title: "Challenge Rules & Submission Guidelines",
        status: "Upcoming",
        description: "Detailed problem tracks, constraints, and submission criteria.",
      },
      {
        date: "To Be Announced",
        title: "Workshops & Mentorship Check-Ins",
        status: "Upcoming",
        description: "Hands-on guidance from chapter leads and technical mentors.",
      },
      {
        date: "To Be Announced",
        title: "Submissions & Peer Showcase",
        status: "Upcoming",
        description: "Project review, project showcases, and community evaluations.",
      },
    ],
    prizesNotice: "Prize and recognition details will be announced by the organizing team.",
    prizes: [
      {
        title: "Prizes: To Be Decided",
        reward: "To Be Decided",
        description: "Prize and recognition details will be announced by the organizing team.",
      },
    ],
    faqs: [
      {
        question: "What is Hacktoberfest?",
        answer:
          "A month-long celebration of open source throughout October. In 2026, its focus is on learning and building with open-source AI and open-weight models.",
      },
      {
        question: "Do pull requests count toward Hacktoberfest rewards in 2026?",
        answer:
          "No. Pull requests and merge requests no longer count toward official Hacktoberfest rewards in 2026.",
      },
      {
        question: "When will ACM BIT Mesra challenge registration open?",
        answer:
          "Registrations will open soon. The website should show the registration button as disabled until the organizing team activates it.",
      },
      {
        question: "What are the prizes?",
        answer: "To be decided. Details will be announced later.",
      },
      {
        question: "Who can participate?",
        answer:
          "Participation eligibility will follow the official ACM BIT Mesra challenge guidelines once finalized. Specific criteria and team guidelines will be posted on this page.",
      },
    ],
    disclaimer:
      "Disclaimer: Hacktoberfest is a registered trademark. This event is an independent community challenge hosted by ACM BIT Mesra associated with the open-source season, and is not officially operated, sponsored, or endorsed by Hacktoberfest, DigitalOcean, MLH, or DEV.",
  },
  {
    slug: "hack-a-bit",
    title: "Hack-A-Bit",
    shortDescription: "Eastern India's premier student-led hackathon hosted annually by ACM BIT Mesra.",
    description:
      "Hack-A-Bit is the flagship 36-hour annual hackathon of ACM BIT Mesra, bringing together developers, designers, and problem solvers from institutions across the nation to build real-world software, hardware prototypes, and societal solutions.",
    category: "Hackathon",
    status: "completed",
    date: "2024-10-25",
    endDate: "2024-10-27",
    time: "36-Hour Hackathon",
    location: "R&D Building & CAT Hall, BIT Mesra, Ranchi",
    poster: "/images/events/hack-a-bit.svg",
    coverImage: "/images/events/hack-a-bit.svg",
    organizers: ["ACM Student's Chapter, BIT Mesra"],
    isFeatured: true,
    tags: ["Hackathon", "Prototyping", "Full-Stack", "Hardware", "Innovation"],
    rules: [
      "Teams of 2 to 4 members are permitted.",
      "All code and prototypes must be developed during the official hackathon duration.",
      "Open-source libraries and APIs are permitted provided they are attributed in project documentation.",
      "Strict adherence to the ACM BIT Mesra Code of Conduct.",
    ],
    prizes: [
      { title: "Champion (1st Place)", reward: "Cash Prize + Trophy + Certificate", description: "Awarded to the most complete, innovative, and impactful prototype." },
      { title: "Runner-Up (2nd Place)", reward: "Cash Prize + Trophy + Certificate", description: "Recognizing technical depth and engineering excellence." },
      { title: "Best Domain Tracks", reward: "Track Honors & Goodies", description: "Special awards across Web3/FinTech, Healthcare, and Sustainable Tech." },
    ],
    faqs: [
      { question: "Who can participate in Hack-A-Bit?", answer: "Any registered university student with a valid student ID is eligible to apply." },
      { question: "Is there a registration fee?", answer: "No, Hack-A-Bit is free of charge for all accepted teams." },
      { question: "Are travel allowances provided?", answer: "Travel details and food/accommodation guidelines are communicated to shortlisted teams prior to the event." },
    ],
  },
  {
    slug: "codezilla",
    title: "CodeZilla",
    shortDescription: "Annual flagship competitive programming contest testing algorithmic problem solving and speed.",
    description:
      "CodeZilla is ACM BIT Mesra's annual flagship coding contest. Designed along the lines of international collegiate contests, it challenges participants with problems spanning advanced data structures, graph theory, number theory, and dynamic programming.",
    category: "Coding Contest",
    status: "completed",
    date: "2025-02-15",
    time: "18:00 – 21:00 IST",
    location: "Online / Computer Science Lab, BIT Mesra",
    poster: "/images/events/codezilla.svg",
    organizers: ["ACM BIT Mesra CP Wing"],
    tags: ["Competitive Programming", "Algorithms", "DSA", "Codeforces"],
    rules: [
      "Individual participation.",
      "Contest duration is 3 hours.",
      "Strict plagiarism checks will be enforced post-contest; identical submissions will be disqualified.",
    ],
    prizes: [
      { title: "1st Place", reward: "Merit Certificate & Cash Prize", description: "Top individual ranker across all batches." },
      { title: "Top First-Year", reward: "Special Distinction Award", description: "Recognizing outstanding first-year problem solvers." },
    ],
    faqs: [
      { question: "What programming languages are supported?", answer: "C++, C, Java, and Python are supported with standard time and memory limits." },
    ],
  },
  {
    slug: "cqm-autumn-2026",
    title: "Code Quotient Monthly (CQM)",
    shortDescription: "Monthly algorithmic sprint for continuous problem-solving practice and peer benchmarking.",
    description:
      "Code Quotient Monthly is ACM BIT Mesra's recurring internal coding contest series designed to keep students sharp, motivated, and contest-ready throughout the semester.",
    category: "Coding Contest",
    status: "upcoming",
    date: "2026-10-18",
    time: "19:00 – 21:30 IST",
    location: "Online Contest Platform",
    registrationUrl: "/join",
    organizers: ["ACM BIT Mesra Problem Setters"],
    tags: ["Contest", "Monthly", "DSA", "Peer Benchmark"],
    rules: [
      "Standard ACM-ICPC style penalty rules apply.",
      "Submissions evaluated automatically by the judge.",
    ],
  },
  {
    slug: "open-source-sprint-2026",
    title: "Open Source Sprint #01",
    shortDescription: "Hands-on workshop introducing issue triage, branch workflows, pull requests, and maintainership.",
    description:
      "A pragmatic sprint to help students make meaningful open-source contributions. Covers finding beginner-friendly issues, navigating unfamiliar codebases, writing test cases, and following maintainer etiquette.",
    category: "Workshop",
    status: "upcoming",
    date: "2026-10-24",
    time: "14:00 – 17:00 IST",
    location: "Lab 3, Department of CSE, BIT Mesra",
    registrationUrl: "/join",
    organizers: ["ACM BIT Mesra Open Source Wing"],
    tags: ["Open Source", "Git", "GitHub", "Workshop"],
  },
  {
    slug: "icpc-regional-prep-sprint",
    title: "ICPC Regional Preparation Sprint",
    shortDescription: "Team contest simulation with ACM ICPC style team coordination and problem prioritization.",
    description:
      "A simulated 5-hour contest session for 3-person teams aiming for the ICPC Asia-West regionals, emphasizing team dynamics, strategic problem selection, and debugging under pressure.",
    category: "Competition",
    status: "completed",
    date: "2025-11-10",
    time: "10:00 – 15:00 IST",
    location: "Department of CSE, BIT Mesra",
    organizers: ["ACM BIT Mesra ICPC Mentors"],
    tags: ["ICPC", "Team Contest", "Advanced Algorithms"],
  },
];
