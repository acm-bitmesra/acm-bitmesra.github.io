import { Resource } from "@/types";

export const studentResources: Resource[] = [
  // --- DSA & INTERVIEW MASTERY ---
  {
    title: "AlgoForge — Interactive Pattern-Based Interview Mastery",
    description:
      "A modern, free interview preparation platform featuring curated problem collections (Blind 75, Grind 169), pattern-based roadmaps (Sliding Window, Two Pointers, Monotonic Stack, Dynamic Programming), and multi-language solutions with step-by-step intuition.",
    category: "DSA",
    type: "interactive",
    url: "https://stack-shade.github.io/algoforge/",
    author: "StackShade",
    level: "Intermediate",
    featured: true,
    tags: ["Blind 75", "Grind 169", "Algorithmic Patterns", "Multi-Language", "Interactive Editor"],
    highlights: [
      "14+ Core Algorithmic Patterns (Sliding Window, Two Pointers, etc.)",
      "Interactive code runner with Python, C++, Java, and JavaScript",
      "Curated Blind 75 and Grind 169 practice lists with company tags",
    ],
  },
  {
    title: "Striver's A2Z DSA Course & Problem Sheet",
    description:
      "The definitive 455+ problem step-by-step master curriculum for engineering students. Spans foundational mathematics, arrays, binary search, linked lists, recursion, trees, graphs, and advanced dynamic programming with video lectures and editorial code.",
    category: "DSA",
    type: "roadmap",
    url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
    author: "Raj Vikramaditya (takeUforward)",
    level: "Beginner to Advanced",
    featured: true,
    tags: ["455 Problems", "Step-by-Step", "C++ / Java / Python", "Video Editorials", "DSA Sheet"],
    highlights: [
      "18 structured steps from language basics to advanced tries & DP",
      "Complete editorial videos and optimal time complexity proofs",
      "Standard benchmark sheet used by BIT Mesra students for placements",
    ],
  },
  {
    title: "NeetCode 150 & Interactive DSA Tree",
    description:
      "A structured prerequisite graph of 150 essential LeetCode problems categorized by topic, accompanied by clean video walkthroughs, space-time complexity analysis, and pattern categorization.",
    category: "DSA",
    type: "roadmap",
    url: "https://neetcode.io/roadmap",
    author: "NeetCode",
    level: "Intermediate",
    featured: true,
    tags: ["LeetCode 150", "Visual Prerequisite Graph", "Pattern Grouping", "Video Walkthroughs"],
    highlights: [
      "Prerequisite relationship tree linking arrays to graphs and DP",
      "Concise 5-10 minute algorithmic breakdowns",
      "Interactive checkboxes to track your preparation progress",
    ],
  },
  {
    title: "CSES Problem Set",
    description:
      "The benchmark collection of 300 algorithmic problems curated by Antti Laaksonen at the University of Helsinki. High-density, no-fluff problems covering sorting, searching, DP, graph theory, range queries, and tree algorithms.",
    category: "DSA",
    type: "interactive",
    url: "https://cses.fi/problemset/",
    author: "University of Helsinki",
    level: "Intermediate to Advanced",
    tags: ["300 Problems", "Algorithm Mastery", "No Fluff", "Competitive Programming"],
    highlights: [
      "Zero distracting story text: pure mathematical and algorithmic inputs",
      "Standard training ground for ICPC regional finalists",
      "Covers advanced segment trees, fenwick trees, and tree DP",
    ],
  },
  {
    title: "Blind 75 LeetCode Questions",
    description:
      "The original curated list of 75 algorithmic challenges distilled by tech leads to build core pattern intuition without solving hundreds of repetitive problems.",
    category: "DSA",
    type: "article",
    url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions",
    author: "Yangshun Tay",
    level: "Intermediate",
    tags: ["Blind 75", "High Yield", "FAANG Prep", "LeetCode"],
    highlights: [
      "Highest ROI 75 problems across all algorithmic categories",
      "Detailed breakdown of patterns needed for tech screening rounds",
    ],
  },

  // --- COMPETITIVE PROGRAMMING ---
  {
    title: "USACO Guide",
    description:
      "A free collection of curated, high-quality competitive programming resources from Bronze to Platinum created by former Olympiad finalists. Features comprehensive guides, hints, and practice problems.",
    category: "Competitive Programming",
    type: "course",
    url: "https://usaco.guide/",
    author: "USACO Guide Team",
    level: "Intermediate to Advanced",
    featured: true,
    tags: ["Bronze to Platinum", "Algorithmic Paradigms", "IOI / ICPC", "Practice Sets"],
    highlights: [
      "Four structured divisions: Bronze, Silver, Gold, Platinum",
      "Interactive module completion tracking and community discussion",
      "Covers DP with bitmasks, centroid decomposition, and flow networks",
    ],
  },
  {
    title: "CP-Algorithms (E-Maxx Algorithms)",
    description:
      "The definitive English translation of the E-Maxx algorithms knowledge base. Rigorous mathematical descriptions and verified C++ implementations for number theory, combinatorics, graph theory, and string algorithms.",
    category: "Competitive Programming",
    type: "document",
    url: "https://cp-algorithms.com/",
    author: "CP-Algorithms Community",
    level: "Advanced",
    tags: ["Number Theory", "Graph Algorithms", "Data Structures", "Verified C++"],
    highlights: [
      "Fast Fourier Transform (FFT), Suffix Automaton, Max Flow",
      "Verified, production-grade competitive C++ snippets",
      "Indispensable reference for ACM-ICPC regional teams",
    ],
  },
  {
    title: "AtCoder Educational DP Contest",
    description:
      "26 classic problems (A through Z) designed specifically to build intuition across dynamic programming paradigms: from basic 1D DP to digit DP, tree DP, and matrix exponentiation.",
    category: "Competitive Programming",
    type: "interactive",
    url: "https://atcoder.jp/contests/dp",
    author: "AtCoder",
    level: "Intermediate to Advanced",
    tags: ["Dynamic Programming", "26 DP Paradigms", "Subsequence DP", "Digit DP"],
    highlights: [
      "Gradual difficulty curve from Problem A to Problem Z",
      "Unlocks deep understanding of memoization and state transitions",
    ],
  },
  {
    title: "Codeforces Archive & Ladder Practice",
    description:
      "The world's leading competitive programming contest arena. Practice thousands of rated problems filtered by difficulty rating (800 to 3500) and study peer editorials.",
    category: "Competitive Programming",
    type: "interactive",
    url: "https://codeforces.com/",
    author: "Codeforces Community",
    level: "All Levels",
    tags: ["Contests", "Div 1-4", "Global Rankings", "Editorial Community"],
    highlights: [
      "Bi-weekly live 2-hour rated programming contests",
      "Access to open-source solutions from global Grandmasters",
    ],
  },

  // --- SYSTEMS & ARCHITECTURE ---
  {
    title: "Operating Systems: Three Easy Pieces (OSTEP)",
    description:
      "A freely available, masterpiece university textbook demystifying operating systems through three core pillars: CPU & memory virtualization, concurrency (threads & locks), and persistent storage (file systems).",
    category: "Systems",
    type: "document",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    author: "Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau",
    level: "Intermediate",
    featured: true,
    tags: ["Virtualization", "Concurrency", "Persistence", "Free Textbook", "Kernel"],
    highlights: [
      "Humorous, exceptionally clear explanations with real C code",
      "Homework simulators to visualize paging, TLBs, and thread scheduling",
      "Used as primary OS textbook at UW-Madison and top CS departments",
    ],
  },
  {
    title: "Nand2Tetris: Elements of Computing Systems",
    description:
      "Build a modern general-purpose computer system from first principles. Construct logic gates from NAND, then assemble the ALU, CPU, memory, assembler, compiler, virtual machine, and a multi-tasking OS.",
    category: "Systems",
    type: "course",
    url: "https://www.nand2tetris.org/",
    author: "Noam Nisan & Shimon Schocken",
    level: "Beginner to Intermediate",
    tags: ["Logic Gates", "CPU Architecture", "Assembler", "Compiler", "OS"],
    highlights: [
      "Zero magic: eliminates abstractions from physics to software",
      "Write your own high-level object-based language (Jack)",
      "Build and run a working Tetris game on your custom computer",
    ],
  },
  {
    title: "The Rust Programming Language (The Book)",
    description:
      "The official guide to modern systems programming with Rust. Master memory safety without garbage collection, the borrow checker, ownership, pattern matching, and fearless concurrency.",
    category: "Systems",
    type: "document",
    url: "https://doc.rust-lang.org/book/",
    author: "Steve Klabnik & Carol Nichols",
    level: "Intermediate",
    tags: ["Memory Safety", "Borrow Checker", "Fearless Concurrency", "Systems"],
    highlights: [
      "Complete guide to Rust syntax, lifetimes, and type system",
      "Build a multi-threaded web server step-by-step in the capstone project",
    ],
  },
  {
    title: "Beej's Guide to Network Programming (Sockets)",
    description:
      "The legendary, pragmatic handbook for network programming in C. Covers socket descriptors, IPv4/IPv6 compatibility, getaddrinfo, select/poll multiplexing, and building reliable TCP/UDP network daemons.",
    category: "Systems",
    type: "document",
    url: "https://beej.us/guide/bgnet/",
    author: "Brian 'Beej Jorgensen' Hall",
    level: "Intermediate",
    tags: ["TCP/IP", "Sockets", "C Programming", "Client-Server", "Networking"],
    highlights: [
      "The battle-tested internet socket programming guide since 1995",
      "Real, working C server and client code you can compile immediately",
    ],
  },
  {
    title: "Computer Systems: A Programmer's Perspective (CS:APP)",
    description:
      "Carnegie Mellon's flagship systems text explaining how hardware executes program code: machine-level representations, cache hierarchies, virtual memory, linkers, and concurrency.",
    category: "Systems",
    type: "document",
    url: "https://csapp.cs.cmu.edu/",
    author: "Randal E. Bryant & David R. O'Hallaron (CMU)",
    level: "Advanced",
    tags: ["Hardware-Software Interface", "Machine Code", "Memory Hierarchy", "Linking"],
    highlights: [
      "Teaches programmers how compilers and hardware optimize code",
      "World-famous CMU lab assignments: Data Lab, Bomb Lab, Cache Lab",
    ],
  },

  // --- SYSTEM DESIGN & CLOUD ARCHITECTURE ---
  {
    title: "The System Design Primer",
    description:
      "An immense open-source guide to designing large-scale software systems. Covers performance numbers every engineer should know, CAP theorem, load balancing, caching, sharding, and interview case studies.",
    category: "System Design",
    type: "github",
    url: "https://github.com/donnemartin/system-design-primer",
    author: "Donne Martin",
    level: "Intermediate to Advanced",
    featured: true,
    tags: ["High Scalability", "CAP Theorem", "Microservices", "Caching", "Sharding"],
    highlights: [
      "Over 270,000 GitHub stars; the industry standard for architecture prep",
      "Visual diagrams for Twitter feed design, Pastebin, and web crawlers",
      "Includes flashcards and quantitative capacity planning formulas",
    ],
  },
  {
    title: "Designing Data-Intensive Applications (DDIA)",
    description:
      "Martin Kleppmann's definitive guide to modern data architectures: relational vs document models, storage engines (LSM-trees vs B-trees), distributed transactions, consensus (Raft/Paxos), and event streaming.",
    category: "System Design",
    type: "document",
    url: "https://dataintensive.net/",
    author: "Martin Kleppmann (Cambridge University)",
    level: "Advanced",
    tags: ["Distributed Systems", "Replication", "Partitioning", "Transactions", "Consensus"],
    highlights: [
      "Unrivaled technical depth on reliable, scalable software architectures",
      "Required reading for senior backend and infrastructure engineers",
    ],
  },
  {
    title: "ByteByteGo System Design Architecture",
    description:
      "Clear, beautifully illustrated architecture breakdowns explaining how production services like YouTube, Google Drive, WhatsApp, Stripe, and Discord manage scale and fault tolerance.",
    category: "System Design",
    type: "article",
    url: "https://bytebytego.com/",
    author: "Alex Xu",
    level: "Intermediate",
    tags: ["Visual Architecture", "API Design", "Rate Limiters", "Distributed Cache"],
    highlights: [
      "Intuitive visual infographics dissecting complex distributed workflows",
      "Step-by-step framework to approach system design interviews",
    ],
  },

  // --- DEVELOPMENT & OPEN SOURCE ---
  {
    title: "MIT Missing Semester of Your CS Education",
    description:
      "MIT CSAIL's practical course covering the essential software tooling that standard college curricula omit: shell scripting, Vim, Git version control, SSH, build systems, debugging, and profiling.",
    category: "Development",
    type: "course",
    url: "https://missing.csail.mit.edu/",
    author: "MIT CSAIL",
    level: "Beginner to Intermediate",
    featured: true,
    tags: ["Command Line", "Vim", "Git & Version Control", "Bash Scripting", "Debugging"],
    highlights: [
      "High-production video lectures and interactive terminal assignments",
      "Dramatically improves everyday developer ergonomics and productivity",
      "Essential foundation for any first-year computer science student",
    ],
  },
  {
    title: "First Contributions Open Source Workflow",
    description:
      "A hands-on, step-by-step tutorial to learn the Git & GitHub open-source contribution workflow in under 10 minutes. Fork, clone, branch, edit, and open your first pull request.",
    category: "Open Source",
    type: "github",
    url: "https://github.com/firstcontributions/first-contributions",
    author: "Roshan Jossey & Contributors",
    level: "Beginner",
    tags: ["Git Forks", "Pull Requests", "Upstream Sync", "Open Source Etiquette"],
    highlights: [
      "Translated into 40+ languages with automated PR validation",
      "Perfect warm-up before contributing to Hacktoberfest and ACM repos",
    ],
  },
  {
    title: "Developer Roadmaps (roadmap.sh)",
    description:
      "Community-driven visual roadmaps, study guides, and skill trees for Frontend, Backend, DevOps, AI Engineers, and Cybersecurity. Follow structured milestones to master any tech stack.",
    category: "Development",
    type: "interactive",
    url: "https://roadmap.sh/",
    author: "Kamran Ahmed & Community",
    level: "All Levels",
    tags: ["Frontend", "Backend", "DevOps", "AI Engineer", "Cybersecurity"],
    highlights: [
      "Visual skill trees with recommended articles and exercises per node",
      "Tracks modern web standards, containerization, and cloud primitives",
    ],
  },
  {
    title: "The Linux Command Line (TLCL)",
    description:
      "A comprehensive, freely readable textbook by William Shotts taking you from introductory terminal usage to writing robust, production-grade bash automation scripts.",
    category: "Development",
    type: "document",
    url: "https://linuxcommand.org/tlcl.php",
    author: "William Shotts",
    level: "Beginner to Intermediate",
    tags: ["Bash Shell", "Pipelines", "Process Control", "Scripting", "Permissions"],
    highlights: [
      "Master standard UNIX pipeline composition (grep, sed, awk, xargs)",
      "Essential for cloud deployment, server administration, and automation",
    ],
  },

  // --- ARTIFICIAL INTELLIGENCE & MACHINE LEARNING ---
  {
    title: "Practical Deep Learning for Coders",
    description:
      "Fast.ai's code-first introduction to deep learning led by Jeremy Howard. Train state-of-the-art vision, NLP, and tabular models in PyTorch from lesson one without requiring a PhD in mathematics.",
    category: "AI & Machine Learning",
    type: "course",
    url: "https://course.fast.ai/",
    author: "Jeremy Howard (Fast.ai)",
    level: "Beginner to Intermediate",
    featured: true,
    tags: ["PyTorch", "Computer Vision", "NLP", "Top-Down Learning", "Kaggle"],
    highlights: [
      "Top-down pedagogy: build functioning models before dissecting calculus",
      "Teaches practical tricks for fast convergence, transfer learning, and deployment",
    ],
  },
  {
    title: "Neural Networks: Zero to Hero",
    description:
      "Andrej Karpathy's acclaimed video series building deep learning foundations from absolute scratch in Python: from writing a micrograd autograd engine to implementing the complete GPT-2 transformer architecture.",
    category: "AI & Machine Learning",
    type: "video",
    url: "https://karpathy.ai/zero-to-hero.html",
    author: "Andrej Karpathy",
    level: "Intermediate",
    featured: true,
    tags: ["Micrograd", "Autograd Engine", "GPT from Scratch", "Backpropagation"],
    highlights: [
      "Crystal-clear mathematical intuition for backpropagation and tensors",
      "Build Makemore, BatchNorm, WaveNet, and complete GPT language models",
    ],
  },
  {
    title: "Hugging Face Open Learning Hub",
    description:
      "Free hands-on interactive courses by Hugging Face covering the Transformers library, open-weight LLMs, diffusion models, speech processing, and deep reinforcement learning.",
    category: "AI & Machine Learning",
    type: "course",
    url: "https://huggingface.co/learn",
    author: "Hugging Face",
    level: "Intermediate to Advanced",
    tags: ["Transformers", "Open-Weight Models", "Diffusion", "Fine-Tuning", "NLP"],
    highlights: [
      "Hands-on Google Colab notebooks using modern open models",
      "Learn tokenization, LoRA fine-tuning, quantization, and evaluation",
    ],
  },

  // --- CORE FOUNDATIONS & CAREER ---
  {
    title: "CS50x: Introduction to Computer Science",
    description:
      "Harvard University's flagship introductory course. Demystifies computational thinking, algorithmic complexity, memory management in C, Python, SQL, HTML/CSS, and web engineering.",
    category: "Foundations",
    type: "course",
    url: "https://cs50.harvard.edu/x/",
    author: "David J. Malan (Harvard University)",
    level: "Beginner",
    tags: ["C", "Memory & Pointers", "Algorithms", "Python", "SQL", "Web"],
    highlights: [
      "Legendary teaching style by Prof. David Malan with engaging problem sets",
      "Rigorous hands-on C assignments on pointers, memory allocation, and hashes",
    ],
  },
  {
    title: "Teach Yourself Computer Science",
    description:
      "A curated guide for self-taught software engineers and CS undergraduates seeking a rigorous university-equivalent curriculum across the 9 core subjects of computer science.",
    category: "Foundations",
    type: "article",
    url: "https://teachyourselfcs.com/",
    author: "Bradfield School of Computer Science",
    level: "Intermediate",
    tags: ["9 Core CS Subjects", "Self-Taught Degree", "Books & Lectures", "No Fluff"],
    highlights: [
      "Picks the single best textbook and video lecture series for each subject",
      "Covers Programming, Architecture, Algorithms, Math, OS, Networks, DBs, Compilers, Distributed",
    ],
  },
  {
    title: "Tech Interview Handbook",
    description:
      "Pragmatic coding interview preparation guide covering technical screening questions, algorithmic pattern cheatsheets, resume building, and behavioral interview strategies.",
    category: "Career",
    type: "article",
    url: "https://www.techinterviewhandbook.org/",
    author: "Yangshun Tay",
    level: "Intermediate",
    tags: ["Resume Guide", "Coding Patterns", "Behavioral Interview", "Negotiation"],
    highlights: [
      "Non-trivial advice for software engineering interviews",
      "High-yield algorithm cheatsheets and system design guidelines",
    ],
  },
];
