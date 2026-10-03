"use client";

import * as React from "react";
import { Share2, Check, Copy } from "lucide-react";
import { TwitterIcon, LinkedinIcon } from "@/components/ui/icons";

interface EventShareActionsProps {
  title: string;
  url: string;
}

export function EventShareActions({ title, url }: EventShareActionsProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} by ACM BIT Mesra`,
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
    `${title} at @acmbitmesra`
  )}&url=${encodeURIComponent(url)}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
        Share Event:
      </span>

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopy}
        title="Copy Link to Clipboard"
        aria-label="Copy event link"
        className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-border/80 bg-secondary/40 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
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

      {/* Twitter Share */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        title="Share on X"
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/80 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        <TwitterIcon className="h-3.5 w-3.5" />
      </a>

      {/* LinkedIn Share */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/80 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        <LinkedinIcon className="h-3.5 w-3.5" />
      </a>

      {/* Mobile Native Share Trigger (if supported) */}
      <button
        type="button"
        onClick={handleNativeShare}
        aria-label="Share options"
        className="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/80 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        <Share2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
