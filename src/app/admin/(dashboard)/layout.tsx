import { redirect } from "next/navigation";
import { getAuthorizedMember, getAuthSession } from "@/lib/auth/session";
import { AdminNavbar } from "@/components/admin/admin-navbar";

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

  return (
    <div className="min-h-screen bg-[#080808] text-foreground flex flex-col">
      <AdminNavbar context={context} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
