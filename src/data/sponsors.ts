export interface SponsorPartner {
  name: string;
  category: "institutional" | "community" | "past";
  description: string;
  url: string;
  eventAssociation?: string;
  isVerified: boolean;
}

export const institutionalPartners: SponsorPartner[] = [
  {
    name: "Birla Institute of Technology, Mesra",
    category: "institutional",
    description: "Parent host university providing campus infrastructure, computational laboratories, and institutional patronage.",
    url: "https://www.bitmesra.ac.in",
    isVerified: true,
  },
  {
    name: "Association for Computing Machinery (ACM Global)",
    category: "institutional",
    description: "Chartering body supporting computing education, digital library access, and international student competitions.",
    url: "https://www.acm.org",
    isVerified: true,
  },
  {
    name: "ACM India Council",
    category: "institutional",
    description: "National chapter umbrella facilitating regional conferences, computing symposiums, and collegiate mentoring.",
    url: "https://india.acm.org",
    isVerified: true,
  },
];

export const sponsorBenefits = [
  {
    tier: "Title Sponsorship",
    focus: "Flagship Hackathons (Hack-A-Bit)",
    benefits: [
      "Keynote speaking opportunity at the opening ceremony",
      "Dedicated problem statement or innovation track",
      "Direct technical branding across all event communications & participant kits",
      "Exclusive access to participant resumes and project repository demos",
    ],
  },
  {
    tier: "Contest Partner",
    focus: "CodeZilla & Algorithmic Contests",
    benefits: [
      "Sponsor problem formulation or custom challenge track",
      "Direct engagement with top competitive programmers across Eastern India",
      "Branded prize pool and certificates of honor",
    ],
  },
  {
    tier: "Community & Tooling Partner",
    focus: "Developer Education & Workshops",
    benefits: [
      "Student API credits, cloud infrastructure, or developer tool access",
      "Co-hosting technical workshops and developer deep-dives",
      "Community acknowledgment in chapter open-source repositories",
    ],
  },
];
