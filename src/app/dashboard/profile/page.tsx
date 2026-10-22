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
      <header className="border-b border-border pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span>Student Developer Platform</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Profile & Mini-Site</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            Profile & Developer Mini-Site
          </h1>
          <p className="max-w-[64ch] text-sm leading-6 text-muted-foreground sm:text-base">
            Configure your verified public developer portfolio, coding platforms, pinned projects, and custom layout theme.
          </p>
        </div>
      </header>

      <ProfileEditor
        initialProfile={profile}
        initialAccounts={accounts}
        batches={batches}
        userEmail={session.user.email}
      />
    </div>
  );
}
