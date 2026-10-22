import { getAllAcademicBatches } from "@/db/queries/students";
import { BatchManager } from "./batch-manager";

export const metadata = {
  title: "Academic Batches | ACM BIT Mesra Command Center",
};

export default async function AdminBatchesPage() {
  const batches = await getAllAcademicBatches();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Academic Batches & Cohorts
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage university graduating batches, cohort identifiers, and profile classification.
        </p>
      </div>

      <BatchManager initialBatches={batches} />
    </div>
  );
}
