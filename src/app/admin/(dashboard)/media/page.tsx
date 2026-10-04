import { getAuthorizedMember } from "@/lib/auth/session";
import { getAllChapterMedia } from "@/db/queries/governance";
import { MediaLibrary } from "@/components/admin/media-library";
import { Image as ImageIcon, HardDrive } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await getAuthorizedMember();

  const dbMedia = await getAllChapterMedia();

  // Static built-in fallback assets if database has not recorded custom uploads yet
  const defaultStaticMedia = [
    {
      id: "media_logo_svg",
      filename: "acm-logo.svg",
      url: "/images/branding/acm-logo.svg",
      mimeType: "image/svg+xml",
      sizeBytes: 8420,
      category: "BRANDING",
    },
    {
      id: "media_logo_png",
      filename: "acm-logo.png",
      url: "/images/branding/acm-logo.png",
      mimeType: "image/png",
      sizeBytes: 45200,
      category: "BRANDING",
    },
    {
      id: "media_og_image",
      filename: "og-image.png",
      url: "/images/branding/og-image.png",
      mimeType: "image/png",
      sizeBytes: 184000,
      category: "BRANDING",
    },
    {
      id: "media_hackabit",
      filename: "hack-a-bit.svg",
      url: "/images/events/hack-a-bit.svg",
      mimeType: "image/svg+xml",
      sizeBytes: 12400,
      category: "EVENTS",
    },
    {
      id: "media_codezilla",
      filename: "codezilla.svg",
      url: "/images/events/codezilla.svg",
      mimeType: "image/svg+xml",
      sizeBytes: 11200,
      category: "EVENTS",
    },
    {
      id: "media_hacktoberfest",
      filename: "hacktoberfest-2026-og.png",
      url: "/images/events/hacktoberfest-2026-og.png",
      mimeType: "image/png",
      sizeBytes: 145000,
      category: "EVENTS",
    },
    {
      id: "media_sumit",
      filename: "dr-sumit-srivastava.jpg",
      url: "/images/team/dr-sumit-srivastava.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 68400,
      category: "TEAM",
    },
    {
      id: "media_shaswat",
      filename: "shaswat-raj.jpg",
      url: "/images/team/shaswat-raj.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 74200,
      category: "TEAM",
    },
  ];

  const allMedia = dbMedia.length > 0 ? dbMedia : defaultStaticMedia;

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E31B23] uppercase tracking-wider mb-1">
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Asset Storage & CDN</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Media Library & Static Assets
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Visual branding assets, event banners, vector badges, and article covers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-zinc-900 border border-zinc-800 text-zinc-400">
            <HardDrive className="h-3.5 w-3.5" />
            <span>Cloudflare Edge / Static CDN</span>
          </span>
        </div>
      </div>

      <MediaLibrary initialMedia={allMedia} />
    </div>
  );
}
