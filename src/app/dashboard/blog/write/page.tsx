import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { getStudentProfileByUserId, getPersonalBlogs } from "@/db/queries/students";
import { BlogWriterClient } from "./blog-writer-client";

export const metadata: Metadata = {
  title: "Write Article — Blog Studio | ACM BIT Mesra",
  description: "Dedicated personal blog writing studio powered by BlockNote for verified BIT Mesra student developers.",
};

interface WriteBlogPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function WriteBlogPage({ searchParams }: WriteBlogPageProps) {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/blog/write");
  }

  const { id } = await searchParams;
  const profile = await getStudentProfileByUserId(session.user.id);
  const blogs = await getPersonalBlogs(session.user.id);

  const initialBlog = id ? blogs.find((b) => b.id === id || b.slug === id) || null : null;

  return (
    <div className="py-2">
      <BlogWriterClient
        initialBlog={initialBlog}
        profileSlug={profile?.slug || null}
      />
    </div>
  );
}
