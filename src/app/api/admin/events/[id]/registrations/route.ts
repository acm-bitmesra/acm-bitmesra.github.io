import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedMember } from "@/lib/auth/session";
import {
  getEventRegistrations,
  updateRegistrationStatus,
} from "@/db/queries/event-registrations";
import { recordAuditEvent } from "@/lib/auth/audit";
import type { RegistrationStatus } from "@/db/schema/event-registrations";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authContext = await getAuthorizedMember();

  if (!authContext) {
    return NextResponse.json(
      { error: "Forbidden: Administrative access required" },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const registrations = await getEventRegistrations(id);
    return NextResponse.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error("Error fetching admin event registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch event registrations" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authContext = await getAuthorizedMember();

  if (!authContext) {
    return NextResponse.json(
      { error: "Forbidden: Administrative access required" },
      { status: 403 }
    );
  }

  try {
    const { id: eventId } = await params;
    const body = await req.json();
    const registrationId = typeof body?.registrationId === "string" ? body.registrationId.trim() : "";
    const status = typeof body?.status === "string" ? (body.status as RegistrationStatus) : null;
    const notes = typeof body?.notes === "string" ? body.notes.slice(0, 500) : undefined;

    if (!registrationId || !status) {
      return NextResponse.json(
        { error: "Missing registrationId or status parameter" },
        { status: 400 }
      );
    }

    const validStatuses: RegistrationStatus[] = [
      "REGISTERED",
      "WAITLISTED",
      "CANCELLED",
      "CHECKED_IN",
      "COMPLETED",
      "NO_SHOW",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid registration status value" },
        { status: 400 }
      );
    }

    const updated = await updateRegistrationStatus(registrationId, status, notes);

    await recordAuditEvent({
      action: "EVENT_REGISTRATION_STATUS_UPDATED",
      memberId: authContext.member.id,
      targetType: "EVENT",
      targetId: eventId,
      details: {
        registrationId,
        newStatus: status,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      updated,
    });
  } catch (error) {
    console.error("Error updating registration status:", error);
    return NextResponse.json(
      { error: "Failed to update registration status" },
      { status: 500 }
    );
  }
}
