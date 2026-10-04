import { getAuthorizedMember } from "@/lib/auth/session";
import { getAdminPosts } from "@/db/queries/admin-blog";
import { getAllChapterEvents } from "@/db/queries/events";
import { getSystemHealthReport } from "@/db/queries/system";
import { HandoverConsole } from "@/components/admin/handover-console";

export const dynamic = "force-dynamic";

export default async function AdminHandoverPage() {
  await getAuthorizedMember();

  const [posts, events, system] = await Promise.all([
    getAdminPosts("ALL"),
    getAllChapterEvents(),
    getSystemHealthReport(),
  ]);

  const published = posts.filter((p) => p.status === "PUBLISHED");

  const stats = {
    totalArticles: published.length,
    totalEvents: events.length,
    activeAdmins: system.metrics.superAdmins,
    archivedMembers: Math.max(0, system.metrics.totalMembers - system.metrics.superAdmins),
  };

  return (
    <HandoverConsole
      term="2024–2025"
      nextTerm="2025–2026"
      stats={stats}
    />
  );
}
