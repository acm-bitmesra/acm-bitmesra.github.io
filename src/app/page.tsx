import { HeroSection } from "@/components/sections/hero";
import { StatsStrip } from "@/components/sections/stats-strip";
import { PillarsSection } from "@/components/sections/pillars-section";
import { FeaturedEventSection } from "@/components/sections/featured-event-section";
import { UpcomingEventsSection } from "@/components/sections/upcoming-events-section";
import { ImpactSection } from "@/components/sections/impact-section";
import { ResourcesPreviewSection } from "@/components/sections/resources-preview-section";
import { JoinCtaSection } from "@/components/sections/join-cta-section";
import { events } from "@/data/events";

export default function HomePage() {
  const featuredEvent = events.find((e) => e.isFeatured) || events[0];
  const otherEvents = events.filter((e) => e.slug !== featuredEvent.slug);

  return (
    <div className="flex flex-col min-h-screen">
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
