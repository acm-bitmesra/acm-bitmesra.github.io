import { getAuthSession } from "@/lib/auth/session";
import {
  getActiveAcademicBatches,
  getConnectedAccounts,
  getStudentProfileByUserId,
} from "@/db/queries/students";
import { ProfileEditor } from "./profile-editor";

export default async function DashboardProfilePage() {
  const session = await getAuthSession();
  if (!session?.user) return null;

  const [profile, batches, accounts] = await Promise.all([
    getStudentProfileByUserId(session.user.id),
    getActiveAcademicBatches(),
    getConnectedAccounts(session.user.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Profile & Developer Mini-Site
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Configure your public developer persona, coding accounts (Portfolio, LeetCode, CodePen, GitLab, Codeforces, LinkedIn, DEV.to), and custom theme.
        </p>
      </div>

      <ProfileEditor
        initialProfile={profile}
        initialAccounts={accounts}
        batches={batches}
        userEmail={session.user.email}
      />
    </div>
  );
}
