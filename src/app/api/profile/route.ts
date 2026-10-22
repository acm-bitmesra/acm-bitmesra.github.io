import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import {
  checkSlugAvailable,
  disconnectConnectedAccount,
  getConnectedAccounts,
  getStudentProfileByUserId,
  upsertConnectedAccount,
  upsertStudentProfile,
} from "@/db/queries/students";
import type { ConnectedProvider } from "@/db/schema/students";
import { recordAuditEvent } from "@/lib/auth/audit";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await getStudentProfileByUserId(session.user.id);
    const accounts = await getConnectedAccounts(session.user.id);

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      profile,
      connectedAccounts: accounts,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim().toLowerCase() : "";

    if (!slug) {
      return NextResponse.json({ error: "Profile URL slug is required" }, { status: 400 });
    }

    // Validate slug format
    const isAvailable = await checkSlugAvailable(slug, session.user.id);
    if (!isAvailable) {
      return NextResponse.json(
        { error: "Slug is either taken, reserved, or invalid (must be 3-30 lowercase alphanum characters)." },
        { status: 409 }
      );
    }

    await upsertStudentProfile(session.user.id, {
      slug,
      displayName: typeof body?.displayName === "string" ? body.displayName : (session.user.name || slug),
      avatarUrl: typeof body?.avatarUrl === "string" ? body.avatarUrl : (session.user.image || undefined),
      bio: typeof body?.bio === "string" ? body.bio.slice(0, 1000) : undefined,
      academicProgram: typeof body?.academicProgram === "string" ? body.academicProgram : "B.Tech",
      department: typeof body?.department === "string" ? body.department : undefined,
      batchId: typeof body?.batchId === "string" && body.batchId.length > 0 ? body.batchId : null,
      skills: Array.isArray(body?.skills) ? body.skills.filter((s: unknown) => typeof s === "string") : [],
      interests: Array.isArray(body?.interests) ? body.interests.filter((s: unknown) => typeof s === "string") : [],
      customBioMarkdown: typeof body?.customBioMarkdown === "string" ? body.customBioMarkdown : undefined,
      portfolioBlocks: [
        {
          type: "projects" as const,
          title: "Pinned Projects",
          content: Array.isArray(body?.pinnedProjects) ? body.pinnedProjects : [],
        },
        {
          type: "blogs" as const,
          title: "Personal Blogs",
          content: Array.isArray(body?.personalBlogs) ? body.personalBlogs : [],
        },
        {
          type: "settings" as const,
          title: "Preferences",
          content: {
            showEmail: Boolean(body?.showEmail),
            resumeUrl: typeof body?.resumeUrl === "string" ? body.resumeUrl.trim() : "",
            showGithubStats: Boolean(body?.showGithubStats),
            showSkillIcons: Boolean(body?.showSkillIcons),
            statsTheme: typeof body?.statsTheme === "string" ? body.statsTheme : "github_dark",
          },
        },
      ],
      isPublic: typeof body?.isPublic === "boolean" ? body.isPublic : true,
      isPublished: typeof body?.isPublished === "boolean" ? body.isPublished : true,
      theme: typeof body?.theme === "string" ? body.theme : "minimal",
    });

    // Update Connected Coding & Social Accounts
    if (body.accounts && typeof body.accounts === "object") {
      const accounts = body.accounts as Record<string, unknown>;

      const accountConfigs: Array<{
        provider: ConnectedProvider;
        val?: unknown;
        formatUrl: (val: string) => { handle: string; profileUrl: string };
      }> = [
        {
          provider: "portfolio",
          val: accounts.portfolio,
          formatUrl: (v) => {
            const url = v.startsWith("http") ? v : `https://${v}`;
            return { handle: "Portfolio", profileUrl: url };
          },
        },
        {
          provider: "leetcode",
          val: accounts.leetcode,
          formatUrl: (v) => {
            const handle = v.replace(/https?:\/\/(www\.)?leetcode\.com\/(u\/)?/gi, "").replace(/\/+$/, "");
            return { handle, profileUrl: `https://leetcode.com/u/${handle}` };
          },
        },
        {
          provider: "codepen",
          val: accounts.codepen,
          formatUrl: (v) => {
            const handle = v.replace(/https?:\/\/(www\.)?codepen\.io\//gi, "").replace(/\/+$/, "");
            return { handle, profileUrl: `https://codepen.io/${handle}` };
          },
        },
        {
          provider: "gitlab",
          val: accounts.gitlab,
          formatUrl: (v) => {
            const handle = v.replace(/https?:\/\/(www\.)?gitlab\.com\//gi, "").replace(/\/+$/, "");
            return { handle, profileUrl: `https://gitlab.com/${handle}` };
          },
        },
        {
          provider: "codeforces",
          val: accounts.codeforces,
          formatUrl: (v) => {
            const handle = v.replace(/https?:\/\/(www\.)?codeforces\.com\/profile\//gi, "").replace(/\/+$/, "");
            return { handle, profileUrl: `https://codeforces.com/profile/${handle}` };
          },
        },
        {
          provider: "linkedin",
          val: accounts.linkedin,
          formatUrl: (v) => {
            const handle = v.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//gi, "").replace(/\/+$/, "");
            return { handle, profileUrl: v.startsWith("http") ? v : `https://www.linkedin.com/in/${handle}` };
          },
        },
        {
          provider: "devto",
          val: accounts.devto,
          formatUrl: (v) => {
            const handle = v.replace(/https?:\/\/(www\.)?dev\.to\//gi, "").replace(/\/+$/, "");
            return { handle, profileUrl: `https://dev.to/${handle}` };
          },
        },
        {
          provider: "hashnode",
          val: accounts.hashnode,
          formatUrl: (v) => {
            const handle = v.replace(/https?:\/\/(www\.)?hashnode\.com\/@?/gi, "").replace(/\/+$/, "");
            return { handle, profileUrl: `https://hashnode.com/@${handle}` };
          },
        },
        {
          provider: "codechef",
          val: accounts.codechef,
          formatUrl: (v) => {
            const handle = v.replace(/https?:\/\/(www\.)?codechef\.com\/users\//gi, "").replace(/\/+$/, "");
            return { handle, profileUrl: `https://www.codechef.com/users/${handle}` };
          },
        },
        {
          provider: "peerlist",
          val: accounts.peerlist,
          formatUrl: (v) => {
            const handle = v.replace(/https?:\/\/(www\.)?peerlist\.io\//gi, "").replace(/\/+$/, "");
            return { handle, profileUrl: `https://peerlist.io/${handle}` };
          },
        },
        {
          provider: "notionfolio",
          val: accounts.notionfolio,
          formatUrl: (v) => {
            const url = v.startsWith("http") ? v : `https://${v}`;
            return { handle: "Notionfolio", profileUrl: url };
          },
        },
      ];

      for (const item of accountConfigs) {
        if (typeof item.val === "string" && item.val.trim().length > 0) {
          const { handle, profileUrl } = item.formatUrl(item.val.trim());
          if (handle) {
            await upsertConnectedAccount({
              userId: session.user.id,
              provider: item.provider,
              handle,
              profileUrl,
              isVerified: false,
            });
          }
        } else if (item.val === "" || item.val === null) {
          // Cleared by user
          await disconnectConnectedAccount(session.user.id, item.provider);
        }
      }
    }

    await recordAuditEvent({
      action: "PROFILE_UPDATED",
      targetType: "STUDENT_PROFILE",
      targetId: session.user.id,
      details: { slug, rollNumber: body?.rollNumber },
    });

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
