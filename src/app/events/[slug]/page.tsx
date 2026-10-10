import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { formatEventDate } from "@/lib/date";
import { EventCard } from "@/components/events/event-card";
import { siteConfig } from "@/config/site";
import { GithubIcon } from "@/components/ui/icons";
import { EventShareActions } from "@/components/events/event-share-actions";
import { Clock, Compass, FileText, CircleQuestionMark as HelpCircle, MapPin, ShieldAlert, Sparkles, Trophy, Users } from "@animateicons/react/lucide";
import { Badge } from "@/components/ui/badge";
import { RecommendedReposSection } from "@/components/events/recommended-repos-section";
import { DevChallengeHubSection } from "@/components/events/dev-challenge-hub-section";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((item) => item.slug === slug);

  if (!event) {
    return { title: "Event Not Found" };
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
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${event.title} | ACM BIT Mesra`,
      description: event.shortDescription,
      url: pageUrl,
      type: "article",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${event.title} - ACM BIT Mesra` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | ACM BIT Mesra`,
      description: event.shortDescription,
      images: [ogImageUrl],
    },
  };
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-8 sm:pt-10">
      <h2 className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
      <div className="mt-5 sm:mt-6">{children}</div>
    </section>
  );
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const event = events.find((item) => item.slug === slug);

  if (!event) {
    notFound();
  }

  const pageUrl = `${siteConfig.url}/events/${event.slug}`;
  const isLive = event.status === "live";
  const isCompleted =
    event.status === "completed" || event.status === "archived";
  const isRegistrationClosed = event.registrationOpen === false;
  const relatedEvents = events.filter((item) => item.slug !== event.slug).slice(0, 2);

  const eventStatus =
    event.status === "live"
      ? "https://schema.org/EventLive"
      : isCompleted
      ? "https://schema.org/EventCompleted"
      : "https://schema.org/EventScheduled";

  const attendanceMode = event.location?.includes("Online")
    ? event.location.includes("Campus")
      ? "https://schema.org/MixedEventAttendanceMode"
      : "https://schema.org/OnlineEventAttendanceMode"
    : "https://schema.org/OfflineEventAttendanceMode";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.shortDescription,
    startDate: event.date,
    endDate: event.endDate || event.date,
    eventStatus,
    eventAttendanceMode: attendanceMode,
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
    <article className="py-6 sm:py-10 lg:py-14">
      {/* schema.org Event requires a real startDate, so skip it until the date is announced */}
      {!event.dateTba && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <Link
            href="/events"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span aria-hidden="true">←</span>
            All events
          </Link>
          <EventShareActions title={event.title} url={pageUrl} />
        </div>

        <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16 lg:pt-12">
          <main className="min-w-0">
            <header className="max-w-4xl">
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>

              {event.tagline && (
                <p className="mt-4 text-lg font-medium text-foreground/80 sm:text-xl">
                  {event.tagline}
                </p>
              )}

              <div className="mt-6 max-w-[72ch] space-y-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {event.description.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{event.category}</span>
                {event.theme && (
                  <>
                    <span aria-hidden="true" className="text-border">•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      {event.theme}
                    </span>
                  </>
                )}
              </div>
            </header>

            <div className="mt-10 lg:hidden">
              <EventFacts
                event={event}
                isRegistrationClosed={isRegistrationClosed}
                isLive={isLive}
                isCompleted={isCompleted}
              />
            </div>

            <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12">
              {event.slug === "hacktoberfest-2026" && (
                <DevChallengeHubSection />
              )}

              {event.about && event.about.length > 0 && (
                <Section title="About the event" icon={<Compass className="h-5 w-5" />}>
                  <div className="max-w-[72ch] space-y-4 text-base leading-7 text-muted-foreground">
                    {event.about.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </Section>
              )}

              {event.expectations && event.expectations.length > 0 && (
                <Section title="What to expect" icon={<Sparkles className="h-5 w-5" />}>
                  <div className="divide-y divide-border border-y border-border">
                    {event.expectations.map((item, index) => (
                      <div key={index} className="grid gap-2 py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="max-w-[65ch] text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {event.challengeTitle && (
                <Section title={event.challengeTitle} icon={<FileText className="h-5 w-5" />}>
                  <div className="border border-primary/20 bg-primary/[0.06] px-5 py-5 sm:px-6 sm:py-6">
                    <p className="max-w-[72ch] text-base leading-7 text-muted-foreground">
                      {event.challengeDescription}
                    </p>
                    <p className="mt-4 border-t border-primary/15 pt-4 text-sm leading-6 text-foreground/75">
                      More challenge details, rules, judging information, and submission procedures will be announced on this page.
                    </p>
                  </div>
                </Section>
              )}

              {event.recommendedRepos && event.recommendedRepos.length > 0 && (
                <RecommendedReposSection repos={event.recommendedRepos} />
              )}

              {event.timelineItems && event.timelineItems.length > 0 && (
                <Section title="Timeline & milestones" icon={<Clock className="h-5 w-5" />}>
                  <ol className="border-y border-border">
                    {event.timelineItems.map((item, index) => (
                      <li key={index} className="grid gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8">
                        <div className="text-sm font-medium text-foreground">{item.date}</div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            {item.status && <Badge variant={item.status === "Confirmed" ? "success" : "outline"}>{item.status}</Badge>}
                          </div>
                          {item.description && (
                            <p className="mt-1.5 max-w-[65ch] text-sm leading-6 text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </Section>
              )}

              {event.rules && event.rules.length > 0 && (
                <Section title="Rules & guidelines" icon={<FileText className="h-5 w-5" />}>
                  <ul className="max-w-[72ch] space-y-4 text-base leading-7 text-muted-foreground">
                    {event.rules.map((rule, index) => (
                      <li key={index} className="relative pl-5">
                        <span className="absolute left-0 top-[0.65em] h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {event.prizes && event.prizes.length > 0 && (
                <Section title="Prizes & recognition" icon={<Trophy className="h-5 w-5" />}>
                  <div className="divide-y divide-border border-y border-border">
                    {event.prizes.map((prize, index) => (
                      <div key={index} className="grid gap-2 py-5 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:items-start sm:gap-6">
                        <span className="text-sm font-semibold text-foreground">{prize.title}</span>
                        <p className="text-sm leading-6 text-muted-foreground sm:text-base">{prize.description}</p>
                        <span className="font-semibold text-foreground sm:text-right">{prize.reward}</span>
                      </div>
                    ))}
                  </div>
                  {event.prizesNotice && (
                    <p className="mt-4 text-sm text-muted-foreground">{event.prizesNotice}</p>
                  )}
                </Section>
              )}

              {event.winners && event.winners.length > 0 && (
                <Section title="Results & podium" icon={<Trophy className="h-5 w-5" />}>
                  <div className="divide-y divide-border border-y border-border">
                    {event.winners.map((winner, index) => (
                      <div key={index} className="grid gap-2 py-5 sm:grid-cols-[5rem_12rem_minmax(0,1fr)] sm:gap-6">
                        <span className="font-semibold text-foreground">{winner.position}</span>
                        <span className="font-medium text-foreground">{winner.teamName}</span>
                        <span className="text-sm leading-6 text-muted-foreground">{winner.members.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {event.faqs && event.faqs.length > 0 && (
                <Section title="Frequently asked questions" icon={<HelpCircle className="h-5 w-5" />}>
                  <div className="divide-y divide-border border-y border-border">
                    {event.faqs.map((faq, index) => (
                      <details key={index} className="group py-5">
                        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 font-semibold text-foreground marker:hidden">
                          <span>{faq.question}</span>
                          <span className="text-xl font-normal text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">
                            +
                          </span>
                        </summary>
                        <p className="max-w-[72ch] pt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </Section>
              )}

              {event.disclaimer && (
                <section className="border-t border-border pt-8 sm:pt-10">
                  <div className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="max-w-[78ch]">{event.disclaimer}</p>
                  </div>
                </section>
              )}
            </div>
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <EventFacts
                event={event}
                isRegistrationClosed={isRegistrationClosed}
                isLive={isLive}
                isCompleted={isCompleted}
              />
            </div>
          </aside>
        </div>

        {relatedEvents.length > 0 && (
          <section className="mt-16 border-t border-border pt-8 sm:mt-20 sm:pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-[-0.025em] sm:text-2xl">More from ACM BIT Mesra</h2>
              <Link href="/events" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Browse all events →
              </Link>
            </div>
            <div className="mt-4 grid gap-x-8 md:grid-cols-2">
              {relatedEvents.map((item) => (
                <EventCard key={item.slug} event={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

function EventFacts({
  event,
  isRegistrationClosed,
  isLive,
  isCompleted,
}: {
  event: (typeof events)[number];
  isRegistrationClosed: boolean;
  isLive: boolean;
  isCompleted: boolean;
}) {
  const isUpcoming = event.status === "upcoming";
  return (
    <div className="border-y border-border py-5 sm:py-6 lg:border-y-0 lg:border-l lg:pl-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Event details
        </span>
        <span
          className={
            isLive
              ? "text-xs font-semibold text-red-400"
              : event.registrationOpen
              ? "text-xs font-semibold text-emerald-400"
              : isCompleted
              ? "text-xs font-semibold text-muted-foreground"
              : "text-xs font-semibold text-amber-400"
          }
        >
          {isLive
            ? "Live now"
            : isCompleted
            ? "Completed"
            : event.registrationOpen
            ? "Registration open"
            : "Opening soon"}
        </span>
      </div>

      <dl className="mt-5 divide-y divide-border border-y border-border">
        <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-4">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Date</dt>
          <dd className="text-sm font-medium text-foreground">{formatEventDate(event)}</dd>
        </div>
        {event.time && (
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Time</dt>
            <dd className="text-sm text-foreground">{event.time}</dd>
          </div>
        )}
        {event.location && (
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Venue</dt>
            <dd className="inline-flex items-start gap-1.5 text-sm text-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{event.location}</span>
            </dd>
          </div>
        )}
        {event.organizers.length > 0 && (
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Organized by</dt>
            <dd className="inline-flex items-start gap-1.5 text-sm text-foreground">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{event.organizers.join(", ")}</span>
            </dd>
          </div>
        )}
      </dl>

      {isRegistrationClosed ? (
        <div className="mt-5 border border-amber-500/20 bg-amber-500/[0.06] p-4">
          <p className="text-sm font-semibold text-foreground">Registration opening soon</p>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
            {event.registrationHelperText || "Registration details will be published here when confirmed."}
          </p>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-border bg-secondary px-4 text-sm font-semibold text-muted-foreground"
          >
            {event.registrationType === "github" ? (
              <>
                <GithubIcon className="h-4 w-4 shrink-0 opacity-60" />
                Register with GitHub
              </>
            ) : (
              "Register"
            )}
          </button>
        </div>
      ) : event.registrationUrl && isUpcoming ? (
        <a
          href={event.registrationUrl}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Register for event
          <span aria-hidden="true">→</span>
        </a>
      ) : null}
    </div>
  );
}
