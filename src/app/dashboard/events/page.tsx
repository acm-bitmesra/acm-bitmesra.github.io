import { getAuthSession } from "@/lib/auth/session";
import { getUserRegistrationsWithEvents } from "@/db/queries/event-registrations";
import { RegisteredEventsView } from "./registered-events-view";

export default async function DashboardEventsPage() {
  const session = await getAuthSession();
  if (!session?.user) return null;

  const registrations = await getUserRegistrationsWithEvents(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Event Participation & Registrations
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          View your registered workshops, hackathon teams, attendance status, and competition history.
        </p>
      </div>

      <RegisteredEventsView registrations={registrations} />
    </div>
  );
}
