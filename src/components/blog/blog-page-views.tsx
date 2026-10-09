"use client";

import { useEffect, useState } from "react";
import { Eye } from "@animateicons/react/lucide";

export function BlogPageViews({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/blog/${encodeURIComponent(slug)}/views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      keepalive: true,
    })
      .then((response) => {
        if (!response.ok) throw new Error("View count unavailable");
        return response.json() as Promise<{ views: number }>;
      })
      .then((data) => {
        if (!cancelled && Number.isFinite(data.views)) setCount(data.views);
      })
      .catch(() => {
        // Analytics must never block the article.
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground"
      aria-label={count === null ? "Page views loading" : `${count.toLocaleString()} article views`}
      title="Total article page views"
    >
      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{count === null ? "Views" : `${count.toLocaleString()} views`}</span>
    </span>
  );
}
