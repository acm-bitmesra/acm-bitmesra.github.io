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
    registrationOpen: true,
    registrationStatusText: "Registration Open",
    registrationHelperText:
      "Registrations are officially open! Connect your GitHub account and register to submit your contributions and track your live standing.",
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
        question: "How do I register for the ACM BIT Mesra Hacktoberfest challenge?",
        answer:
          "Registrations are officially OPEN! Sign in with your university account, connect your GitHub profile, and click 'Register for Hacktoberfest 2026' to start tracking your open-source contributions and compete on the live rankings leaderboard.",
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
    exploreLinks: [
      {
        title: "Official Hacktoberfest Website",
        description:
          "Visit the global home of Hacktoberfest to learn about the worldwide open-source initiative, themes, values, and community activities.",
        url: "https://hacktoberfest.com/",
        label: "Visit hacktoberfest.com",
      },
      {
        title: "HF26 DEV Challenge Hub",
        description:
          "Explore the official Hacktoberfest 2026 weekly prompts, open-weight AI challenges, and community showcases on DEV.",
        url: "https://dev.to/challenges/hf26",
        label: "Explore on dev.to",
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
    title: "Cybersecurity & Ethical Hacking Workshop 2026",
    shortDescription:
      "Hands-on intensive workshop exploring offensive security methodologies, defensive system hardening, OWASP Top 10 web vulnerabilities, and live CTF challenges.",
    description:
      "ACM BIT Mesra presents the 2026 Cybersecurity & Ethical Hacking Workshop — an in-depth hybrid training program featuring in-person opening and three evening classes at BIT Mesra, followed by advanced online guided practice and CTF labs. Designed for students aspiring toward offensive and defensive security careers, this workshop combines instructor-led demonstrations with hands-on lab environments.",
    category: "Workshop",
    status: "upcoming",
    date: "2026-10-27",
    endDate: "2026-10-31",
    dateTba: false,
    time: "Inauguration: 18:00 IST | Evening Classes: 6:00 – 7:30 PM IST",
    location: "CAT Hall (Inauguration) · In-Person & Online Hybrid, BIT Mesra",
    organizers: ["ACM Student Chapter, BIT Mesra", "ACM CyberSec Wing"],
    isFeatured: true,
    registrationOpen: true,
    registrationStatusText: "Registrations Open",
    registrationHelperText:
      "Registrations are officially open to all BIT Mesra students! Sign in with your university account to secure your lab seat.",
    registrationUrl: "/events/cybersecurity-workshop-2026",
    maxParticipants: 80,
    tags: [
      "Cybersecurity",
      "Ethical Hacking",
      "OWASP",
      "Network Security",
      "CTF",
      "Cryptography",
      "Workshop",
    ],
    about: [
      "The Cybersecurity Workshop is crafted by ACM BIT Mesra to bridge theoretical computer network knowledge with realistic offensive and defensive operations.",
      "The program begins with an in-person opening at CAT Hall and three evening classes on campus, followed by weekly online labs and guided challenges on PortSwigger Academy, Bandit, picoCTF, and OWASP Juice Shop.",
      "All exercises adhere strictly to ethical guidelines and are conducted in closed, authorized laboratory environments for education only.",
    ],
    workshopSchedule: [
      {
        date: "27 Oct 2026",
        day: "Tuesday",
        time: "18:00 IST (6:00 PM)",
        activity: "Opening / Inauguration",
        format: "In-person",
        venue: "CAT Hall, BIT Mesra",
        notes: "Workshop opening",
        topicsCovered: "Workshop roadmap; cybersecurity learning goals; ethical and legal boundaries",
        handsOn: "Orientation, participant expectations and overview of in-person-to-online plan",
      },
      {
        date: "28 Oct 2026",
        day: "Wednesday",
        time: "6:00 – 7:30 PM IST",
        activity: "Day 1: Cybersecurity foundations, ethics & Linux basics",
        format: "In-person",
        venue: "To be confirmed, BIT Mesra",
        notes: "90-minute class",
        topicsCovered: "CIA triad; threats, vulnerabilities and risk; phishing and social engineering; password safety and MFA; Linux shell basics",
        handsOn: "Spot red flags in sample phishing messages; practise safe terminal commands; beginner Linux challenge",
      },
      {
        date: "29 Oct 2026",
        day: "Thursday",
        time: "6:00 – 7:30 PM IST",
        activity: "Day 2: Networking, HTTP, crypto & password security",
        format: "In-person",
        venue: "To be confirmed, BIT Mesra",
        notes: "90-minute class",
        topicsCovered: "IP addresses, ports, TCP/IP, DNS, OSI vs TCP/IP; HTTP vs HTTPS; requests, responses, cookies and headers",
        handsOn: "Inspect a sample browser request with DevTools; basic networking/terminal exercises; guided CTF task",
      },
      {
        date: "30 Oct 2026",
        day: "Friday",
        time: "6:00 – 7:30 PM IST",
        activity: "Day 3: Web security, guided lab & mini-CTF",
        format: "In-person",
        venue: "To be confirmed, BIT Mesra",
        notes: "90-minute class",
        topicsCovered: "Authentication vs authorization; web app security; SQL injection and access-control concepts; responsible testing and remediation",
        handsOn: "Guided lab on a deliberately vulnerable training app; mini-CTF in pairs; write up one finding and its fix",
      },
      {
        date: "From 31 Oct 2026",
        day: "Saturday onward",
        time: "To be announced",
        activity: "Online classes and guided practice",
        format: "Online",
        venue: "Online Sandbox & Virtual Labs",
        notes: "Follow-up schedule will be shared separately",
        topicsCovered: "Linux and networking practice; web vulnerabilities (SQL injection, XSS, access control); CTF problem-solving; basic crypto/forensics as the course progresses",
        handsOn: "Weekly online lab challenges, hints and write-ups; follow-up projects using Bandit, picoCTF, PortSwigger Academy and OWASP Juice Shop",
      },
    ],
    timelineItems: [
      {
        date: "27 Oct 2026 (Tue), 18:00 IST",
        title: "Workshop Opening / Inauguration",
        status: "Confirmed",
        description:
          "In-person opening at CAT Hall. Overview of workshop roadmap, ethical boundaries, participant expectations, and transition plan to online modules.",
      },
      {
        date: "28 Oct 2026 (Wed), 18:00 – 19:30 IST",
        title: "Day 1: Foundations, Ethics & Linux Basics",
        status: "Confirmed",
        description:
          "90-minute in-person session covering the CIA triad, threat modeling, phishing recognition, password hygiene, and hands-on Linux CLI drills.",
      },
      {
        date: "29 Oct 2026 (Thu), 18:00 – 19:30 IST",
        title: "Day 2: Networking, HTTP, Crypto & Password Security",
        status: "Confirmed",
        description:
          "90-minute in-person session analyzing TCP/IP, OSI, HTTP headers, DevTools packet inspection, cryptographic fundamentals, and guided CTF exercises.",
      },
      {
        date: "30 Oct 2026 (Fri), 18:00 – 19:30 IST",
        title: "Day 3: Web Security, Guided Lab & Mini-CTF",
        status: "Confirmed",
        description:
          "90-minute in-person session covering OWASP Top 10 web vulnerabilities, SQL injection, access control bypasses, and paired mini-CTF lab challenge.",
      },
      {
        date: "From 31 Oct 2026 onward",
        title: "Online Classes & Guided Practice Labs",
        status: "Confirmed",
        description:
          "Self-paced and guided online CTF tracks on OverTheWire Bandit, picoCTF, PortSwigger Web Security Academy, and OWASP Juice Shop with community hints and write-ups.",
      },
    ],
    faqs: [
      {
        question: "Who is eligible to participate?",
        answer:
          "All undergraduate, postgraduate, and research scholars from BIT Mesra with an active university account are eligible to attend.",
      },
      {
        question: "Do I need prior hacking or CTF experience?",
        answer:
          "No prior cybersecurity experience is required. Basic understanding of Linux terminal commands and networking concepts is helpful, and complete beginners are warmly welcomed.",
      },
      {
        question: "What should I bring to the workshop?",
        answer:
          "Bring your laptop with a working browser and Wi-Fi capability. Setup guides for Kali Linux VMs or Docker environments will be sent prior to the event.",
      },
      {
        question: "Is there any registration fee?",
        answer:
          "No. The workshop is completely free of charge, organized by ACM BIT Mesra for the student developer community.",
      },
      {
        question: "Will participants receive certificates?",
        answer:
          "Yes, verified digital participation certificates will be awarded to all attendees who complete the hands-on lab challenges.",
      },
    ],
    rules: [
      "Participants must bring their own laptop with Wi-Fi capability.",
      "All penetration testing must be performed strictly within the designated target sandboxes.",
      "Adherence to the ACM Code of Ethics and BIT Mesra Lab Policy is mandatory at all times.",
    ],
    prizes: [
      {
        title: "CTF Winner (1st Place)",
        reward: "Certificate of Excellence + Swag Kit",
        description: "Top individual scorer on the Day 2 Jeopardy CTF leaderboard.",
      },
      {
        title: "Runner-Up (2nd Place)",
        reward: "Certificate of Distinction + Goodies",
        description: "Second highest CTF flag solver.",
      },
      {
        title: "Active Contributors",
        reward: "Participation Certificates",
        description: "Awarded to all students completing hands-on laboratory checkpoints.",
      },
    ],
    exploreLinks: [
      {
        title: "Official Workshop Poster & Promo Assets",
        description:
          "Expert-led hybrid poster — view and share the conference-style official announcement creative for ACM BIT Mesra.",
        url: "https://www.canva.com/",
        label: "Open conference-style poster in Canva",
      },
      {
        title: "OverTheWire: Bandit Wargame Sandbox",
        description:
          "Practice foundational Linux command line ergonomics, SSH connections, file permissions, and directory traversal.",
        url: "https://overthewire.org/wargames/bandit/",
        label: "Explore Bandit Labs",
      },
      {
        title: "PortSwigger Web Security Academy",
        description:
          "Free online interactive web security training and hands-on labs covering SQL injection, authentication bypasses, XSS, and CSRF.",
        url: "https://portswigger.net/web-security",
        label: "Explore PortSwigger Academy",
      },
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
