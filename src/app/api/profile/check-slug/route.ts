import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { checkSlugAvailable } from "@/db/queries/students";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  const searchParams = req.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ available: false, error: "Slug is required" }, { status: 400 });
  }

  const available = await checkSlugAvailable(slug, session?.user?.id);
  return NextResponse.json({ available, slug: slug.toLowerCase() });
}
