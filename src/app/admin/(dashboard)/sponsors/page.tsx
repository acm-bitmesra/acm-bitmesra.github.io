import type { Metadata } from "next";
import { getAllChapterSponsors } from "@/db/queries/sponsors";
import { SponsorsManager } from "@/components/admin/sponsors-manager";

export const metadata: Metadata = {
  title: "Sponsors & Partners | ACM BIT Mesra Command Center",
};

export const dynamic = "force-dynamic";

export default async function AdminSponsorsPage() {
  const sponsors = await getAllChapterSponsors();

  return <SponsorsManager initialSponsors={sponsors} />;
}
