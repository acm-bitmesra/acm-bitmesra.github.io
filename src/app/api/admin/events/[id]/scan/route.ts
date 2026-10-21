import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedMember } from "@/lib/auth/session";
import { runContributionScan } from "@/lib/scanner/contribution-scanner";
import { recordAuditEvent } from "@/lib/auth/audit";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authContext = await getAuthorizedMember();

  if (!authContext) {
    return NextResponse.json({ error: "Forbidden: Administrative access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const result = await runContributionScan(id, authContext.member.id);

    await recordAuditEvent({
      action: "CONTRIBUTION_SCAN_TRIGGERED",
      memberId: authContext.member.id,
      targetType: "EVENT",
      targetId: id,
      details: result,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Admin scan error:", error);
    return NextResponse.json({ error: "Scan execution failed" }, { status: 500 });
  }
}
