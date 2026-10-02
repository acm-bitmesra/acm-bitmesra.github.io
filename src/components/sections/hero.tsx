import Link from "next/link";
import { ArrowRight, Calendar, Terminal } from "lucide-react";
import { AcmLogo } from "@/components/ui/icons";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Background Technical Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-mono text-muted-foreground backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>BIT Mesra · ACM Student Chapter</span>
              <span className="text-border">|</span>
              <span className="text-foreground">Est. Computing Culture</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]">
              Build. Compete. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/90 to-primary">
                Create.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              A technical community at BIT Mesra empowering students through competitive programming, software development, hackathons, technical workshops, open source, and collaborative learning.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/about"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2 group"
              >
                Explore ACM
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/events"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-secondary/50 px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Upcoming Events
              </Link>
            </div>

            {/* Verification Metadata Footnote */}
            <div className="pt-4 flex items-center gap-6 text-xs font-mono text-muted-foreground/80">
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">●</span>
                <span>Ranchi, Jharkhand</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">●</span>
                <span>Deemed University Campus</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sophisticated Technical Composition */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-card/80 p-5 shadow-2xl backdrop-blur-sm relative space-y-4">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-primary" />
                    acm@bitmesra:~$
                  </span>
                </div>
                <AcmLogo className="h-5 w-5" />
              </div>

              {/* Code / Technical Fragment */}
              <div className="font-mono text-xs text-muted-foreground space-y-2 py-1 leading-relaxed">
                <p className="text-emerald-400">
                  {"// ACM BIT Mesra Core Philosophy"}
                </p>
                <p>
                  <span className="text-purple-400">const</span> chapter = &#123;
                </p>
                <p className="pl-4">
                  name: <span className="text-amber-300">&quot;ACM BIT Mesra&quot;</span>,
                </p>
                <p className="pl-4">
                  mission: <span className="text-amber-300">&quot;Empower computing excellence&quot;</span>,
                </p>
                <p className="pl-4">
                  pillars: [
                </p>
                <p className="pl-8 text-foreground">
                  &quot;Competitive Programming&quot;,
                </p>
                <p className="pl-8 text-foreground">
                  &quot;Developer Community&quot;,
                </p>
                <p className="pl-8 text-foreground">
                  &quot;Hack-A-Bit&quot;,
                </p>
                <p className="pl-8 text-foreground">
                  &quot;Open Source Systems&quot;
                </p>
                <p className="pl-4">],</p>
                <p className="pl-4">
                  ready: <span className="text-blue-400">true</span>
                </p>
                <p>&#125;;</p>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">ICPC Asia-West Track</span>
                  <span className="text-primary font-semibold">Active Cycle 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
