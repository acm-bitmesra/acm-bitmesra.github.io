import type { Metadata } from "next";
import Link from "next/link";
import { studentResources } from "@/data/resources";
import { events } from "@/data/events";
import { EventCard } from "@/components/events/event-card";
import { Code2, Trophy, Flame, ExternalLink, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Competitive Programming Hub",
  description:
    "Master data structures, algorithms, and contest problem solving with ACM BIT Mesra. Roadmaps, platforms, and ICPC training.",
};

const cpRoadmap = [
  { step: "01", title: "Programming Basics", desc: "Syntax, fast I/O, control flow, functions, and memory basics in C++." },
  { step: "02", title: "C++ Standard Template Library", desc: "Vectors, pairs, sets, maps, priority queues, and iterators." },
  { step: "03", title: "Time & Space Complexity", desc: "Big-O notation, amortized analysis, constraints, and operation counts." },
  { step: "04", title: "Arrays & Strings", desc: "Prefix sums, two pointers, sliding window, frequency hashing, and basic string manipulation." },
  { step: "05", title: "Recursion & Backtracking", desc: "State transitions, recursive trees, subsets, permutations, and pruning." },
  { step: "06", title: "Trees & Binary Search", desc: "Binary search on answers, tree traversals, lowest common ancestor (LCA), and tree queries." },
  { step: "07", title: "Graph Algorithms", desc: "BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal/Prim MST, and Disjoint Set Union (DSU)." },
  { step: "08", title: "Dynamic Programming", desc: "Memoization, iterative DP, 0/1 knapsack, longest common subsequence, and bitmask DP." },
  { step: "09", title: "Advanced Topics", desc: "Segment trees with lazy propagation, Fenwick trees, number theory, and string hashes." },
  { step: "10", title: "Contests & Speed", desc: "Virtual contests, live rounds, debugging under pressure, and upsolution discipline." },
  { step: "11", title: "ICPC Regional Track", desc: "3-person team synergy, problem triage, stress testing, and mock regionals." },
];

const contestPlatforms = [
  {
    name: "Codeforces",
    desc: "Premier platform for rated algorithmic rounds (Div. 1/2/3/4) and community problem sets.",
    url: "https://codeforces.com/",
    recommendedFor: "Live contests & rating progression",
  },
  {
    name: "CSES Problem Set",
    desc: "A rigorously organized collection of 300 classic algorithmic problems covering all core topics.",
    url: "https://cses.fi/problemset/",
    recommendedFor: "Topic-wise problem mastery",
  },
  {
    name: "AtCoder",
    desc: "Clean, high-quality problem statements with excellent Beginner (ABC) and Regular (ARC) contests.",
    url: "https://atcoder.jp/",
    recommendedFor: "Implementation speed & math intuition",
  },
  {
    name: "CodeChef",
    desc: "Regular Starters and monthly division contests tailored for collegiate problem solvers.",
    url: "https://www.codechef.com/",
    recommendedFor: "Beginner-friendly contest practice",
  },
];

export default function CompetitiveProgrammingPage() {
  const cpEvents = events.filter((e) => e.category === "Coding Contest" || e.slug.includes("icpc"));
  const cpResources = studentResources.filter((r) => r.category === "Competitive Programming" || r.category === "DSA");

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Hero */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-mono text-primary backdrop-blur-sm">
            <Code2 className="h-3.5 w-3.5" />
            <span>Algorithmic Excellence · Contest Track</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-foreground leading-tight">
            Competitive Programming at BIT Mesra
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Competitive programming is the art of solving algorithmic puzzles under strict runtime and memory limits. At ACM BIT Mesra, we build a disciplined culture of weekly practice, peer editorials, and ICPC regional preparation.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/events/codezilla"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Explore CodeZilla
            </Link>
            <Link
              href="/icpc"
              className="inline-flex h-10 items-center justify-center rounded-md border border-border px-5 text-sm font-medium hover:bg-secondary transition-colors"
            >
              ICPC Asia-West Track →
            </Link>
          </div>
        </section>

        {/* Section: Why Competitive Programming */}
        <section className="rounded-2xl border border-border bg-card p-8 sm:p-10 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Why Practice Competitive Programming?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" /> Algorithmic Rigor
              </h3>
              <p>
                You learn to immediately anticipate edge cases, overflow risks, and algorithmic complexity limits before writing a single line of code.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" /> Rapid Debugging
              </h3>
              <p>
                Contests force you to develop acute debugging reflexes, write minimal reproduction test cases, and reason about state under pressure.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" /> Global Benchmarking
              </h3>
              <p>
                Collegiate contests and platforms like Codeforces provide transparent feedback on your problem-solving capabilities against peers worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Visual Roadmap (Section 44) */}
        <section className="space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Curriculum</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Algorithmic Progression Roadmap
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              An 11-step learning progression followed by ACM problem setters from beginner fundamentals to regional collegiate contests.
            </p>
          </div>

          <div className="space-y-4">
            {cpRoadmap.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-border/80 hover:shadow-sm group"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded bg-primary/10 border border-primary/20 shrink-0">
                    STEP {item.step}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Contest Platforms */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Platforms</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Where to Practice Daily
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {contestPlatforms.map((plat) => (
              <a
                key={plat.name}
                href={plat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary transition-colors group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {plat.name}
                    </h3>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {plat.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-border/60 text-[11px] font-mono text-primary font-semibold">
                  {plat.recommendedFor}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ACM Coding Contests */}
        {cpEvents.length > 0 && (
          <section className="space-y-6 border-t border-border pt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Chapter Coding Contests & Sprints
              </h2>
              <Link href="/events" className="text-xs font-mono text-primary hover:underline">
                All Contests →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cpEvents.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* Related Resources */}
        {cpResources.length > 0 && (
          <section className="space-y-6 border-t border-border pt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                CP Guides & Handbooks
              </h2>
              <Link href="/resources" className="text-xs font-mono text-primary hover:underline">
                Explore Library →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {cpResources.slice(0, 3).map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between hover:border-primary transition-colors"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] text-primary font-bold uppercase">
                      {r.category}
                    </span>
                    <h3 className="text-sm font-bold text-foreground">
                      {r.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {r.description}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/60 text-[11px] font-mono text-muted-foreground flex justify-between">
                    <span>{r.author || "Curated"}</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
