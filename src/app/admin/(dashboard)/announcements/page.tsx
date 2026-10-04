import { getAuthorizedMember } from "@/lib/auth/session";
import { getAllChapterAnnouncements } from "@/db/queries/announcements";
import { AnnouncementsManager } from "@/components/admin/announcements-manager";
import { Bell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  await getAuthorizedMember();
  const announcements = await getAllChapterAnnouncements();

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#E31B23] uppercase tracking-wider mb-1">
          <Bell className="h-3.5 w-3.5" />
          <span>Chapter Broadcast Network</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Announcements & Site Banners</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Broadcast time-sensitive notices, contest registration deadlines, and seasonal announcements across the public website.
        </p>
      </div>

      <AnnouncementsManager initialAnnouncements={announcements} />
    </div>
  );
}
