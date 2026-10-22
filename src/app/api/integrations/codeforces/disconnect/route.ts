import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { disconnectConnectedAccount } from "@/db/queries/students";
import { recordAuditEvent } from "@/lib/auth/audit";

export async function POST(_req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await disconnectConnectedAccount(session.user.id, "codeforces");

    await recordAuditEvent({
      action: "INTEGRATION_DISCONNECTED",
      targetType: "CONNECTED_ACCOUNT",
      targetId: `conn_codeforces_${session.user.id}`,
      details: {
        provider: "codeforces",
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting Codeforces:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Codeforces account" },
      { status: 500 }
    );
  }
}
