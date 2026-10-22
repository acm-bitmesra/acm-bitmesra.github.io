import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { getStudentProfileByUserId, getPersonalBlogs } from "@/db/queries/students";
import { BlogStudioView } from "./blog-studio-view";

export const metadata: Metadata = {
  title: "Blog Studio — ACM BIT Mesra Student Platform",
  description: "Write and manage your personal technical articles and notes using BlockNote.",
};

export default async function BlogStudioPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/blog");
  }

  const [profile, blogs] = await Promise.all([
    getStudentProfileByUserId(session.user.id),
    getPersonalBlogs(session.user.id),
  ]);

  return (
    <div className="py-2">
      <BlogStudioView
        initialBlogs={blogs}
        profileSlug={profile?.slug || null}
      />
    </div>
  );
}
