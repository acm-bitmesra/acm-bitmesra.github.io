import { getAuthorizedMember } from "@/lib/auth/session";
import { getAllChapterRedirects } from "@/db/queries/governance";
import { RedirectsManager } from "@/components/admin/redirects-manager";
import { ArrowRightLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminRedirectsPage() {
  await getAuthorizedMember();

  const rawRedirects = await getAllChapterRedirects();
  const redirects = rawRedirects.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt),
  }));

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>Traffic & Routing Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            URL Redirects & Shortlinks Console
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create vanity shortlinks for events, flyers, and campaign traffic with loop-prevention safeguards.
          </p>
        </div>
      </div>

      <RedirectsManager initialRedirects={redirects} />
    </div>
  );
}
