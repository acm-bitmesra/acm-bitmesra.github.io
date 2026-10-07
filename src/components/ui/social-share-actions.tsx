"use client";

import * as React from "react";
import { Share2, Check, Copy } from "lucide-react";
import { TwitterIcon, LinkedinIcon } from "@/components/ui/icons";

interface SocialShareActionsProps {
  title: string;
  url: string;
  label?: string;
}

export function SocialShareActions({
  title,
  url,
  label = "Share",
}: SocialShareActionsProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} | ACM BIT Mesra`,
          url,
        });
      } catch {
        // User cancelled or share is unavailable.
      }
      return;
    }

    await handleCopy();
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${title} via @acmbitmesra`
  )}&url=${encodeURIComponent(url)}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  const iconButton =
    "inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]";

  return (
    <div className="flex items-center gap-2">
      <span className="sr-only">{label}</span>

      <button
        type="button"
        onClick={handleCopy}
        title="Copy event link"
        aria-label={copied ? "Event link copied" : `Copy link for ${title}`}
        className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-500" />
            <span className="hidden sm:inline">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copy link</span>
          </>
        )}
      </button>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${title} on X`}
        title="Share on X"
        className={iconButton}
      >
        <TwitterIcon className="h-4 w-4" />
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${title} on LinkedIn`}
        title="Share on LinkedIn"
        className={iconButton}
      >
        <LinkedinIcon className="h-4 w-4" />
      </a>

      <button
        type="button"
        onClick={handleNativeShare}
        aria-label="Share event"
        title="Share event"
        className={`${iconButton} sm:hidden`}
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}
