export interface ActivityDetail {
  slug: string;
  title: string;
  categoryName: string;
  tagline: string;
  summary: string;
  overview: string[];
  focusAreas: { title: string; description: string }[];
  learningRoadmap: { phase: string; title: string; topics: string[] }[];
  relatedEventSlugs: string[];
  recommendedResourceCategories: string[];
}

export const activitiesData: ActivityDetail[] = [
  {
    slug: "competitive-programming",
    title: "Competitive Programming",
    categoryName: "Algorithmic Problem Solving & ICPC",
    tagline: "Algorithms, mathematical problem solving, contest speed, and ICPC regional preparation.",
    summary:
      "Competitive programming at ACM BIT Mesra is a cornerstone discipline. We foster algorithmic rigor, rapid debugging, and optimal data structure choices to prepare students for global contests, ICPC, and technical assessments.",
    overview: [
      "Competitive programming trains engineers to analyze time and space complexity with extreme precision.",
      "The chapter organizes regular contest simulations, problem-setting workshops, and post-contest editorial discussions.",
      "Members actively compete on Codeforces, CodeChef, AtCoder, and represent BIT Mesra at the ICPC Asia-West regional contests.",
    ],
    focusAreas: [
      { title: "Data Structures & Trees", description: "Segment trees, fenwick trees, disjoint set unions, trie structures, and heavy-light decomposition." },
      { title: "Graph Algorithms", description: "Shortest paths (Dijkstra, Bellman-Ford), spanning trees, bridge/articulation points, and max-flow." },
      { title: "Dynamic Programming", description: "Knapsack variants, bitmask DP, digit DP, tree DP, and convex hull optimizations." },
      { title: "Contest Mathematics", description: "Number theory, modular arithmetic, combinatorics, matrix exponentiation, and game theory." },
    ],
    learningRoadmap: [
      { phase: "Level 01", title: "Language Foundations & STL", topics: ["C++ Fast I/O", "Vectors, Sets, Maps", "Two-Pointers", "Binary Search"] },
      { phase: "Level 02", title: "Core Data Structures & Recursion", topics: ["Stacks & Queues", "Trees & Graphs Traversal", "Greedy Strategies", "Basic DP"] },
      { phase: "Level 03", title: "Advanced Paradigms & Contests", topics: ["Segment Trees", "Shortest Paths", "Bitmask DP", "Codeforces Div. 2/3 Contests"] },
      { phase: "Level 04", title: "ICPC Regional Preparation", topics: ["Team Dynamics", "Tough Problem Prioritization", "Stress Testing", "String Algorithms (KMP, Z)"] },
    ],
    relatedEventSlugs: ["codezilla", "cqm-autumn-2026", "icpc-regional-prep-sprint"],
    recommendedResourceCategories: ["Competitive Programming", "DSA"],
  },
  {
    slug: "hackathons",
    title: "Hackathons & Product Prototyping",
    categoryName: "Rapid Engineering & Team Problem Solving",
    tagline: "Ideate, build, and present end-to-end software and hardware prototypes under time constraints.",
    summary:
      "From hosting Hack-A-Bit to mentoring teams heading to national and global hackathons, this wing develops rapid prototyping instincts, UI/UX execution, and technical presentation skills.",
    overview: [
      "Hackathons challenge participants to transform ambiguous problem statements into functional, deployable systems within 24 to 36 hours.",
      "ACM BIT Mesra guides students through team formation, product scope control, API selection, and effective judging demonstrations.",
      "We encourage multidisciplinary teams combining frontend engineers, systems architects, and product designers.",
    ],
    focusAreas: [
      { title: "System Architecture", description: "Selecting the right lightweight backend, database, and client stack for rapid shipping without bloat." },
      { title: "API & Cloud Integrations", description: "Leveraging cloud edge primitives, modern AI toolkits, auth providers, and payment testbeds." },
      { title: "Interface & UX Design", description: "Delivering intuitive, accessible interfaces that communicate value immediately to evaluators." },
      { title: "Technical Pitching", description: "Presenting architectural decisions, technical trade-offs, and live demos with confidence." },
    ],
    learningRoadmap: [
      { phase: "Phase 01", title: "Idea Validation & Scope", topics: ["Problem statement analysis", "Feature prioritization", "System flow mapping"] },
      { phase: "Phase 02", title: "Fast-Paced Stack Setup", topics: ["Next.js App Router", "Tailwind CSS", "Database schema design", "Authentication"] },
      { phase: "Phase 03", title: "Integration & Testing", topics: ["Third-party APIs", "Edge deployments", "Error handling", "Demo data population"] },
      { phase: "Phase 04", title: "Pitch & Presentation", topics: ["Slide-less live demos", "Architecture diagramming", "Q&A preparation"] },
    ],
    relatedEventSlugs: ["hack-a-bit"],
    recommendedResourceCategories: ["Development", "Career"],
  },
  {
    slug: "workshops",
    title: "Technical Workshops & Learning",
    categoryName: "Foundational CS & Developer Education",
    tagline: "Hands-on, peer-led workshops designed to deepen practical computational understanding.",
    summary:
      "We believe students learn computing best when concepts are built from first principles. Our workshops bridge the gap between classroom theory and industry-grade engineering practices.",
    overview: [
      "Workshops are designed and delivered by senior student developers, alumni, and guest speakers.",
      "Sessions emphasize interactive coding, live demonstrations, and working code over passive slide presentations.",
      "Topics range from modern systems programming and Linux tooling to full-stack web applications and machine learning.",
    ],
    focusAreas: [
      { title: "C++ & Systems Tooling", description: "Memory management, pointers, modern C++ idioms, and profiling tools." },
      { title: "Modern Web Engineering", description: "TypeScript, server-side rendering, component-driven UI, and static edge delivery." },
      { title: "Linux & Shell Mastery", description: "Command-line productivity, shell scripting, process management, and SSH." },
      { title: "Applied Systems", description: "Networking protocols, caching layers, containerization, and build pipelines." },
    ],
    learningRoadmap: [
      { phase: "Foundation", title: "Tooling & Environment Setup", topics: ["Git basics", "VS Code / Neovim configuration", "Terminal navigation", "GitHub"] },
      { phase: "Exploration", title: "Core CS Hands-on", topics: ["Data structure implementation", "HTTP client-server basics", "Database queries"] },
      { phase: "Application", title: "Building a System", topics: ["Full-stack prototype", "Containerization with Docker", "Cloud deployment"] },
    ],
    relatedEventSlugs: ["open-source-sprint-2026"],
    recommendedResourceCategories: ["Development", "Systems", "DSA"],
  },
  {
    slug: "open-source",
    title: "Open Source & Developer Community",
    categoryName: "Public Code, Collaboration & Maintainership",
    tagline: "Contributing to real-world codebases, understanding version control, and building public digital goods.",
    summary:
      "Open source is the bedrock of modern software. We cultivate disciplined git workflows, issue etiquette, documentation standards, and prepare students for programs like Google Summer of Code (GSoC).",
    overview: [
      "Open source teaches collaborative software engineering: reading unfamiliar code, adhering to existing patterns, and handling code reviews.",
      "ACM BIT Mesra maintains open repositories for chapter projects, campus utilities, and event websites.",
      "We run recurring 'first PR' sprints to help newcomers overcome contribution barriers.",
    ],
    focusAreas: [
      { title: "Git & Collaboration", description: "Branching strategies, interactive rebasing, merge conflict resolution, and atomic commits." },
      { title: "Issue Triage & Code Review", description: "Writing reproducible bug reports, drafting RFCs, and conducting constructive peer code reviews." },
      { title: "GSoC & Fellowship Prep", description: "Identifying candidate organizations, communicating with upstream maintainers, and proposal drafting." },
      { title: "Documentation & Testing", description: "Writing maintainable technical documentation, automated tests, and CI/CD pipelines." },
    ],
    learningRoadmap: [
      { phase: "Step 01", title: "Version Control Mastery", topics: ["Git staging, commits, branches", "Pull requests", "Resolving merge conflicts"] },
      { phase: "Step 02", title: "First Upstream Contribution", topics: ["Good first issue discovery", "Setting up local dev environments", "Filing clean PRs"] },
      { phase: "Step 03", title: "Maintainership Habits", topics: ["Issue templates", "CI workflows", "Codebase stewardship", "Writing tests"] },
    ],
    relatedEventSlugs: ["open-source-sprint-2026"],
    recommendedResourceCategories: ["Open Source", "Development"],
  },
  {
    slug: "technical-talks",
    title: "Technical Talks & Research Exposure",
    categoryName: "Industry Insights, Architecture & Research",
    tagline: "Engage with engineers, alumni, and researchers discussing complex distributed systems, AI, and career journeys.",
    summary:
      "Beyond code sprints, technical talks provide perspective. We invite industry practitioners, research scholars, and distinguished BIT Mesra alumni to discuss real engineering trade-offs, research papers, and technology trends.",
    overview: [
      "Sessions offer candid reflections on software architecture, engineering challenges at scale, and graduate research pathways.",
      "Provides direct networking opportunities with alumni across top engineering firms and research labs.",
      "Topics include large-scale systems, AI/ML research breakthroughs, cybersecurity, and open-ended technical discussions.",
    ],
    focusAreas: [
      { title: "Distributed Systems at Scale", description: "Consensus protocols, high-availability architecture, observability, and latency trade-offs." },
      { title: "Machine Learning & AI Research", description: "Paper walkthroughs, foundational model architectures, and practical experiment design." },
      { title: "Career & Research Pathways", description: "Navigating off-campus opportunities, technical interviews, and graduate school admissions." },
    ],
    learningRoadmap: [
      { phase: "Explore", title: "Architecture & Systems", topics: ["Microservices vs Monoliths", "Database indexing", "Caching architectures"] },
      { phase: "Deepen", title: "Research & Specialization", topics: ["Reading CS research papers", "Reproducing experiments", "Emerging technologies"] },
    ],
    relatedEventSlugs: [],
    recommendedResourceCategories: ["Systems", "Career"],
  },
];
