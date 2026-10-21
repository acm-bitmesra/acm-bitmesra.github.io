import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { upsertConnectedAccount } from "@/db/queries/students";
import { recordAuditEvent } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const handle = typeof body?.handle === "string" ? body.handle.trim() : "";

    if (!handle || !/^[a-zA-Z0-9_.-]{3,30}$/.test(handle)) {
      return NextResponse.json(
        { error: "Invalid Codeforces handle format" },
        { status: 400 }
      );
    }

    // Query official Codeforces API
    const cfRes = await fetch(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
      {
        headers: {
          "User-Agent": "ACM-BIT-Mesra-Platform",
        },
      }
    );

    if (!cfRes.ok) {
      return NextResponse.json(
        { error: "Codeforces API error. Please try again later." },
        { status: 502 }
      );
    }

    const cfData = await cfRes.json();
    if (cfData.status !== "OK" || !cfData.result || cfData.result.length === 0) {
      return NextResponse.json(
        { error: `Codeforces user '${handle}' not found.` },
        { status: 404 }
      );
    }

    const userInfo = cfData.result[0];

    await upsertConnectedAccount({
      userId: session.user.id,
      provider: "codeforces",
      handle: userInfo.handle,
      profileUrl: `https://codeforces.com/profile/${encodeURIComponent(userInfo.handle)}`,
      isVerified: true,
      metadata: {
        rating: userInfo.rating || 0,
        maxRating: userInfo.maxRating || 0,
        rank: userInfo.rank || "unrated",
        maxRank: userInfo.maxRank || "unrated",
        contribution: userInfo.contribution || 0,
        avatar: userInfo.avatar,
        titlePhoto: userInfo.titlePhoto,
      },
      syncStatus: "SUCCESS",
    });

    await recordAuditEvent({
      action: "INTEGRATION_CONNECTED",
      targetType: "CONNECTED_ACCOUNT",
      targetId: `conn_codeforces_${session.user.id}`,
      details: {
        provider: "CODEFORCES",
        handle: userInfo.handle,
        rating: userInfo.rating,
      },
    });

    return NextResponse.json({
      success: true,
      profile: {
        handle: userInfo.handle,
        rating: userInfo.rating || 0,
        rank: userInfo.rank || "unrated",
      },
    });
  } catch (error) {
    console.error("Error connecting Codeforces handle:", error);
    return NextResponse.json(
      { error: "Failed to connect Codeforces handle" },
      { status: 500 }
    );
  }
}
