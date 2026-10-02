import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { activitiesData } from "@/data/activities";
import { events } from "@/data/events";
import { studentResources } from "@/data/resources";
import { EventCard } from "@/components/events/event-card";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, MapPin, ExternalLink } from "lucide-react";

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
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/activities"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Activities
          </Link>
        </div>

        {/* Hero Section */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-mono text-primary backdrop-blur-sm">
            <span>Focus Area · {activity.categoryName}</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-foreground">
            {activity.title}
          </h1>

          <p className="text-lg sm:text-2xl text-muted-foreground font-medium leading-relaxed max-w-3xl">
            {activity.tagline}
          </p>
        </section>

        {/* Explanation / Overview */}
        <section className="rounded-2xl border border-border bg-card p-8 sm:p-10 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            How We Approach {activity.title}
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p className="text-foreground font-medium">{activity.summary}</p>
            {activity.overview.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </section>

        {/* Focus Areas Grid */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Core Competencies</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              What Students Master
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activity.focusAreas.map((area, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-6 space-y-2 hover:border-border/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <h3 className="text-base font-bold text-foreground">
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
          <section className="space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-primary">Curriculum</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Structured Learning Progression
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activity.learningRoadmap.map((road, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-xs font-bold text-primary block">
                      {road.phase}
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      {road.title}
                    </h3>
                  </div>

                  <ul className="space-y-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    {road.topics.map((t, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-primary font-bold">›</span>
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
          <section className="space-y-6 border-t border-border pt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Related Events & Contests
              </h2>
              <Link href="/events" className="text-xs font-mono text-primary hover:underline">
                View All Events →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedEvents.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Resources */}
        {recommendedResources.length > 0 && (
          <section className="space-y-6 border-t border-border pt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Recommended Resources
              </h2>
              <Link href="/resources" className="text-xs font-mono text-primary hover:underline">
                All Resources →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedResources.slice(0, 3).map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between hover:border-primary transition-colors group"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] text-primary font-semibold uppercase">
                      {res.category}
                    </span>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {res.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {res.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>{res.author || "Curated"}</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-2xl border border-border bg-secondary/40 p-8 sm:p-10 text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            Get Involved with {activity.title}
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Join the SIG discussions, attend peer-led problem solving sessions, and participate in upcoming team contests.
          </p>
          <div className="pt-2">
            <Link
              href="/join"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Join the Chapter
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
