import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedMember } from "@/lib/auth/session";
import {
  deleteAcademicBatch,
  getAllAcademicBatches,
  upsertAcademicBatch,
} from "@/db/queries/students";
import { recordAuditEvent } from "@/lib/auth/audit";

export async function GET() {
  const batches = await getAllAcademicBatches();
  return NextResponse.json(batches);
}

export async function POST(req: NextRequest) {
  const authContext = await getAuthorizedMember();

  if (!authContext) {
    return NextResponse.json({ error: "Forbidden: Administrative access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const label = typeof body?.label === "string" ? body.label.trim() : (typeof body?.name === "string" ? body.name.trim() : id);
    const endYear = Number(body?.endYear || body?.graduationYear || 2028);
    const startYear = Number(body?.startYear || (endYear - 4));

    if (!id || !label || isNaN(endYear)) {
      return NextResponse.json({ error: "Missing required fields (id, label/name, graduationYear)" }, { status: 400 });
    }

    await upsertAcademicBatch({
      id,
      label,
      startYear,
      endYear,
      program: typeof body?.program === "string" ? body.program : "B.Tech",
      isActive: typeof body?.isActive === "boolean" ? body.isActive : true,
      displayOrder: typeof body?.displayOrder === "number" ? body.displayOrder : 0,
      notes: typeof body?.notes === "string" ? body.notes : undefined,
    });

    await recordAuditEvent({
      action: "ACADEMIC_BATCH_UPSERTED",
      memberId: authContext.member.id,
      targetType: "ACADEMIC_BATCH",
      targetId: id,
      details: { label, startYear, endYear },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Batch save error:", error);
    return NextResponse.json({ error: "Failed to save academic batch" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authContext = await getAuthorizedMember();

  if (!authContext) {
    return NextResponse.json({ error: "Forbidden: Administrative access required" }, { status: 403 });
  }

  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Batch ID required" }, { status: 400 });
    }

    await deleteAcademicBatch(id);

    await recordAuditEvent({
      action: "ACADEMIC_BATCH_DELETED",
      memberId: authContext.member.id,
      targetType: "ACADEMIC_BATCH",
      targetId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Batch delete error:", error);
    return NextResponse.json({ error: "Failed to delete academic batch" }, { status: 500 });
  }
}
