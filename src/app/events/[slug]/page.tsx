import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { formatDateRange } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/event-card";
import { siteConfig } from "@/config/site";
import { GithubIcon } from "@/components/ui/icons";
import {
  Trophy,
  ArrowLeft,
  Share2,
  CheckCircle2,
  HelpCircle,
  FileText,
  AlertCircle,
  Sparkles,
  Clock,
  Compass,
  ShieldAlert,
  Lock,
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
  const ogImageUrl =
    event.slug === "hacktoberfest-2026"
      ? `${siteConfig.url}/images/events/hacktoberfest-2026-og.png`
      : event.coverImage?.startsWith("http")
      ? event.coverImage
      : event.coverImage
      ? `${siteConfig.url}${event.coverImage}`
      : `${siteConfig.url}/og.png`;

  return {
    title: `${event.title} | ${event.category}`,
    description: event.shortDescription,
    openGraph: {
      title: `${event.title} | ACM BIT Mesra`,
      description: event.shortDescription,
      url: pageUrl,
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${event.title} - ACM BIT Mesra`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | ACM BIT Mesra`,
      description: event.shortDescription,
      images: [ogImageUrl],
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
  const isRegistrationClosed = event.registrationOpen === false;
  const relatedEvents = events.filter((e) => e.slug !== event.slug).slice(0, 2);

  // Structured Data (JSON-LD) for Events
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
    <article className="py-10 sm:py-16">
      {/* Insert JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-10">
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
              className="p-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Notion-style Document Header & Properties Table */}
        <header className="space-y-6 border-b border-border pb-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {event.category}
              </Badge>
              {event.theme && (
                <Badge variant="secondary" className="font-mono text-xs flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Theme: {event.theme}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              {event.title}
            </h1>

            {event.tagline && (
              <p className="text-sm sm:text-base font-mono font-medium text-foreground/80">
                {event.tagline}
              </p>
            )}

            <div className="text-base text-muted-foreground leading-relaxed max-w-3xl space-y-3">
              {event.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Properties Table (Notion database view) */}
          <div className="rounded-lg border border-border bg-card divide-y divide-border text-xs sm:text-sm">
            <div className="grid grid-cols-3 sm:grid-cols-4 p-3 items-center">
              <span className="text-muted-foreground font-mono">Status</span>
              <div className="col-span-2 sm:col-span-3">
                <Badge
                  variant={
                    isRegistrationClosed
                      ? "warning"
                      : isUpcoming
                      ? "warning"
                      : isLive
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {event.registrationStatusText
                    ? event.registrationStatusText
                    : isUpcoming
                    ? "Registration Open"
                    : isLive
                    ? "Live Now"
                    : "Completed Edition"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 p-3 items-center">
              <span className="text-muted-foreground font-mono">Category</span>
              <div className="col-span-2 sm:col-span-3">
                <Badge variant="outline" className="font-mono text-xs">
                  {event.category}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 p-3 items-center">
              <span className="text-muted-foreground font-mono">Date</span>
              <span className="col-span-2 sm:col-span-3 text-foreground font-medium">
                {formatDateRange(event.date, event.endDate)}
              </span>
            </div>

            {event.time && (
              <div className="grid grid-cols-3 sm:grid-cols-4 p-3 items-center">
                <span className="text-muted-foreground font-mono">Time</span>
                <span className="col-span-2 sm:col-span-3 text-foreground">
                  {event.time}
                </span>
              </div>
            )}

            {event.location && (
              <div className="grid grid-cols-3 sm:grid-cols-4 p-3 items-center">
                <span className="text-muted-foreground font-mono">Venue</span>
                <span className="col-span-2 sm:col-span-3 text-foreground">
                  {event.location}
                </span>
              </div>
            )}

            {event.organizers && event.organizers.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 p-3 items-center">
                <span className="text-muted-foreground font-mono">Organizers</span>
                <span className="col-span-2 sm:col-span-3 text-muted-foreground">
                  {event.organizers.join(", ")}
                </span>
              </div>
            )}

            {event.theme && (
              <div className="grid grid-cols-3 sm:grid-cols-4 p-3 items-center">
                <span className="text-muted-foreground font-mono">Theme</span>
                <span className="col-span-2 sm:col-span-3 text-foreground font-medium">
                  {event.theme}
                </span>
              </div>
            )}

            {event.tags && event.tags.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 p-3 items-center">
                <span className="text-muted-foreground font-mono">Focus</span>
                <span className="col-span-2 sm:col-span-3 text-muted-foreground">
                  {event.tags.join(" • ")}
                </span>
              </div>
            )}

            {event.challengeTitle && (
              <div className="grid grid-cols-3 sm:grid-cols-4 p-3 items-center">
                <span className="text-muted-foreground font-mono">Challenge</span>
                <span className="col-span-2 sm:col-span-3 text-foreground font-medium">
                  {event.challengeTitle} (Details to be announced)
                </span>
              </div>
            )}

            {event.prizes && event.prizes.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 p-3 items-center">
                <span className="text-muted-foreground font-mono">Prizes</span>
                <span className="col-span-2 sm:col-span-3 text-foreground font-medium">
                  {event.prizes[0].reward}
                </span>
              </div>
            )}
          </div>

          {/* Registration CTA */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isRegistrationClosed ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-neutral-900/40 dark:bg-white/20 px-5 text-xs font-medium text-muted-foreground cursor-not-allowed border border-border"
                >
                  <GithubIcon className="h-4 w-4 opacity-60" />
                  <span>Register with GitHub</span>
                  <span className="ml-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                    Opening Soon
                  </span>
                </button>
                <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-muted-foreground" />
                  {event.registrationStatusText || "Registration Opening Soon"}
                </span>
              </div>
            ) : isUpcoming && event.registrationUrl ? (
              <a
                href={event.registrationUrl}
                className="inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-5 text-xs font-medium text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                Register for Event
              </a>
            ) : null}

            {isCompleted && (
              <div className="inline-flex items-center gap-2 rounded-md bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground border border-border">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>This edition has concluded. Results are recorded below.</span>
              </div>
            )}
          </div>
        </header>

        {/* Section: About */}
        {event.about && event.about.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Compass className="h-4 w-4 text-neutral-500" />
              About the Event
            </h2>
            <div className="rounded-lg border border-border bg-card p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {event.about.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {/* Section: What to Expect */}
        {event.expectations && event.expectations.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-neutral-500" />
              What to Expect
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {event.expectations.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-card p-4 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-primary font-bold">
                      0{idx + 1}.
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: ACM Challenge */}
        {event.challengeTitle && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-neutral-500" />
              {event.challengeTitle}
            </h2>
            <div className="rounded-lg border border-border bg-card p-5 sm:p-6 space-y-3">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {event.challengeDescription}
              </p>
              <div className="pt-2 text-xs font-mono text-muted-foreground border-t border-border">
                More challenge details, rules, timelines, judging information, and submission procedures will be announced on this event page.
              </div>
            </div>
          </section>
        )}

        {/* Section: Timeline */}
        {event.timelineItems && event.timelineItems.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-500" />
                Timeline & Milestones
              </h2>
              {event.timelineNotice && (
                <span className="text-xs font-mono text-muted-foreground">
                  {event.timelineNotice}
                </span>
              )}
            </div>
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {event.timelineItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-foreground">
                        {item.date}
                      </span>
                      {item.status && (
                        <Badge
                          variant={item.status === "Confirmed" ? "secondary" : "outline"}
                          className="text-[10px] font-mono"
                        >
                          {item.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Contest / Event Rules */}
        {event.rules && event.rules.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-neutral-500" />
              Rules & Guidelines
            </h2>
            <div className="rounded-lg border border-border bg-card p-5">
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-neutral-400 text-xs mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Section: Prizes & Honors */}
        {event.prizes && event.prizes.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-neutral-500" />
              Prizes & Recognition
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {event.prizes.map((prize, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-card p-4 space-y-1"
                >
                  <span className="font-mono text-xs text-muted-foreground block">
                    {prize.title}
                  </span>
                  <p className="text-sm font-semibold text-foreground">
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
            {event.prizesNotice && (
              <p className="text-xs font-mono text-muted-foreground italic">
                {event.prizesNotice}
              </p>
            )}
          </section>
        )}

        {/* Section: Registration Status Callout */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-neutral-500" />
            Registration
          </h2>
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {event.title} Registration
                  </h3>
                  <Badge
                    variant={event.registrationOpen ? "secondary" : "warning"}
                    className="text-xs font-mono"
                  >
                    {event.registrationStatusText ||
                      (event.registrationOpen ? "Open" : "Opening Soon")}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {event.registrationHelperText ||
                    (event.registrationOpen
                      ? "Register now to participate in this event."
                      : "Registrations will open soon. Sign-ins will be handled securely via GitHub.")}
                </p>
              </div>

              <div>
                {event.registrationOpen ? (
                  <a
                    href={event.registrationUrl || "#"}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-neutral-900 px-5 text-xs font-medium text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>Register with GitHub</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-neutral-900/40 dark:bg-white/20 px-5 text-xs font-medium text-muted-foreground cursor-not-allowed border border-border"
                  >
                    <GithubIcon className="h-4 w-4 opacity-60" />
                    <span>Register with GitHub</span>
                  </button>
                )}
              </div>
            </div>
            {!event.registrationOpen && (
              <p className="text-[11px] font-mono text-muted-foreground/80 border-t border-border pt-3">
                Notice: The registration button is currently disabled. Do not submit external forms. The registration button will activate automatically once the organizing committee opens registrations.
              </p>
            )}
          </div>
        </section>

        {/* Section: Historical Results / Winners */}
        {event.winners && event.winners.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Results & Podium
            </h2>
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {event.winners.map((winner, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      {winner.position}
                    </span>
                    <span className="font-medium text-foreground">
                      {winner.teamName}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {winner.members.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : isCompleted ? (
          <section className="rounded-lg border border-border bg-secondary/40 p-4 text-xs text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-neutral-400 shrink-0" />
            <span>Official standings are archived in the chapter repository. Contact organizers for certificate queries.</span>
          </section>
        ) : null}

        {/* Section: Frequently Asked Questions */}
        {event.faqs && event.faqs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-neutral-500" />
              Frequently Asked Questions
            </h2>
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {event.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 space-y-1">
                  <h3 className="text-sm font-medium text-foreground">
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

        {/* Section: Community Disclaimer */}
        {event.disclaimer && (
          <section className="rounded-lg border border-border/80 bg-secondary/30 p-4 text-xs text-muted-foreground flex items-start gap-3">
            <ShieldAlert className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">{event.disclaimer}</p>
          </section>
        )}

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Other Chapter Events
              </h2>
              <Link
                href="/events"
                className="text-xs font-mono text-muted-foreground hover:text-foreground"
              >
                Browse all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
