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
  label = "Share:",
}: SocialShareActionsProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        // User cancelled or unsupported
      }
    } else {
      handleCopy();
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${title} via @acmbitmesra`
  )}&url=${encodeURIComponent(url)}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {label && (
        <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
          {label}
        </span>
      )}

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopy}
        title="Copy Link to Clipboard"
        aria-label={`Copy link for ${title} to clipboard`}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border/80 bg-secondary/40 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-emerald-500 font-medium">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Twitter / X Share */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${title} on X (opens in new tab)`}
        title="Share on X"
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border/80 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
      >
        <TwitterIcon className="h-4 w-4" />
        <span className="sr-only">Share on X</span>
      </a>

      {/* LinkedIn Share */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${title} on LinkedIn (opens in new tab)`}
        title="Share on LinkedIn"
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border/80 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
      >
        <LinkedinIcon className="h-4 w-4" />
        <span className="sr-only">Share on LinkedIn</span>
      </a>

      {/* Mobile Native Share Trigger (if supported) */}
      <button
        type="button"
        onClick={handleNativeShare}
        aria-label="Share via device options"
        title="Share via device options"
        className="sm:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border/80 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
      >
        <Share2 className="h-4 w-4" />
        <span className="sr-only">Share via device options</span>
      </button>
    </div>
  );
}
