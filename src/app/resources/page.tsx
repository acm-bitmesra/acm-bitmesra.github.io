import type { Metadata } from "next";
import { studentResources } from "@/data/resources";
import { ResourcesExplorer } from "@/components/resources/resources-explorer";
import { BookOpen } from "@animateicons/react/lucide";

export const metadata: Metadata = {
  title: "Engineering & Programming Resources | ACM BIT Mesra",
  description:
    "Curated collection of developer roadmaps (roadmap.sh), AlgoForge, Striver A2Z DSA sheet, competitive programming guides, systems textbooks, and developer education for BIT Mesra students.",
  openGraph: {
    title: "Engineering & Programming Resources | ACM BIT Mesra",
    description:
      "Vetted problem sets, contest guides, developer roadmaps (roadmap.sh), OSTEP, AlgoForge, and systems documentation curated by ACM BIT Mesra members for peer learning.",
  },
};

export default function ResourcesPage() {
  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Document Header */}
        <div className="space-y-4 border-b border-border/70 pb-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-muted-foreground">
            <BookOpen className="h-4 w-4 text-foreground" />
            <span>Knowledge Base</span>
            <span>/</span>
            <span>Learning Hub & Curricula</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            Engineering & Developer Resources
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Vetted problem sets, algorithmic pattern roadmaps, systems textbooks, and open-source guides curated by ACM BIT Mesra members and alumni to guide students from first year through ICPC and campus placements.
          </p>
        </div>

        {/* Resources Explorer */}
        <ResourcesExplorer initialResources={studentResources} />
      </div>
    </div>
  );
}
