export type EventStatus =
  | "upcoming"
  | "live"
  | "completed"
  | "archived";

export interface Person {
  name: string;
  role: string;
  batch?: string;
  avatar?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface Sponsor {
  name: string;
  tier: "title" | "associate" | "partner" | "community";
  logo?: string;
  url?: string;
  description?: string;
}

export interface Prize {
  title: string;
  reward: string;
  description?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Winner {
  position: string;
  teamName: string;
  members: string[];
  projectTitle?: string;
  projectUrl?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  category?: string;
}

export interface EventExpectation {
  title: string;
  description: string;
}

export interface EventTimelineItem {
  date: string;
  title: string;
  status?: string;
  description?: string;
}

export interface RecommendedRepo {
  name: string;
  url: string;
  description: string;
  category: "AI & Open-Weight Models" | "Developer Tools & Full-Stack" | "Algorithms & First Contributions" | string;
  stars?: string;
  language?: string;
  goodFor?: string;
  issuesUrl?: string;
  tags?: string[];
}

export interface Event {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: "Hackathon" | "Coding Contest" | "Workshop" | "Talk" | "Competition" | "Community" | "Open Source" | "Open Source / AI / Developer Community" | string;
  status: EventStatus;
  date: string; // ISO YYYY-MM-DD
  endDate?: string;
  time?: string;
  location?: string;
  registrationOpen?: boolean;
  registrationStatusText?: string;
  registrationHelperText?: string;
  registrationType?: "github" | "form" | "external";
  registrationUrl?: string;
  tagline?: string;
  theme?: string;
  poster?: string;
  coverImage?: string;
  organizers: string[];
  speakers?: Person[];
  judges?: Person[];
  sponsors?: Sponsor[];
  prizes?: Prize[];
  prizesNotice?: string;
  schedule?: ScheduleItem[];
  faqs?: FAQ[];
  winners?: Winner[];
  gallery?: GalleryImage[];
  isFeatured?: boolean;
  tags?: string[];
  rules?: string[];
  about?: string[];
  expectations?: EventExpectation[];
  challengeTitle?: string;
  challengeDescription?: string;
  timelineNotice?: string;
  timelineItems?: EventTimelineItem[];
  recommendedRepos?: RecommendedRepo[];
  disclaimer?: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  category: "faculty" | "executive" | "leads" | "alumni";
  batch?: string;
  program?: string;
  bio: string;
  avatar?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  interests?: string[];
  contributions?: string[];
  isVerified: boolean;
}

export interface Resource {
  title: string;
  description: string;
  category:
    | "DSA"
    | "Competitive Programming"
    | "Systems"
    | "Development"
    | "Open Source"
    | "System Design"
    | "AI & Machine Learning"
    | "Career"
    | "Foundations"
    | string;
  type: "article" | "video" | "course" | "github" | "document" | "interactive" | "roadmap";
  url: string;
  author?: string;
  level?:
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "All Levels"
    | "Beginner to Advanced"
    | "Beginner to Intermediate"
    | "Intermediate to Advanced"
    | string;
  tags?: string[];
  featured?: boolean;
  highlights?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  cover?: string;
  draft?: boolean;
  content: string;
}

export interface StatItem {
  value: string;
  label: string;
  description: string;
  isVerified: boolean;
}
