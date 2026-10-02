import type { Metadata } from "next";
import { studentResources } from "@/data/resources";
import { ResourcesExplorer } from "@/components/resources/resources-explorer";

export const metadata: Metadata = {
  title: "Programming & Developer Resources",
  description:
    "Curated collection of DSA roadmaps, competitive programming guides, web engineering courses, and systems materials for BIT Mesra students.",
};

export default function ResourcesPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <span>Knowledge Base · Curated Materials</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Student Resources
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A vetted repository of algorithmic guides, open-source tutorials, and systems textbooks recommended by ACM mentors to support self-directed study and contest preparation.
          </p>
        </div>

        {/* Resources Explorer */}
        <ResourcesExplorer initialResources={studentResources} />
      </div>
    </div>
  );
}
