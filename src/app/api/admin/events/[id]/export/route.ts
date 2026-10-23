import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedMember } from "@/lib/auth/session";
import { getEventRegistrations, getEventLeaderboard } from "@/db/queries/event-registrations";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authContext = await getAuthorizedMember();

  if (!authContext) {
    return NextResponse.json({ error: "Forbidden: Administrative access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const format = req.nextUrl.searchParams.get("format") || "csv";
    const type = req.nextUrl.searchParams.get("type") || "registrations";

    if (type === "leaderboard") {
      const leaderboard = await getEventLeaderboard(id);
      const entries = leaderboard?.standings || [];

      if (format === "json") {
        return NextResponse.json(entries);
      }

      // Generate CSV
      const headers = ["Rank", "Name", "GitHub Username", "Total Score", "Approved PRs", "Tie Breaker Score"];
      const rows = entries.map((e) => [
        e.rank,
        `"${(e.displayName || "").replace(/"/g, '""')}"`,
        `"${(e.githubUsername || "").replace(/"/g, '""')}"`,
        e.totalScore,
        e.approvedContributionsCount,
        e.tieBreakerScore ?? 0,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="leaderboard-${id}.csv"`,
        },
      });
    }

    // Default: registrations
    const registrations = await getEventRegistrations(id);

    if (format === "json") {
      return NextResponse.json(registrations);
    }

    const headers = [
      "Registration ID",
      "Name",
      "Email",
      "Contact Number",
      "Status",
      "Department",
      "Batch",
      "GitHub Handle",
      "Team ID",
      "Team Name",
      "Registered At",
      "Checked In At",
    ];

    const rows = registrations.map((r) => [
      `"${r.id}"`,
      `"${(r.user?.name || "").replace(/"/g, '""')}"`,
      `"${(r.user?.email || "").replace(/"/g, '""')}"`,
      `"${(r.contactNo || "").replace(/"/g, '""')}"`,
      r.status,
      `"${(r.profile?.department || "").replace(/"/g, '""')}"`,
      `"${(r.profile?.batch || "").replace(/"/g, '""')}"`,
      `"${(r.githubHandle || "").replace(/"/g, '""')}"`,
      `"${r.teamId || ""}"`,
      `"${(r.team?.name || "").replace(/"/g, '""')}"`,
      r.registeredAt.toISOString(),
      r.checkedInAt ? r.checkedInAt.toISOString() : "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="registrations-${id}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export event data" }, { status: 500 });
  }
}
