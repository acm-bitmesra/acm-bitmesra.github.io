import { impactSteps, whyStudentsParticipate } from "@/data/impact";
import { CheckCircle2 } from "lucide-react";

export function ImpactSection() {
  return (
    <section className="py-20 border-b border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Storytelling Intro */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <span>04 / Student Journey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            From problem sets to production prototypes.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            ACM BIT Mesra brings together students who enjoy solving hard algorithmic problems, building maintainable software, competing globally, and teaching one another.
          </p>
        </div>

        {/* Visual Timeline: Learn -> Practice -> Compete -> Build -> Lead -> Teach */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-16">
          {impactSteps.map((step, idx) => (
            <div
              key={step.step}
              className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between relative group hover:border-primary transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">
                    {step.step}
                  </span>
                  {idx < impactSteps.length - 1 && (
                    <span className="hidden lg:inline text-xs font-mono text-muted-foreground">
                      →
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Section 23: Why Students Participate */}
        <div className="pt-8 border-t border-border/80">
          <div className="space-y-2 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Why students participate
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Direct, peer-supported engineering exposure that goes beyond standard coursework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyStudentsParticipate.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/60 p-4"
              >
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
