import type { Metadata } from "next";
import Link from "next/link";
import { studentResources } from "@/data/resources";
import { events } from "@/data/events";
import { EventCard } from "@/components/events/event-card";
import { ExternalLink, ArrowRight } from "lucide-react";

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
    desc: "A rigorously organized collection of classic algorithmic problems covering core topics.",
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
    desc: "Regular Starters and division contests tailored for collegiate problem solvers.",
    url: "https://www.codechef.com/",
    recommendedFor: "Beginner-friendly contest practice",
  },
];

export default function CompetitiveProgrammingPage() {
  const cpEvents = events.filter((e) => e.category === "Coding Contest" || e.slug.includes("icpc"));
  const cpResources = studentResources.filter((r) => r.category === "Competitive Programming" || r.category === "DSA");

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Document Header */}
        <div className="space-y-3 border-b border-border/60 pb-6">
          <div className="text-xs font-mono text-muted-foreground">
            Tracks / Competitive Programming
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Competitive Programming
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Algorithmic problem solving, contest preparation, and ICPC regional training at BIT Mesra.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/icpc"
              className="inline-flex h-8 items-center justify-center rounded-md bg-neutral-900 px-3 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 transition-colors gap-1.5"
            >
              ICPC Regional Track <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/events"
              className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Upcoming Contests
            </Link>
          </div>
        </div>

        {/* Roadmap (Notion Table / List) */}
        <section className="space-y-4">
          <div className="border-b border-border/60 pb-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Algorithmic Progression Roadmap
            </h2>
            <p className="text-xs text-muted-foreground">
              Core topic progression practiced by chapter problem solvers.
            </p>
          </div>

          <div className="divide-y divide-border/60 rounded-lg border border-border/80 bg-card overflow-hidden">
            {cpRoadmap.map((item) => (
              <div
                key={item.step}
                className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 p-3.5 hover:bg-secondary/20 transition-colors"
              >
                <span className="font-mono text-xs text-muted-foreground shrink-0 w-12">
                  #{item.step}
                </span>
                <div className="sm:w-64 shrink-0">
                  <span className="text-xs font-semibold text-foreground">
                    {item.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Platforms */}
        <section className="space-y-4">
          <div className="border-b border-border/60 pb-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Recommended Platforms
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contestPlatforms.map((plat) => (
              <a
                key={plat.name}
                href={plat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border/70 bg-card p-4 space-y-2 hover:border-border hover:bg-secondary/20 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-foreground group-hover:underline">
                    {plat.name}
                  </h3>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {plat.desc}
                </p>
                <div className="pt-2 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
                  {plat.recommendedFor}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Contests */}
        {cpEvents.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-border/60 pb-2">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Chapter Contests
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cpEvents.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* Resources */}
        {cpResources.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-border/60 pb-2">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Practice Sheets & Textbooks
              </h2>
            </div>
            <div className="divide-y divide-border/60 rounded-lg border border-border/80 bg-card overflow-hidden">
              {cpResources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 hover:bg-secondary/20 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-foreground group-hover:underline">
                      {res.title}
                    </span>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {res.description}
                    </p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground shrink-0 ml-4" />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
