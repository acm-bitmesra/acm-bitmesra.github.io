import { getAuthSession } from "@/lib/auth/session";
import { getUserRegistrationsWithEvents } from "@/db/queries/event-registrations";
import { RegisteredEventsView } from "./registered-events-view";

export default async function DashboardEventsPage() {
  const session = await getAuthSession();
  if (!session?.user) return null;

  const registrations = await getUserRegistrationsWithEvents(session.user.id);

  return (
    <div className="space-y-6">
      <header className="border-b border-border pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span>Student Developer Platform</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Events</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            Event Participation & Registrations
          </h1>
          <p className="max-w-[64ch] text-sm leading-6 text-muted-foreground sm:text-base">
            View your registered workshops, hackathon teams, attendance status, and competition history.
          </p>
        </div>
      </header>

      <RegisteredEventsView registrations={registrations} />
    </div>
  );
}
