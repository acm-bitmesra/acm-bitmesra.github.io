export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export const siteConfig = {
  name: "ACM BIT Mesra",
  shortName: "ACM BITM",
  tagline: "Build. Compete. Create.",
  description:
    "Official student chapter of the Association for Computing Machinery at Birla Institute of Technology, Mesra. Empowering computing, algorithmic problem solving, software engineering, and open source collaboration.",
  url: "https://acmbitm.campsy.app",
  altUrl: "https://acm-bitmesra.github.io",
  location: {
    campus: "Birla Institute of Technology, Mesra",
    city: "Ranchi",
    state: "Jharkhand",
    country: "India",
    pincode: "835215",
    address: "Department of Computer Science & Engineering, BIT Mesra, Ranchi, Jharkhand 835215, India",
  },
  institution: {
    name: "Birla Institute of Technology, Mesra",
    shortName: "BIT Mesra",
    url: "https://www.bitmesra.ac.in",
  },
  parentOrganization: {
    name: "Association for Computing Machinery",
    shortName: "ACM",
    url: "https://www.acm.org",
  },
  social: {
    github: "https://github.com/acm-bitmesra",
    linkedin: "https://www.linkedin.com/company/acmbitm/",
    instagram: "https://www.instagram.com/acmbitm?stkn=MXB1c3plOWYyeHFlZg==",
    email: "acm@bitmesra.ac.in",
  },
  nav: [
    { title: "About", href: "/about" },
    { title: "Activities", href: "/activities" },
    { title: "Events", href: "/events" },
    { title: "Team", href: "/team" },
    { title: "Resources", href: "/resources" },
    { title: "Blog", href: "/blog" },
  ] as NavItem[],
  quickLinks: [
    { title: "Competitive Programming", href: "/competitive-programming" },
    { title: "ICPC Track", href: "/icpc" },
    { title: "Hack-A-Bit Archive", href: "/events/hack-a-bit" },
    { title: "CodeZilla & CQM", href: "/events/codezilla" },
    { title: "Alumni Archive", href: "/alumni" },
    { title: "History Timeline", href: "/history" },
    { title: "Gallery", href: "/gallery" },
    { title: "Sponsors & Partners", href: "/sponsors" },
    { title: "Join ACM", href: "/join" },
    { title: "Contact", href: "/contact" },
  ] as NavItem[],
} as const;
