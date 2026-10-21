import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { disconnectConnectedAccount, upsertConnectedAccount } from "@/db/queries/students";
import type { ConnectedProvider } from "@/db/schema/students";

const ALLOWED_PROVIDERS: ConnectedProvider[] = [
  "leetcode",
  "gitlab",
  "codepen",
  "devto",
  "linkedin",
  "portfolio",
];

export async function POST(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const provider = (body?.provider ? String(body.provider).toLowerCase() : "") as ConnectedProvider;
    const handle = typeof body?.handle === "string" ? body.handle.trim() : "";
    let profileUrl = typeof body?.profileUrl === "string" ? body.profileUrl.trim() : "";

    if (!ALLOWED_PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: "Unsupported integration provider" }, { status: 400 });
    }

    if (!handle) {
      return NextResponse.json({ error: "Handle is required" }, { status: 400 });
    }

    // Auto-generate profileUrl if not supplied or invalid
    if (!profileUrl.startsWith("http")) {
      switch (provider) {
        case "leetcode":
          profileUrl = `https://leetcode.com/u/${handle}`;
          break;
        case "gitlab":
          profileUrl = `https://gitlab.com/${handle}`;
          break;
        case "codepen":
          profileUrl = `https://codepen.io/${handle}`;
          break;
        case "devto":
          profileUrl = `https://dev.to/${handle}`;
          break;
        case "linkedin":
          profileUrl = `https://linkedin.com/in/${handle}`;
          break;
        default:
          profileUrl = `https://${handle}`;
          break;
      }
    }

    await upsertConnectedAccount({
      userId: session.user.id,
      provider,
      handle,
      profileUrl,
      isVerified: false, // self-reported external links
      syncStatus: "SUCCESS",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving custom integration:", error);
    return NextResponse.json({ error: "Failed to save link" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const provider = (searchParams.get("provider")?.toLowerCase() || "") as ConnectedProvider;

    if (!provider || !ALLOWED_PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    await disconnectConnectedAccount(session.user.id, provider);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting custom integration:", error);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
