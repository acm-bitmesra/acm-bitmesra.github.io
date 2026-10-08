import Link from "next/link";
import { ArrowLeft, Calendar, Terminal } from "@animateicons/react/lucide";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        {/* Status Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1 text-xs font-mono text-primary backdrop-blur-sm">
          <Terminal className="h-3.5 w-3.5" />
          <span>Verdict: TIME_LIMIT_EXCEEDED (404)</span>
        </div>

        {/* Headline & ACM Humor */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Looks like this problem hasn&apos;t been solved yet.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            The path or memory address you requested either does not exist, has been garbage-collected, or timed out during execution.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Go Home
          </Link>
          <Link
            href="/events"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-secondary/80 px-5 text-sm font-medium hover:bg-secondary transition-colors gap-2"
          >
            <Calendar className="h-4 w-4 text-primary" /> Explore Events
          </Link>
        </div>
      </div>
    </div>
  );
}
