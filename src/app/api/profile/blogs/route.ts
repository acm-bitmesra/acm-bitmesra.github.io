import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import {
  deletePersonalBlog,
  getPersonalBlogs,
  upsertPersonalBlog,
} from "@/db/queries/students";
import { recordAuditEvent } from "@/lib/auth/audit";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const blogs = await getPersonalBlogs(session.user.id);
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error fetching personal blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const content = typeof body?.content === "string" ? body.content : "";

    if (!title) {
      return NextResponse.json({ error: "Article title is required" }, { status: 400 });
    }

    if (!content.trim()) {
      return NextResponse.json({ error: "Article content cannot be empty" }, { status: 400 });
    }

    const tags = Array.isArray(body?.tags)
      ? body.tags.filter((t: unknown) => typeof t === "string" && t.trim().length > 0)
      : typeof body?.tags === "string"
      ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    const savedBlog = await upsertPersonalBlog(session.user.id, {
      id: typeof body?.id === "string" && body.id ? body.id : undefined,
      title,
      slug: typeof body?.slug === "string" && body.slug.trim() ? body.slug.trim() : undefined,
      excerpt: typeof body?.excerpt === "string" && body.excerpt.trim() ? body.excerpt.trim() : undefined,
      content,
      tags,
    });

    await recordAuditEvent({
      action: "BLOG_POST_SAVED",
      targetType: "STUDENT_BLOG",
      targetId: savedBlog.id,
      details: { title: savedBlog.title, slug: savedBlog.slug },
    });

    return NextResponse.json({ success: true, blog: savedBlog });
  } catch (error) {
    console.error("Error saving personal blog:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const success = await deletePersonalBlog(session.user.id, id);
    if (!success) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    await recordAuditEvent({
      action: "BLOG_POST_DELETED",
      targetType: "STUDENT_BLOG",
      targetId: id,
      details: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting personal blog:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
