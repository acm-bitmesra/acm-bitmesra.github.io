import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { formatDate, formatDateRange } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/event-card";
import { siteConfig } from "@/config/site";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
  ArrowLeft,
  Share2,
  CheckCircle2,
  HelpCircle,
  FileText,
  AlertCircle,
} from "lucide-react";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  const pageUrl = `${siteConfig.url}/events/${event.slug}`;

  return {
    title: `${event.title} | ${event.category}`,
    description: event.shortDescription,
    openGraph: {
      title: `${event.title} | ACM BIT Mesra`,
      description: event.shortDescription,
      url: pageUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | ACM BIT Mesra`,
      description: event.shortDescription,
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const isUpcoming = event.status === "upcoming";
  const isLive = event.status === "live";
  const isCompleted = event.status === "completed" || event.status === "archived";
  const relatedEvents = events.filter((e) => e.slug !== event.slug).slice(0, 2);

  // Structured Data (JSON-LD) for Events (Section 49 & 91)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.shortDescription,
    startDate: event.date,
    endDate: event.endDate || event.date,
    eventStatus:
      event.status === "upcoming"
        ? "https://schema.org/EventScheduled"
        : event.status === "live"
        ? "https://schema.org/EventLive"
        : "https://schema.org/EventMovedOnline",
    eventAttendanceMode: event.location?.includes("Online")
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location || siteConfig.location.campus,
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
  };

  return (
    <article className="py-12 sm:py-16">
      {/* Insert JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Events
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${event.title} at @acmbitmesra`
              )}&url=${encodeURIComponent(`${siteConfig.url}/events/${event.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
              className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Event Hero Header */}
        <header className="space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {event.category}
            </Badge>
            <Badge
              variant={
                isUpcoming
                  ? "warning"
                  : isLive
                  ? "destructive"
                  : "secondary"
              }
            >
              {isUpcoming
                ? "Registration Open"
                : isLive
                ? "Live Now"
                : "Completed Edition"}
            </Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              {event.title}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl">
              {event.description}
            </p>
          </div>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border/80">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-muted-foreground block flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Date & Schedule
              </span>
              <span className="text-sm font-semibold text-foreground">
                {formatDateRange(event.date, event.endDate)}
              </span>
            </div>

            {event.time && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-muted-foreground block flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Duration / Time
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {event.time}
                </span>
              </div>
            )}

            {event.location && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-muted-foreground block flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Venue
                </span>
                <span className="text-sm font-semibold text-foreground truncate block">
                  {event.location}
                </span>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-muted-foreground block flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-primary" /> Organizers
              </span>
              <span className="text-sm font-semibold text-foreground truncate block">
                {event.organizers.join(", ")}
              </span>
            </div>
          </div>

          {/* Registration CTA (Section 73) */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            {isUpcoming && event.registrationUrl ? (
              <a
                href={event.registrationUrl}
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Register for Event
              </a>
            ) : null}

            {isCompleted && (
              <div className="inline-flex items-center gap-2 rounded-md bg-secondary/80 px-4 py-2 text-xs font-mono text-muted-foreground border border-border">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>This official edition has concluded. Results & details are archived below.</span>
              </div>
            )}
          </div>
        </header>

        {/* Section: Contest / Event Rules */}
        {event.rules && event.rules.length > 0 && (
          <section className="space-y-4 rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Rules & Participation Guidelines
            </h2>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {event.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-mono text-primary font-bold text-xs mt-0.5">
                    0{idx + 1}.
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Section: Prizes & Honors */}
        {event.prizes && event.prizes.length > 0 && (
          <section className="space-y-4 rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> Prizes & Recognition
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {event.prizes.map((prize, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border/80 bg-background/50 p-4 space-y-1.5"
                >
                  <span className="font-mono text-xs font-bold text-primary block">
                    {prize.title}
                  </span>
                  <p className="text-sm font-bold text-foreground">
                    {prize.reward}
                  </p>
                  {prize.description && (
                    <p className="text-xs text-muted-foreground">
                      {prize.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Historical Results / Winners (Section 67 compliant) */}
        {event.winners && event.winners.length > 0 ? (
          <section className="space-y-4 rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Podium Standings & Results
            </h2>
            <div className="space-y-3">
              {event.winners.map((winner, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/60"
                >
                  <span className="font-mono text-xs text-primary font-bold">
                    {winner.position}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {winner.teamName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {winner.members.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : isCompleted ? (
          <section className="rounded-xl border border-border/60 bg-secondary/30 p-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-primary" />
              <span>Institutional Results Archive</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Official scorecards and verified podium records for prior historical editions are preserved in chapter archives. Contact executive organizers for specific certificate verifications.
            </p>
          </section>
        ) : null}

        {/* Section: Frequently Asked Questions */}
        {event.faqs && event.faqs.length > 0 && (
          <section className="space-y-4 rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4 pt-2">
              {event.faqs.map((faq, idx) => (
                <div key={idx} className="space-y-1 border-b border-border/60 pb-3 last:border-none">
                  <h3 className="text-sm font-semibold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                More Chapter Events
              </h2>
              <Link
                href="/events"
                className="text-xs font-mono text-primary hover:underline"
              >
                Browse all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedEvents.map((relEvent) => (
                <EventCard key={relEvent.slug} event={relEvent} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
