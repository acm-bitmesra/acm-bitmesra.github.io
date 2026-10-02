import { HeroSection } from "@/components/sections/hero";
import { StatsStrip } from "@/components/sections/stats-strip";
import { PillarsSection } from "@/components/sections/pillars-section";
import { FeaturedEventSection } from "@/components/sections/featured-event-section";
import { UpcomingEventsSection } from "@/components/sections/upcoming-events-section";
import { ImpactSection } from "@/components/sections/impact-section";
import { ResourcesPreviewSection } from "@/components/sections/resources-preview-section";
import { JoinCtaSection } from "@/components/sections/join-cta-section";
import { events } from "@/data/events";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  const featuredEvent = events.find((e) => e.isFeatured) || events[0];
  const otherEvents = events.filter((e) => e.slug !== featuredEvent.slug);

  // Organization JSON-LD (Section 49 & 91)
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    alternateName: "ACM BITM",
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    description: siteConfig.description,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.institution.name,
      url: siteConfig.institution.url,
    },
    memberOf: {
      "@type": "Organization",
      name: siteConfig.parentOrganization.name,
      url: siteConfig.parentOrganization.url,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.location.address,
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.state,
      postalCode: siteConfig.location.pincode,
      addressCountry: "IN",
    },
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.instagram,
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeroSection />
      <StatsStrip />
      <PillarsSection />
      {featuredEvent && <FeaturedEventSection event={featuredEvent} />}
      <UpcomingEventsSection events={otherEvents} />
      <ImpactSection />
      <ResourcesPreviewSection />
      <JoinCtaSection />
    </div>
  );
}
