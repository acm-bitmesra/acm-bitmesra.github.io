import { getAuthSession } from "@/lib/auth/session";
import { getConnectedAccounts } from "@/db/queries/students";
import { ConnectedAccountsView } from "./connected-accounts-view";

export default async function DashboardSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const session = await getAuthSession();
  if (!session?.user) return null;

  const { error, success } = await searchParams;
  const accounts = await getConnectedAccounts(session.user.id);

  return (
    <div className="space-y-6">
      <header className="border-b border-border pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span>Student Developer Platform</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Connected Accounts</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            Connected Accounts & Developer Identities
          </h1>
          <p className="max-w-[64ch] text-sm leading-6 text-muted-foreground sm:text-base">
            Link external developer platforms to verify ownership, automate hackathon evaluation, and enrich your public portfolio.
          </p>
        </div>
      </header>

      <ConnectedAccountsView
        initialAccounts={accounts}
        errorParam={error}
        successParam={success}
      />
    </div>
  );
}
