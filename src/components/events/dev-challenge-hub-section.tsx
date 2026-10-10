import * as React from "react";
import {
  Sparkles,
  ExternalLink,
  Trophy,
  ArrowUpRight,
  Gift,
  Cpu,
  Layers,
  Bot,
} from "@animateicons/react/lucide";

export function DevChallengeHubSection() {
  const challenges = [
    {
      id: "weekend",
      number: "Kickoff",
      title: "Build for a Friend",
      dates: "Oct 2 – 5, 2026",
      status: "Closed",
      statusColor: "text-muted-foreground bg-secondary border-border",
      winnerDate: "Week of Oct 5",
      note: "Kickoff weekend challenge for Hacktoberfest 2026.",
      url: "https://dev.to/challenges/hf26",
    },
    {
      id: "week-1",
      number: "Week 1",
      title: "Touch Grass",
      dates: "Oct 5 – 11, 2026",
      status: "Live Now",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      winnerDate: "Week of Oct 12",
      note: "Active challenge! Build an open-source AI project themed around getting outdoors, wellness, or nature.",
      url: "https://dev.to/challenges/hf26",
      isLive: true,
    },
    {
      id: "week-2",
      number: "Week 2",
      title: "Revealed at Launch",
      dates: "Oct 12 – 18, 2026",
      status: "Upcoming",
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      winnerDate: "Week of Oct 19",
      note: "Theme revealed on launch Monday at 09:00 UTC.",
      url: "https://dev.to/t/hf26challenge",
    },
    {
      id: "week-3",
      number: "Week 3",
      title: "Revealed at Launch",
      dates: "Oct 19 – 25, 2026",
      status: "Upcoming",
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      winnerDate: "Week of Oct 26",
      note: "Theme revealed on launch Monday at 09:00 UTC.",
      url: "https://dev.to/t/hf26challenge",
    },
    {
      id: "week-4",
      number: "Week 4",
      title: "Revealed at Launch",
      dates: "Oct 26 – 31, 2026",
      status: "Upcoming",
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      winnerDate: "Week of Nov 2",
      note: "Theme revealed on launch Monday at 09:00 UTC.",
      url: "https://dev.to/t/hf26challenge",
    },
  ];

  const partners = [
    {
      name: "Render",
      reward: "$200 USD + DEV Winner Badge",
      category: "Best Use of Render",
      description:
        "Use Render as your project's AI runtime, host an agent's front end, or run Hermes or OpenClaw.",
      icon: <Layers className="h-5 w-5 text-indigo-400" />,
      tag: "Cloud & Runtime",
    },
    {
      name: "TabPFN (Prior Labs)",
      reward: "$200 USD + DEV Winner Badge",
      category: "Best Use of TabPFN",
      description:
        "Use TabPFN tabular foundation model to forecast, predict, classify, or spot anomalies from tabular data (CSV) inside an agent tool or standalone.",
      icon: <Cpu className="h-5 w-5 text-emerald-400" />,
      tag: "Tabular Foundation Model",
    },
    {
      name: "Tinker (Thinking Machines)",
      reward: "$200 USD + DEV Winner Badge",
      category: "Best Use of Tinker",
      description:
        "Fine-tune an open-weight model for a specific task using Tinker and demonstrate clear performance, latency, or cost improvements over baseline.",
      icon: <Bot className="h-5 w-5 text-sky-400" />,
      tag: "Fine-Tuning",
    },
    {
      name: "Arduino & Qualcomm",
      reward: "$200 USD + DEV Winner Badge",
      category: "Best Use of Arduino",
      description:
        "Build with Arduino UNO Q: run an edge model on the board, build a physical agent that senses and acts, or optimize a model with Qualcomm AI Hub.",
      icon: <Cpu className="h-5 w-5 text-amber-400" />,
      tag: "Physical AI & Edge",
    },
  ];

  return (
    <section
      id="dev-challenge-hub"
      aria-labelledby="dev-challenge-hub-title"
      className="space-y-8 rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/[0.07] via-background to-background p-6 sm:p-8 lg:p-10"
    >
      {/* Top Banner */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Official Hacktoberfest 2026 Hub</span>
          </div>
          <h2
            id="dev-challenge-hub-title"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            HF26 DEV Challenge Hub
          </h2>
          <p className="max-w-[76ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            Five Hacktoberfest challenges, one prompt, and a new theme every week. This year is not about pull request counts. Instead, builders create brand-new software with open-source AI at its core and publish technical write-ups on DEV.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
          <a
            href="https://dev.to/challenges/hf26"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>Open HF26 Hub on DEV</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href="https://dev.to/t/hf26challenge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>Follow #hf26challenge</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* The Prompt Box */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card/80 p-6 sm:p-7 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Core Challenge Prompt (All 5 Weeks)
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">dev.to/challenges/hf26</span>
        </div>

        <blockquote className="mt-4 text-lg font-semibold text-foreground sm:text-xl leading-snug">
          &ldquo;Build something with open-source AI at its core.&rdquo;
        </blockquote>

        <p className="mt-3 max-w-[75ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
          Run an open-weight model, build on an open-source agent harness or framework, run inference locally, or combine all three. In your DEV post, detail why open innovation matters: zero hosting costs, local privacy, model portability, or offline capability on consumer hardware.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 pt-5 border-t border-border sm:grid-cols-3 text-xs sm:text-sm text-foreground/80">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span><strong>Focus:</strong> Brand-new projects, not PRs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            <span><strong>Write:</strong> Technical article on DEV</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span><strong>Show:</strong> Embed repo or DevRelay log</span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground sm:text-xl">
            The Five Weekly Challenges
          </h3>
          <span className="text-xs text-muted-foreground">
            A new theme revealed every Monday
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c) => (
            <div
              key={c.id}
              className={`relative flex flex-col justify-between rounded-xl border p-5 transition hover:border-primary/50 ${
                c.isLive
                  ? "border-emerald-500/40 bg-emerald-950/10 shadow-sm"
                  : "border-border bg-card/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.number}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${c.statusColor}`}
                  >
                    {c.isLive && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                    )}
                    {c.status}
                  </span>
                </div>

                <h4 className="mt-3 text-lg font-bold text-foreground">
                  {c.title}
                </h4>

                <p className="mt-1 text-xs font-mono text-muted-foreground">
                  {c.dates}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.note}
                </p>
              </div>

              <div className="mt-5 border-t border-border/70 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Winners: {c.winnerDate}</span>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  View Details <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Partner Categories & Prizes */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground sm:text-xl">
              Featured Partner Categories &amp; Prizes
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Overall winner receives $250 USD, DEV++ membership, and badge. Each partner winner receives $200 USD.
            </p>
          </div>
          <a
            href="https://hacktoberfest.com/my/promos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <Gift className="h-3.5 w-3.5" />
            <span>Claim Free Partner Credits</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-secondary">{p.icon}</div>
                  <span className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {p.tag}
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-foreground">
                  {p.category}
                </h4>
                <div className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Trophy className="h-3 w-3" />
                  <span>{p.reward}</span>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Callout & Credits */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-secondary/40 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Free Partner Credits: Tinker, Render, Backboard &amp; ElevenLabs
          </p>
          <p className="text-xs text-muted-foreground">
            All registered builders can claim developer tier credits and promo codes to run inference and fine-tune models.
          </p>
        </div>
        <a
          href="https://hacktoberfest.com/my/promos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-4 text-xs font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>Claim Credits at hacktoberfest.com</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}
