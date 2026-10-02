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
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Document Header */}
        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="text-xs font-mono text-muted-foreground">
            Knowledge Base / Learning Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Student Resources
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Vetted problem sets, contest guides, and systems documentation curated by ACM BIT Mesra members for peer learning.
          </p>
        </div>

        {/* Resources Explorer */}
        <ResourcesExplorer initialResources={studentResources} />
      </div>
    </div>
  );
}
