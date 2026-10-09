import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { blogPageViews } from "@/db/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(_request: Request, { params }: RouteContext) {
  const { slug } = await params;

  if (!SLUG_PATTERN.test(slug) || slug.length > 160) {
    return NextResponse.json({ error: "Invalid article slug" }, { status: 400 });
  }

  try {
    const rows = await db
      .insert(blogPageViews)
      .values({ slug, viewCount: 1, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: blogPageViews.slug,
        set: {
          viewCount: sql`${blogPageViews.viewCount} + 1`,
          updatedAt: new Date(),
        },
      })
      .returning({ views: blogPageViews.viewCount });

    return NextResponse.json(
      { views: rows[0]?.views ?? 1 },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error) {
    console.error("Failed to increment article views", error);
    return NextResponse.json({ error: "View count unavailable" }, { status: 503 });
  }
}
