import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { env } from "@/config/env";
import { cookies } from "next/headers";
import {
  findConnectedAccountByProviderId,
  upsertConnectedAccount,
} from "@/db/queries/students";
import { recordAuditEvent } from "@/lib/auth/audit";

interface GitHubUserResponse {
  id: number;
  login: string;
  name?: string | null;
  avatar_url?: string;
  html_url: string;
  bio?: string | null;
  public_repos?: number;
  public_gists?: number;
  followers?: number;
  following?: number;
  created_at?: string;
}

export async function GET(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login?callbackUrl=/dashboard/settings", req.url));
  }

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/dashboard/settings?error=${encodeURIComponent(errorParam)}`, req.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=missing_oauth_parameters", req.url)
    );
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("gh_oauth_state")?.value;

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=invalid_csrf_state", req.url)
    );
  }

  // Clear CSRF state cookie
  cookieStore.delete("gh_oauth_state");

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenRes.ok) {
      throw new Error(`GitHub token exchange failed with status ${tokenRes.status}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      const errorMsg = tokenData.error_description || tokenData.error || "no_access_token";
      return NextResponse.redirect(
        new URL(`/dashboard/settings?error=${encodeURIComponent(errorMsg)}`, req.url)
      );
    }

    // 2. Fetch authenticated GitHub profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ACM-BIT-Mesra-Platform",
      },
    });

    if (!userRes.ok) {
      throw new Error(`Failed to fetch user from GitHub API: ${userRes.status}`);
    }

    const ghUser: GitHubUserResponse = await userRes.json();
    const providerUserId = String(ghUser.id);

    // 3. Ownership / Conflict Check: has another student already linked this GitHub account?
    const existing = await findConnectedAccountByProviderId("github", providerUserId);
    if (existing && existing.userId !== session.user.id) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/settings?error=github_already_linked_to_another_student",
          req.url
        )
      );
    }

    // 4. Upsert connected account record
    await upsertConnectedAccount({
      userId: session.user.id,
      provider: "github",
      providerUserId,
      handle: ghUser.login,
      profileUrl: ghUser.html_url,
      isVerified: true,
      scopes: ["read:user", "user:email"],
      metadata: {
        id: ghUser.id,
        login: ghUser.login,
        name: ghUser.name,
        avatarUrl: ghUser.avatar_url,
        bio: ghUser.bio,
        publicRepos: ghUser.public_repos ?? 0,
        publicGists: ghUser.public_gists ?? 0,
        followers: ghUser.followers ?? 0,
        following: ghUser.following ?? 0,
        createdAt: ghUser.created_at,
      },
      syncStatus: "SUCCESS",
    });

    // 5. Immutable Audit Log
    await recordAuditEvent({
      action: "INTEGRATION_CONNECTED",
      targetType: "CONNECTED_ACCOUNT",
      targetId: `conn_github_${session.user.id}`,
      details: {
        provider: "GITHUB",
        handle: ghUser.login,
        providerUserId,
      },
    });

    const returnTo = cookieStore.get("gh_oauth_return_to")?.value;
    cookieStore.delete("gh_oauth_return_to");

    if (returnTo && returnTo.startsWith("/")) {
      const separator = returnTo.includes("?") ? "&" : "?";
      return NextResponse.redirect(
        new URL(`${returnTo}${separator}github=linked`, req.url)
      );
    }

    return NextResponse.redirect(
      new URL("/dashboard/settings?success=github_linked", req.url)
    );
  } catch (error) {
    console.error("GitHub OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=oauth_processing_failed", req.url)
    );
  }
}
