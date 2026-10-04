import type { Metadata } from "next";
import { getAllChapterGalleryItems } from "@/db/queries/gallery";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const metadata: Metadata = {
  title: "Gallery Curation | ACM BIT Mesra Command Center",
};

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await getAllChapterGalleryItems();

  return <GalleryManager initialItems={items} />;
}
