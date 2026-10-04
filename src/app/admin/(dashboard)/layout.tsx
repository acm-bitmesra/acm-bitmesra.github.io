import { redirect } from "next/navigation";
import { getAuthorizedMember, getAuthSession } from "@/lib/auth/session";
import { AdminAppShell } from "@/components/admin/admin-app-shell";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getAuthorizedMember();

  if (!context) {
    const session = await getAuthSession();
    if (!session) {
      redirect("/admin/login");
    } else {
      redirect("/admin/unauthorized");
    }
  }

  return <AdminAppShell context={context}>{children}</AdminAppShell>;
}
