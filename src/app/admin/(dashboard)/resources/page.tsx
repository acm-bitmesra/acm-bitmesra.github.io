import { getAuthorizedMember } from "@/lib/auth/session";
import { getAllChapterResources } from "@/db/queries/resources";
import { ResourcesManager } from "@/components/admin/resources-manager";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  await getAuthorizedMember();
  const resources = await getAllChapterResources();

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#E31B23] uppercase tracking-wider mb-1">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Curated Engineering Knowledge Hub</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Resources & Learning Tracks</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Catalog and manage authoritative interview roadmaps, systems design primers, academic materials, and competitive programming guides.
        </p>
      </div>

      <ResourcesManager initialResources={resources} />
    </div>
  );
}
