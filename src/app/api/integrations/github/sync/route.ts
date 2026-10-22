import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { getConnectedAccountByProvider, upsertConnectedAccount } from "@/db/queries/students";

export async function POST(_req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await getConnectedAccountByProvider(session.user.id, "github");
    if (!existing) {
      return NextResponse.json({ error: "No linked GitHub account found" }, { status: 404 });
    }

    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(existing.handle)}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ACM-BIT-Mesra-Platform",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API returned status ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const currentMeta = (existing.metadata || {}) as Record<string, unknown>;

    await upsertConnectedAccount({
      userId: session.user.id,
      provider: "github",
      providerUserId: existing.providerUserId || undefined,
      handle: existing.handle,
      profileUrl: existing.profileUrl,
      isVerified: existing.isVerified,
      scopes: existing.scopes,
      metadata: {
        ...currentMeta,
        publicRepos: data.public_repos ?? currentMeta.publicRepos,
        publicGists: data.public_gists ?? currentMeta.publicGists,
        followers: data.followers ?? currentMeta.followers,
        following: data.following ?? currentMeta.following,
        bio: data.bio ?? currentMeta.bio,
        avatarUrl: data.avatar_url ?? currentMeta.avatarUrl,
        name: data.name ?? currentMeta.name,
      },
      syncStatus: "SUCCESS",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing GitHub data:", error);
    return NextResponse.json({ error: "Failed to sync GitHub account" }, { status: 500 });
  }
}
