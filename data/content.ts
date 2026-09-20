export type ProjectStatus = 'IDEA' | 'RESEARCH' | 'PROTOTYPE' | 'DEVELOPMENT' | 'PILOT' | 'DEPLOYED' | 'MAINTENANCE';

export interface Project {
  slug: string;
  number: string;
  title: string;
  short: string;
  problem: string;
  goal: string;
  features: string[];
  stack: string[];
  status: ProjectStatus;
  accent: string;
}

export interface EventItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  tags: string[];
  status: 'UPCOMING' | 'ARCHIVED' | 'PLANNED';
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  readingTime: string;
}

export const nav = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Events', href: '/events' },
  { label: 'Community', href: '/community' },
  { label: 'Open Source', href: '/open-source' },
  { label: 'Research', href: '/research' },
  { label: 'Resources', href: '/resources' },
  { label: 'Blog', href: '/blog' },
  { label: 'Team', href: '/team' },
];

export const projects: Project[] = [
  {
    slug: 'campus-security-platform', number: '01', title: 'Campus Security Platform',
    short: 'A digital workflow for lost & found cycles, IDs, belongings, notices, claims, and security-office operations.',
    problem: 'Security-office information can become fragmented across registers, messages, and manual follow-ups, making it harder to search, verify, and close cases.',
    goal: 'Turn fragmented security processes into a traceable workflow with clear ownership, status, search, and auditability.',
    features: ['Lost & found cycle tracking', 'Lost ID and belongings records', 'Security notices', 'Item verification', 'Search and status tracking', 'Claim workflows', 'Security-office dashboard', 'Notifications and analytics'],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Role-based access'],
    status: 'IDEA', accent: 'SECURITY'
  },
  {
    slug: 'institute-fest-platform', number: '02', title: 'Institute Fest Platform',
    short: 'Reusable infrastructure for BITOTSAV, Pantheon, and future institute events—built once, extended by every new team.',
    problem: 'Fest websites are often rebuilt under time pressure, duplicating registration, schedule, announcements, volunteer, sponsor, and result workflows.',
    goal: 'Create a reusable event platform where students can contribute components, content, and features instead of starting from zero.',
    features: ['Event websites', 'Registration', 'Schedules', 'Leaderboards', 'Announcements', 'Volunteer management', 'Participant dashboards', 'Results and sponsor modules'],
    stack: ['Next.js', 'TypeScript', 'MDX', 'GitHub'],
    status: 'RESEARCH', accent: 'EVENTS'
  },
  {
    slug: 'smart-attendance', number: '03', title: 'Smart Attendance',
    short: 'Institution-approved attendance workflows that prioritize consent, access control, audit logs, and data minimization.',
    problem: 'Attendance can require repeated manual work and can become difficult to audit at scale.',
    goal: 'Explore QR, student-ID, fingerprint, and other approved identity signals without assuming biometric recognition is always appropriate.',
    features: ['Faculty dashboard', 'Class management', 'Student management', 'Attendance records', 'Reports', 'Analytics', 'Audit logs', 'Privacy-first controls'],
    stack: ['Next.js', 'TypeScript', 'Web APIs', 'Secure identity layer'],
    status: 'RESEARCH', accent: 'IDENTITY'
  },
  {
    slug: 'digital-hostel-food-coupon', number: '04', title: 'Digital Hostel Food Coupon',
    short: 'A transparent digital coupon workflow for hostel food allocation, verification, usage tracking, and reporting.',
    problem: 'Paper or manual coupon systems can create avoidable queues, reconciliation work, and unclear usage records.',
    goal: 'Reduce manual handling while keeping student verification, hostel-wise allocation, and reporting transparent.',
    features: ['Digital food coupons', 'Hostel-wise management', 'Mess management', 'QR / ID verification', 'Daily allocation', 'Usage tracking', 'Reports', 'Admin dashboard'],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'QR'],
    status: 'IDEA', accent: 'HOSTEL'
  },
  {
    slug: 'lost-id-finder-system', number: '05', title: 'Lost ID / Finder System',
    short: 'A central matching and verification workflow for lost IDs, found IDs, finder submissions, and safe claims.',
    problem: 'Found IDs and lost-ID reports can remain disconnected, delaying matching and verification.',
    goal: 'Create a privacy-conscious matching workflow that reduces friction without exposing unnecessary student information.',
    features: ['Lost ID records', 'Found IDs', 'Student verification', 'Finder submission', 'Matching', 'Notifications', 'Claim verification'],
    stack: ['Next.js', 'TypeScript', 'Institutional identity', 'QR'],
    status: 'IDEA', accent: 'IDENTITY'
  }
];

export const sigs = [
  { slug: 'web-product', name: 'Web & Product', description: 'Frontend, backend, SaaS, UI/UX, and product engineering.', activities: ['Build nights', 'Design critiques', 'Product teardown sessions'], projects: ['Fest Platform'], opportunities: ['Frontend', 'Backend', 'Design', 'Product'] },
  { slug: 'ai-data', name: 'AI & Data', description: 'Machine learning, AI, data science, NLP, and computer vision.', activities: ['Paper reading', 'Model experiments', 'Data labs'], projects: ['Smart Attendance research'], opportunities: ['ML', 'Data', 'NLP', 'CV'] },
  { slug: 'competitive-programming', name: 'Competitive Programming', description: 'DSA, algorithms, contests, and interview preparation.', activities: ['Problem-solving sprints', 'Contest reviews', 'DSA study groups'], projects: [], opportunities: ['DSA', 'Algorithms', 'Mentoring'] },
  { slug: 'open-source', name: 'Open Source', description: 'GitHub, OSS contributions, GSoC-style preparation, and maintainership.', activities: ['Issue triage', 'OSS sprints', 'Maintainer sessions'], projects: ['ACM chapter infrastructure'], opportunities: ['Code', 'Docs', 'Review'] },
  { slug: 'cybersecurity', name: 'Cybersecurity', description: 'Web security, CTFs, secure systems, and ethical hacking.', activities: ['CTF practice', 'Threat-model workshops', 'Secure coding labs'], projects: ['Security Platform'], opportunities: ['Security', 'CTF', 'AppSec'] },
  { slug: 'systems-research', name: 'Systems & Research', description: 'Operating systems, networks, distributed systems, and research projects.', activities: ['Research reading', 'Systems labs', 'Experiment reviews'], projects: ['Campus infrastructure'], opportunities: ['Systems', 'Networks', 'Research'] },
] as const;

export const events: EventItem[] = [
  { slug: 'open-source-sprint-01', title: 'Open Source Sprint #01', category: 'Open-source sprint', date: '2026-10-03', time: '10:00–16:00', venue: 'BIT Mesra · Lab / Chapter Space', description: 'A beginner-friendly sprint to learn issue triage, branches, pull requests, reviews, and maintainable collaboration.', tags: ['GitHub', 'OSS', 'Beginner'], status: 'PLANNED' },
  { slug: 'systems-study-group-01', title: 'Computer Networks Study Group', category: 'Study group', date: '2026-10-10', time: '17:00–18:30', venue: 'BIT Mesra', description: 'Peer-led learning around layered networking, routing, transport, and practical debugging.', tags: ['Networks', 'Learning'], status: 'PLANNED' },
  { slug: 'build-night-01', title: 'Build Night: Ship a Small System', category: 'Workshop', date: '2026-10-17', time: '18:00–21:00', venue: 'BIT Mesra', description: 'Turn a small idea into a deployed, documented project with a team of peers.', tags: ['Build', 'Product', 'Web'], status: 'PLANNED' },
  { slug: 'acm-community-meetup-01', title: 'ACM Community Meetup', category: 'Community meetup', date: '2026-09-12', time: '17:00–18:30', venue: 'BIT Mesra', description: 'An introduction to ACM BIT Mesra, contribution paths, SIGs, and the chapter roadmap.', tags: ['Community', 'ACM'], status: 'ARCHIVED' },
];

export const articles: Article[] = [
  { slug: 'why-student-infrastructure-matters', title: 'Why Student-Built Infrastructure Matters', description: 'Useful software can outlive a semester when it is designed as an open, maintainable system.', author: 'ACM BIT Mesra', date: '2026-09-21', tags: ['Engineering', 'Community'], readingTime: '6 min' },
  { slug: 'from-issue-to-pull-request', title: 'From Issue to Pull Request', description: 'A practical mental model for making a first open-source contribution without guessing the workflow.', author: 'ACM BIT Mesra', date: '2026-09-20', tags: ['Open Source', 'GitHub'], readingTime: '8 min' },
  { slug: 'designing-for-maintainers', title: 'Designing for Future Maintainers', description: 'Why documentation, data-driven UI, and predictable architecture are part of the product—not overhead.', author: 'ACM BIT Mesra', date: '2026-09-18', tags: ['Architecture', 'Design'], readingTime: '7 min' },
];

export const resources = [
  { title: 'Data Structures & Algorithms', category: 'CS Foundations', description: 'Problem-solving patterns, complexity, and practice paths.' },
  { title: 'Computer Networks', category: 'Systems', description: 'Layered networking, transport, routing, and protocol intuition.' },
  { title: 'Operating Systems', category: 'Systems', description: 'Processes, memory, filesystems, concurrency, and systems thinking.' },
  { title: 'DBMS', category: 'CS Foundations', description: 'Data modeling, SQL, transactions, indexing, and storage.' },
  { title: 'Artificial Intelligence', category: 'AI & Data', description: 'Classical AI ideas, learning systems, and practical experimentation.' },
  { title: 'Data Mining', category: 'AI & Data', description: 'Patterns, clustering, association, classification, and evaluation.' },
  { title: 'Compiler Design', category: 'Systems', description: 'Lexing, parsing, semantic analysis, IR, and code generation.' },
  { title: 'Web Development', category: 'Engineering', description: 'Modern web architecture, frontend systems, APIs, and deployment.' },
  { title: 'Git / GitHub', category: 'Open Source', description: 'Version control, collaboration, reviews, and contribution habits.' },
  { title: 'Linux', category: 'Systems', description: 'CLI workflows, processes, networking, filesystems, and shell tooling.' },
  { title: 'Cloud', category: 'Infrastructure', description: 'Deployment primitives, static hosting, APIs, automation, and observability.' },
  { title: 'Cybersecurity', category: 'Security', description: 'Secure development, web security, threat modeling, and CTF learning.' },
];

export const teamSections = [
  'Faculty Advisors', 'Chapter Leadership', 'Technical Leads', 'SIG Leads', 'Project Leads', 'Contributors', 'Alumni'
];

export const achievements = [
  { year: '2026', title: 'ACM platform foundation', description: 'Started a multi-year chapter infrastructure direction focused on projects, open source, research, and community.' },
  { year: '2026', title: 'Engineering-first chapter model', description: 'Organizing contribution pathways around building, learning, mentoring, and maintainership.' },
];

export const gallery = [
  { label: 'BUILD', title: 'Build nights', meta: 'Projects / Workshops' },
  { label: 'LEARN', title: 'Study groups', meta: 'Knowledge / Community' },
  { label: 'SHIP', title: 'Hackathons', meta: 'Events / Projects' },
  { label: 'OPEN', title: 'Open source', meta: 'GitHub / Contribution' },
  { label: 'RESEARCH', title: 'Research sessions', meta: 'Papers / Systems' },
  { label: 'COMMUNITY', title: 'Chapter life', meta: 'People / Events' },
];
