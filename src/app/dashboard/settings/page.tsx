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
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Connected Accounts & Developer Identities
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Link external developer platforms to verify ownership, automate hackathon participation, and enrich your public mini-site.
        </p>
      </div>

      <ConnectedAccountsView
        initialAccounts={accounts}
        errorParam={error}
        successParam={success}
      />
    </div>
  );
}
