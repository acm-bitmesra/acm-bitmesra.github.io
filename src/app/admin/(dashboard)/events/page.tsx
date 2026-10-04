import { getAuthorizedMember } from "@/lib/auth/session";
import { getAllChapterEvents } from "@/db/queries/events";
import { EventsManager } from "@/components/admin/events-manager";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await getAuthorizedMember();
  const events = await getAllChapterEvents();

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#E31B23] uppercase tracking-wider mb-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>Chapter Activities & Tournaments</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Events & Contests Console</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage upcoming hackathons (Hack-A-Bit), competitive programming contests (CodeZilla / CQM), and technical workshops.
        </p>
      </div>

      <EventsManager initialEvents={events} />
    </div>
  );
}
