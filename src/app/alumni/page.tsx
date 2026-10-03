import type { Metadata } from "next";
import Link from "next/link";
import { alumniBatches, alumniEngagementPaths } from "@/data/alumni";
import { GraduationCap, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Alumni Network & History",
  description:
    "Explore past executive bodies, chapter leadership history, and alumni engagement at ACM BIT Mesra.",
};

export default function AlumniPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <GraduationCap className="h-4 w-4" />
            <span>Alumni Network · Chapter Legacy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Alumni & Leadership Archive
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Preserving institutional memory across graduating batches. Our alumni have mentored generations of student engineers, organized flagship events, and fostered an enduring computing tradition at BIT Mesra.
          </p>
        </div>

        {/* Engagement Avenues */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Ways for Alumni to Reconnect
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alumniEngagementPaths.map((path, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-6 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-foreground">
                    {path.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {path.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Historical Leadership Batches */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Leadership History</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Previous Executive Sessions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Documented terms and chapter stewardship across academic sessions.
            </p>
          </div>

          <div className="space-y-6">
            {alumniBatches.map((batch) => (
              <div
                key={batch.academicYear}
                className="rounded-2xl border border-border bg-card p-4 sm:p-6 lg:p-8 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-4">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-primary">
                      SESSION {batch.academicYear}
                    </span>
                    <h3 className="text-xl font-bold text-foreground">
                      {batch.graduatingBatch}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Archived Record</span>
                  </span>
                </div>

                {/* Major Initiatives */}
                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase text-muted-foreground font-semibold">
                    Key Chapter Initiatives:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                    {batch.initiatives.map((init, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-primary font-bold">›</span>
                        <span>{init}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Connect Banner */}
        <section className="rounded-2xl border border-border bg-secondary/40 p-5 sm:p-8 lg:p-10 text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            Are you an ACM BIT Mesra alumnus?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            We would love to reconnect, document your batch&apos;s achievements, or host you for an upcoming technical talk or AMA session with students.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Get in Touch with Chapter
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
