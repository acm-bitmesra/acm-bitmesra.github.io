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

export interface Event {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: "Hackathon" | "Coding Contest" | "Workshop" | "Talk" | "Competition" | "Community";
  status: EventStatus;
  date: string; // ISO YYYY-MM-DD
  endDate?: string;
  time?: string;
  location?: string;
  registrationUrl?: string;
  poster?: string;
  coverImage?: string;
  organizers: string[];
  speakers?: Person[];
  judges?: Person[];
  sponsors?: Sponsor[];
  prizes?: Prize[];
  schedule?: ScheduleItem[];
  faqs?: FAQ[];
  winners?: Winner[];
  gallery?: GalleryImage[];
  isFeatured?: boolean;
  tags?: string[];
  rules?: string[];
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
  category: "DSA" | "Competitive Programming" | "Development" | "Open Source" | "Systems" | "Career";
  type: "article" | "video" | "course" | "github" | "document";
  url: string;
  author?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
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
