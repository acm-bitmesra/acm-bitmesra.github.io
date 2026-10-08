import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { activitiesData } from "@/data/activities";
import { events } from "@/data/events";
import { studentResources } from "@/data/resources";
import { EventCard } from "@/components/events/event-card";
import { ArrowLeft, CircleCheck as CheckCircle2, ExternalLink } from "@animateicons/react/lucide";

interface ActivityDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return activitiesData.map((act) => ({
    slug: act.slug,
  }));
}

export async function generateMetadata({
  params,
}: ActivityDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const activity = activitiesData.find((a) => a.slug === slug);

  if (!activity) {
    return { title: "Activity Not Found" };
  }

  return {
    title: `${activity.title} | Activities`,
    description: activity.summary,
  };
}

import { Callout } from "@/components/ui/callout";

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { slug } = await params;
  const activity = activitiesData.find((a) => a.slug === slug);

  if (!activity) {
    notFound();
  }

  // Find related events
  const relatedEvents = events.filter((e) =>
    activity.relatedEventSlugs.includes(e.slug)
  );

  // Find recommended resources
  const recommendedResources = studentResources.filter((r) =>
    activity.recommendedResourceCategories.includes(r.category)
  );

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/activities"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Activities
          </Link>
        </div>

        {/* Document Header */}
        <div className="space-y-3 border-b border-border pb-8">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Focus Area · {activity.categoryName}
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {activity.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            {activity.tagline}
          </p>
        </div>

        {/* Explanation / Overview Callout */}
        <Callout>
          <div className="space-y-3 text-sm leading-relaxed">
            <p className="font-semibold text-foreground">{activity.summary}</p>
            {activity.overview.map((para, idx) => (
              <p key={idx} className="text-muted-foreground">{para}</p>
            ))}
          </div>
        </Callout>

        {/* Focus Areas Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Core Competencies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activity.focusAreas.map((area, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-5 space-y-2 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h3 className="text-sm font-semibold text-foreground">
                    {area.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Roadmap */}
        {activity.learningRoadmap.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Learning Progression
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activity.learningRoadmap.map((road, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-card p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-muted-foreground block">
                      {road.phase}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {road.title}
                    </h3>
                  </div>

                  <ul className="space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                    {road.topics.map((t, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-neutral-400">›</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <section className="space-y-4 border-t border-border pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Related Events & Contests
              </h2>
              <Link href="/events" className="text-xs font-mono text-muted-foreground hover:text-foreground">
                View All Events →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedEvents.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Resources */}
        {recommendedResources.length > 0 && (
          <section className="space-y-4 border-t border-border pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Recommended Resources
              </h2>
              <Link href="/resources" className="text-xs font-mono text-muted-foreground hover:text-foreground">
                All Resources →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedResources.slice(0, 3).map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border bg-card p-4 flex flex-col justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors group"
                >
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">
                      {res.category}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground group-hover:underline">
                      {res.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {res.description}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>{res.author || "Curated"}</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <Callout>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Get Involved with {activity.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Join discussions, attend peer-led problem solving sessions, and participate in upcoming team contests.
              </p>
            </div>
            <Link
              href="/join"
              className="inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 text-xs font-medium text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shrink-0"
            >
              Join Chapter
            </Link>
          </div>
        </Callout>
      </div>
    </div>
  );
}
