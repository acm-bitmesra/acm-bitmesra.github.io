import type { Metadata } from "next";
import { galleryItems } from "@/data/gallery";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Visual Gallery & Campus Archive",
  description:
    "Explore moments, hackathons, lab workshops, and collegiate coding contests at ACM BIT Mesra.",
};

export default function GalleryPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <Camera className="h-4 w-4" />
            <span>Visual Archive · Moments & Events</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Chapter Gallery
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Snapshots of intense 36-hour hackathons, onsite CodeZilla algorithmic rounds, hands-on Linux and web development workshops, and campus life at BIT Mesra.
          </p>
        </div>

        {/* Gallery Grid */}
        <GalleryGrid items={galleryItems} />
      </div>
    </div>
  );
}
