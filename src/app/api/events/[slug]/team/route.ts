import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { getChapterEventBySlug } from "@/db/queries/events";
import { createEventTeam, joinEventTeam } from "@/db/queries/event-registrations";
import { recordAuditEvent } from "@/lib/auth/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const event = await getChapterEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await req.json();
    const teamName = typeof body?.teamName === "string" ? body.teamName.trim() : "";

    if (!teamName || teamName.length < 3 || teamName.length > 50) {
      return NextResponse.json(
        { error: "Team name must be between 3 and 50 characters." },
        { status: 400 }
      );
    }

    const team = await createEventTeam(event.id, session.user.id, teamName);

    await recordAuditEvent({
      action: "EVENT_TEAM_CREATED",
      targetType: "EVENT_TEAM",
      targetId: team.id,
      details: { teamName, joinCode: team.joinCode, eventSlug: slug },
    });

    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const event = await getChapterEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await req.json();
    const joinCode = typeof body?.joinCode === "string" ? body.joinCode.trim().toUpperCase() : "";

    if (!joinCode) {
      return NextResponse.json({ error: "Join code is required." }, { status: 400 });
    }

    const team = await joinEventTeam(joinCode, session.user.id);

    await recordAuditEvent({
      action: "EVENT_TEAM_JOINED",
      targetType: "EVENT_TEAM",
      targetId: team.id,
      details: { joinCode, eventSlug: slug },
    });

    return NextResponse.json({ success: true, team });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Failed to join team";
    return NextResponse.json({ error: errMsg }, { status: 400 });
  }
}
