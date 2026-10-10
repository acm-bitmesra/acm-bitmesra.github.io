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
      "Registrations for the ACM Hacktoberfest Challenge will open soon. You can start contributing right now, before registrations open. Focus on contributing; you may register anytime.",
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
      "ACM BIT Mesra is proud to host a dedicated challenge during this season to empower campus developers, researchers, and creators to build impactful software together. You can contribute to the event's recommended open-source projects or choose any public project maintained by ACM BIT Mesra on https://github.com/acm-bitmesra/.",
      "You don't need to wait for registrations to open. Start contributing now and focus on making meaningful contributions; you may register anytime.",
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
    recommendedRepos: [
      {
        name: "acm-bitmesra/NexHound",
        url: "https://github.com/acm-bitmesra/NexHound",
        description:
          "ACM BIT Mesra's lightweight, Linux-first system diagnostics and network troubleshooting CLI. Improve it through documentation, tests, developer experience, and carefully scoped features.",
        category: "Internal ACM Projects",
        stars: "ACM",
        language: "Go",
        goodFor: "Good first contributions include installer/docs improvements, POSIX shell portability, Go tests, help text, and small, reviewed CLI features. This project is early-stage, so check the README and roadmap before picking work.",
        issuesUrl: "https://github.com/acm-bitmesra/NexHound/issues",
        tags: ["ACM BIT Mesra", "Go", "Linux", "CLI", "Internal Project", "Hacktoberfest"],
      },
      {
        name: "acm-bitmesra/dev-net-audit",
        url: "https://github.com/acm-bitmesra/dev-net-audit",
        description:
          "ACM BIT Mesra's local-first, read-only network exposure auditor for developer machines. It explains which services are listening, how they are bound, and what defensive checks are worth reviewing.",
        category: "Internal ACM Projects",
        stars: "ACM",
        language: "Go",
        goodFor: "Go unit tests, the Linux listener collector, binding-scope edge cases, CLI help text, and learner-friendly networking docs. The project is in early development, so read the README and project status before picking work.",
        issuesUrl: "https://github.com/acm-bitmesra/dev-net-audit/issues",
        tags: ["ACM BIT Mesra", "Go", "Networking", "Security", "Internal Project", "Hacktoberfest"],
      },
      {
        name: "huggingface/transformers",
        url: "https://github.com/huggingface/transformers",
        description:
          "The foundational model-definition framework for state-of-the-art machine learning in text, vision, audio, and multimodal AI.",
        category: "AI & Open-Weight Models",
        stars: "167k+",
        language: "Python",
        goodFor: "PyTorch & Flax model pipelines, model card docs, unit tests, and tokenizer improvements.",
        issuesUrl: "https://github.com/huggingface/transformers/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+First+Issue%22",
        tags: ["Machine Learning", "Transformers", "PyTorch", "Hacktoberfest"],
      },
      {
        name: "eosphoros-ai/DB-GPT",
        url: "https://github.com/eosphoros-ai/DB-GPT",
        description:
          "Open-source agentic AI data assistant combining multi-agent frameworks, local LLMs, and private RAG data engines.",
        category: "AI & Open-Weight Models",
        stars: "20k+",
        language: "Python",
        goodFor: "Agent workflow plugins, database connectors, local model evaluations, and prompt schemas.",
        issuesUrl: "https://github.com/eosphoros-ai/DB-GPT/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22",
        tags: ["Agentic AI", "Multi-Agent", "RAG", "Local LLM"],
      },
      {
        name: "arc53/DocsGPT",
        url: "https://github.com/arc53/DocsGPT",
        description:
          "Open-source platform to chat with project documentation, source code, and knowledge bases using local models and vector search.",
        category: "AI & Open-Weight Models",
        stars: "18k+",
        language: "Python / TypeScript",
        goodFor: "Next.js frontend fixes, FastAPI backend endpoints, document parsers, and vector store connectors.",
        issuesUrl: "https://github.com/arc53/DocsGPT/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22",
        tags: ["Document QA", "RAG", "Next.js", "FastAPI"],
      },
      {
        name: "srbhr/Resume-Matcher",
        url: "https://github.com/srbhr/Resume-Matcher",
        description:
          "Open-source AI tool for parsing resumes and comparing them against job descriptions locally with 100+ LLMs.",
        category: "AI & Open-Weight Models",
        stars: "28k+",
        language: "Python",
        goodFor: "Text processing pipelines, Streamlit / React UI enhancements, and local inference testing.",
        issuesUrl: "https://github.com/srbhr/Resume-Matcher/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22",
        tags: ["NLP", "Local Inference", "FastAPI", "Open-Weight"],
      },
      {
        name: "Avaiga/taipy",
        url: "https://github.com/Avaiga/taipy",
        description:
          "High-performance Python framework that turns data and AI algorithms into production-ready web apps without frontend overhead.",
        category: "AI & Open-Weight Models",
        stars: "19k+",
        language: "Python",
        goodFor: "UI widgets, chart components, pipeline tutorial examples, and developer documentation.",
        issuesUrl: "https://github.com/Avaiga/taipy/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22",
        tags: ["Data Science", "Python", "Web Apps", "Pipelines"],
      },
      {
        name: "excalidraw/excalidraw",
        url: "https://github.com/excalidraw/excalidraw",
        description:
          "Virtual collaborative whiteboard for sketching hand-drawn like diagrams and system architecture designs.",
        category: "Developer Tools & Full-Stack",
        stars: "133k+",
        language: "TypeScript",
        goodFor: "React UI components, Canvas API optimizations, keyboard shortcut ergonomics, and i18n translations.",
        issuesUrl: "https://github.com/excalidraw/excalidraw/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22",
        tags: ["React", "TypeScript", "Canvas", "UI/UX"],
      },
      {
        name: "Stirling-Tools/Stirling-PDF",
        url: "https://github.com/Stirling-Tools/Stirling-PDF",
        description:
          "Robust locally-hosted web application that lets you perform PDF merging, splitting, OCR, and conversions with zero data tracking.",
        category: "Developer Tools & Full-Stack",
        stars: "93k+",
        language: "Java / Web",
        goodFor: "Frontend layout polishing, accessibility, Spring Boot backend routes, and language translations.",
        issuesUrl: "https://github.com/Stirling-Tools/Stirling-PDF/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22",
        tags: ["Java", "Spring Boot", "Privacy", "Web App"],
      },
      {
        name: "twentyhq/twenty",
        url: "https://github.com/twentyhq/twenty",
        description:
          "The modern, fast open-source CRM alternative designed from the ground up with native AI capabilities and extensible GraphQL.",
        category: "Developer Tools & Full-Stack",
        stars: "58k+",
        language: "TypeScript",
        goodFor: "React components, GraphQL query extensions, NestJS server modules, and UI animations.",
        issuesUrl: "https://github.com/twentyhq/twenty/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22",
        tags: ["TypeScript", "GraphQL", "CRM", "Full-Stack"],
      },
      {
        name: "asyncapi/studio",
        url: "https://github.com/asyncapi/studio",
        description:
          "Interactive visual editor and designer for Event-Driven APIs based on the open AsyncAPI specification.",
        category: "Developer Tools & Full-Stack",
        stars: "1k+",
        language: "TypeScript",
        goodFor: "Monaco editor adjustments, UI bugfixes, parser schema validations, and GSoC contribution prep.",
        issuesUrl: "https://github.com/asyncapi/studio/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22",
        tags: ["AsyncAPI", "Event-Driven", "TypeScript", "Developer Tool"],
      },
      {
        name: "acm-bitmesra/acm-bitmesra.github.io",
        url: "https://github.com/acm-bitmesra/acm-bitmesra.github.io",
        description:
          "The official ACM Student Chapter platform at BIT Mesra. Built with Next.js 15, Tailwind CSS, Neon PostgreSQL, and Cloudflare Workers.",
        category: "Internal ACM Projects",
        stars: "ACM",
        language: "TypeScript",
        goodFor: "Chapter contributors, adding guides, improving responsive UI, fixing accessibility, and documentation.",
        issuesUrl: "https://github.com/acm-bitmesra/acm-bitmesra.github.io/issues",
        tags: ["ACM BIT Mesra", "Next.js", "Tailwind CSS", "TypeScript", "Internal Project", "Hacktoberfest"],
      },
      {
        name: "TheAlgorithms/Python",
        url: "https://github.com/TheAlgorithms/Python",
        description:
          "Comprehensive collection of fundamental data structures, graph algorithms, and numerical methods implemented cleanly in Python.",
        category: "Algorithms & First Contributions",
        stars: "225k+",
        language: "Python",
        goodFor: "Data structure implementations, strict PEP8 typing annotations, doctests, and algorithmic complexity docs.",
        issuesUrl: "https://github.com/TheAlgorithms/Python/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22",
        tags: ["Algorithms", "Data Structures", "Python", "DSA"],
      },
      {
        name: "firstcontributions/first-contributions",
        url: "https://github.com/firstcontributions/first-contributions",
        description:
          "The world-renowned hands-on project that guides complete beginners through making their very first GitHub pull request.",
        category: "Algorithms & First Contributions",
        stars: "45k+",
        language: "Markdown / Git",
        goodFor: "First-time Git contributors practicing branching, forking, pushing, and PR opening without fear of breaking anything.",
        issuesUrl: "https://github.com/firstcontributions/first-contributions/issues",
        tags: ["Beginners", "Git", "First PR", "Tutorial"],
      },
      {
        name: "freeCodeCamp/freeCodeCamp",
        url: "https://github.com/freeCodeCamp/freeCodeCamp",
        description:
          "Open source community curriculum and codebase helping millions around the world learn to code for free.",
        category: "Algorithms & First Contributions",
        stars: "400k+",
        language: "TypeScript / JS",
        goodFor: "Curriculum challenges, accessibility, bugfixes, test cases, and global language translations.",
        issuesUrl: "https://github.com/freeCodeCamp/freeCodeCamp/issues?q=is%3Aissue+is%3Aopen+label%3A%22first-timers-only%22",
        tags: ["JavaScript", "Education", "Curriculum", "Web Dev"],
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
    slug: "cybersecurity-workshop-2026",
    title: "Cybersecurity Workshop",
    shortDescription:
      "Upcoming hands-on workshop on cybersecurity fundamentals. Date, venue, speakers, and registration details will be announced soon.",
    description:
      "ACM BIT Mesra is organizing an upcoming hands-on cybersecurity workshop for students who want to understand how systems are attacked and, more importantly, how to defend them.\n\nThe date, venue, speakers, session plan, and registration details will be announced on this event page.",
    category: "Workshop",
    status: "upcoming",
    date: "2026-11-30",
    dateTba: true,
    time: "To Be Announced",
    location: "To Be Announced",
    organizers: ["ACM BIT Mesra"],
    registrationOpen: false,
    registrationStatusText: "Registration Opening Soon",
    registrationHelperText:
      "Registration details for the Cybersecurity Workshop will be announced soon. Stay tuned to this page for updates.",
    tags: ["Cybersecurity", "Security", "Workshop", "Hands-on"],
    about: [
      "This workshop is planned as a practical introduction to cybersecurity, focused on building a defensive mindset through hands-on learning.",
      "All sessions are intended for learning and ethical, authorized practice only.",
      "Full details, including the date, venue, speakers, prerequisites, and registration, will be published on this page once confirmed.",
    ],
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
