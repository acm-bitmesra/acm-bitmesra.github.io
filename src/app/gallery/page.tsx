import type { Metadata } from "next";
import { galleryItems } from "@/data/gallery";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const metadata: Metadata = {
  title: "Visual Gallery & Campus Archive",
  description:
    "Explore moments, hackathons, lab workshops, and collegiate coding contests at ACM BIT Mesra.",
};

export default function GalleryPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-10">
        {/* Document Header */}
        <div className="space-y-3 border-b border-border pb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Chapter Gallery
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            Visual archive of Hack-A-Bit editions, CodeZilla onsite rounds, systems workshops, and community events at BIT Mesra.
          </p>
        </div>

        {/* Gallery Grid */}
        <GalleryGrid items={galleryItems} />
      </div>
    </div>
  );
}
