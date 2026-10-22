import { redirect } from "next/navigation";
import { getAuthSession, getAuthorizedMember } from "@/lib/auth/session";
import { getStudentProfileByUserId } from "@/db/queries/students";
import { DashboardShell } from "./dashboard-shell";

export const metadata = {
  title: "Student Developer Dashboard | ACM BIT Mesra",
  description: "Official ACM BIT Mesra Student Developer Platform & Identity Portal",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const [profile, authorizedAdmin] = await Promise.all([
    getStudentProfileByUserId(session.user.id),
    getAuthorizedMember(),
  ]);

  return (
    <DashboardShell
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      profileSlug={profile?.slug}
      isAuthorizedAdmin={Boolean(authorizedAdmin)}
    >
      {children}
    </DashboardShell>
  );
}
