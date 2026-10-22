import type { Metadata } from "next";
import { events } from "@/data/events";
import { EventsExplorer } from "@/components/events/events-explorer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Events & Contests Archive | ACM BIT Mesra",
  description:
    "Explore upcoming hackathons, algorithmic coding contests, workshops, and historical editions hosted by ACM BIT Mesra.",
  alternates: {
    canonical: `${siteConfig.url}/events`,
  },
  openGraph: {
    title: "Events & Coding Contests | ACM BIT Mesra",
    description:
      "Explore upcoming hackathons, algorithmic coding contests, workshops, and historical editions hosted by ACM BIT Mesra.",
    url: `${siteConfig.url}/events`,
    siteName: siteConfig.name,
    images: [`${siteConfig.url}/og.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events & Coding Contests | ACM BIT Mesra",
    description:
      "Explore upcoming hackathons, algorithmic coding contests, workshops, and historical editions hosted by ACM BIT Mesra.",
    images: [`${siteConfig.url}/og.png`],
  },
};

export default function EventsPage() {
  const eventsListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ACM BIT Mesra Events & Contests",
    description: "Living archive of hackathons, algorithmic competitions, and technical workshops.",
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: event.title,
        description: event.shortDescription || event.description,
        startDate: event.date,
        url: `${siteConfig.url}/events/${event.slug}`,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: siteConfig.location.campus,
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.location.address,
            addressLocality: siteConfig.location.city,
            addressRegion: siteConfig.location.state,
            postalCode: siteConfig.location.pincode,
            addressCountry: "IN",
          },
        },
        organizer: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
    })),
  };

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsListJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl border-b border-border pb-7 sm:pb-9">
          <h1 className="text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">
            Events & contests
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-7 text-muted-foreground sm:text-lg">
            A living archive of hackathons, coding contests, workshops, and developer activities hosted by ACM BIT Mesra.
          </p>
        </header>

        <div className="mt-8 sm:mt-10">
          <EventsExplorer initialEvents={events} />
        </div>
      </div>
    </div>
  );
}
