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
    const rawHandle = typeof body?.handle === "string" ? body.handle.trim() : "";

    if (!ALLOWED_PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: "Unsupported integration provider" }, { status: 400 });
    }

    if (!rawHandle) {
      return NextResponse.json({ error: "Handle is required" }, { status: 400 });
    }

    // Sanitize handle: only alphanumeric, dash, dot, underscore, max 60 chars
    const sanitizedHandle = rawHandle.replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 60);
    if (!sanitizedHandle && provider !== "portfolio") {
      return NextResponse.json({ error: "Handle contains invalid characters" }, { status: 400 });
    }

    let profileUrl = "";
    switch (provider) {
      case "leetcode":
        profileUrl = `https://leetcode.com/u/${sanitizedHandle}`;
        break;
      case "gitlab":
        profileUrl = `https://gitlab.com/${sanitizedHandle}`;
        break;
      case "codepen":
        profileUrl = `https://codepen.io/${sanitizedHandle}`;
        break;
      case "devto":
        profileUrl = `https://dev.to/${sanitizedHandle}`;
        break;
      case "linkedin":
        profileUrl = `https://linkedin.com/in/${sanitizedHandle}`;
        break;
      case "portfolio": {
        const rawUrl = typeof body?.profileUrl === "string" ? body.profileUrl.trim() : rawHandle;
        try {
          const parsed = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
          if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
            return NextResponse.json({ error: "Invalid portfolio URL scheme" }, { status: 400 });
          }
          // Prevent localhost, loopback, or private IP addresses (anti-SSRF)
          const host = parsed.hostname.toLowerCase();
          if (
            host === "localhost" ||
            host === "127.0.0.1" ||
            host.startsWith("10.") ||
            host.startsWith("192.168.") ||
            host.startsWith("172.16.") ||
            host.startsWith("172.31.") ||
            host === "169.254.169.254"
          ) {
            return NextResponse.json({ error: "Private or loopback URLs are not permitted" }, { status: 400 });
          }
          profileUrl = parsed.toString().slice(0, 300);
        } catch {
          return NextResponse.json({ error: "Invalid portfolio URL format" }, { status: 400 });
        }
        break;
      }
      default:
        return NextResponse.json({ error: "Unsupported integration provider" }, { status: 400 });
    }

    await upsertConnectedAccount({
      userId: session.user.id,
      provider,
      handle: sanitizedHandle || rawHandle.slice(0, 60),
      profileUrl,
      isVerified: false, // self-reported external links
      syncStatus: "SUCCESS",
    });

    return NextResponse.json({ success: true, profileUrl });
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
