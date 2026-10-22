import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { env } from "@/config/env";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  const searchParams = req.nextUrl.searchParams;
  const returnTo = searchParams.get("returnTo") || searchParams.get("callbackUrl") || "/dashboard/settings";

  if (!session?.user) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(returnTo)}`, req.url));
  }

  if (!env.GITHUB_CLIENT_ID) {
    return NextResponse.redirect(
      new URL(`/dashboard/settings?error=github_not_configured`, req.url)
    );
  }

  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("gh_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  cookieStore.set("gh_oauth_return_to", returnTo, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  const redirectUri = `${new URL(req.url).origin}/api/integrations/github/callback`;
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthUrl.searchParams.set("scope", "read:user,user:email");
  githubAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(githubAuthUrl.toString());
}
