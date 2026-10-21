import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { getChapterEventBySlug } from "@/db/queries/events";
import {
  cancelRegistration,
  getEventRegistrations,
  registerForEvent,
} from "@/db/queries/event-registrations";
import { recordAuditEvent } from "@/lib/auth/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in with your university account." }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const event = await getChapterEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "UPCOMING" && event.status !== "ONGOING") {
      return NextResponse.json(
        { error: "Registrations are not open for this event." },
        { status: 400 }
      );
    }

    // Check capacity if set
    if (event.maxParticipants && event.maxParticipants > 0) {
      const existingRegistrations = await getEventRegistrations(event.id);
      const activeCount = existingRegistrations.filter((r) => r.status === "REGISTERED" || r.status === "CHECKED_IN").length;
      if (activeCount >= event.maxParticipants) {
        return NextResponse.json(
          { error: "Event has reached maximum capacity." },
          { status: 400 }
        );
      }
    }

    const { getConnectedAccountByProvider } = await import("@/db/queries/students");
    const ghAccount = await getConnectedAccountByProvider(session.user.id, "github");

    if (slug === "hacktoberfest-2026" && !ghAccount) {
      return NextResponse.json(
        { error: "A connected GitHub account is required to register for Hacktoberfest 2026. Please connect your GitHub account first." },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const customAnswers = {
      ...(body?.customAnswers && typeof body.customAnswers === "object" ? body.customAnswers : {}),
      ...(ghAccount ? { githubHandle: ghAccount.handle, githubUserId: ghAccount.providerUserId } : {}),
    };

    await registerForEvent(event.id, session.user.id, customAnswers);

    await recordAuditEvent({
      action: "EVENT_REGISTERED",
      targetType: "EVENT",
      targetId: event.id,
      details: { eventSlug: slug, eventTitle: event.title },
    });

    return NextResponse.json({ success: true, message: "Registered successfully!" });
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json({ error: "Failed to register for event" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
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

    await cancelRegistration(event.id, session.user.id);

    await recordAuditEvent({
      action: "EVENT_REGISTRATION_CANCELLED",
      targetType: "EVENT",
      targetId: event.id,
      details: { eventSlug: slug, eventTitle: event.title },
    });

    return NextResponse.json({ success: true, message: "Registration cancelled." });
  } catch (error) {
    console.error("Error cancelling registration:", error);
    return NextResponse.json({ error: "Failed to cancel registration" }, { status: 500 });
  }
}
