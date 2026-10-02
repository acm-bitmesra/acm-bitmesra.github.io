import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Code2, Users, Terminal, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Join ACM BIT Mesra · Inductions",
  description:
    "Learn about recruitment, membership selection, eligibility, and the induction workflow for ACM Student Chapter at BIT Mesra.",
};

const selectionSteps = [
  { step: "01", title: "Registration", desc: "Fill out the chapter induction form indicating your interest tracks (Competitive Programming, Systems/Web, Design, Operations)." },
  { step: "02", title: "Aptitude & Coding Round", desc: "An objective logic and problem-solving assessment evaluating basic analytical reasoning and programming fundamentals." },
  { step: "03", title: "Technical Task / Discussion", desc: "A peer discussion with senior members reviewing your code, side projects, or problem-solving intuition." },
  { step: "04", title: "Orientation & Onboarding", desc: "Inducted members join specific Special Interest Groups (SIGs) and receive guidance from senior chapter mentors." },
];

const faqs = [
  {
    q: "Can first-year students apply?",
    a: "Yes. First-year students are actively encouraged to apply. We value curiosity, problem-solving enthusiasm, and consistency over extensive prior knowledge.",
  },
  {
    q: "Is prior competitive programming experience required?",
    a: "No prior contest rating is mandatory. Basic familiarity with any programming language (C++, C, Python, or Java) and logical reasoning are sufficient.",
  },
  {
    q: "Is membership limited to Computer Science students?",
    a: "No. ACM BIT Mesra is open to all engineering departments (ECE, EEE, Mechanical, Chemical, Production, etc.) as well as postgraduate students (MCA, M.Tech).",
  },
  {
    q: "How often are inductions held?",
    a: "Official chapter inductions take place annually during the Autumn semester for incoming batches, with supplementary recruitment for specialized project roles as needed.",
  },
  {
    q: "What should I prepare?",
    a: "Review core programming syntax (loops, arrays, functions, recursion), practice basic algorithmic logic, and prepare to explain any projects you have built.",
  },
];

export default function JoinPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Document Header */}
        <div className="space-y-3 border-b border-border/60 pb-6">
          <div className="text-xs font-mono text-muted-foreground">
            Membership / Chapter Inductions
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Join ACM BIT Mesra
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Information regarding recruitment, eligibility, and the annual induction workflow for undergraduate and postgraduate students.
          </p>
        </div>

        {/* Current Status Callout */}
        <div className="rounded-lg border border-border/80 bg-secondary/30 p-5 space-y-2">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Induction Cycle Notice
          </div>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">
            Formal recruitment cycles are announced campus-wide at the start of each academic semester. For off-cycle project collaboration or inquiries, contact the executive team directly.
          </p>
          <div className="pt-2">
            <a
              href={`mailto:${siteConfig.social.email}?subject=ACM%20BIT%20Mesra%20Membership%20Inquiry`}
              className="inline-flex h-8 items-center justify-center rounded-md bg-neutral-900 px-3 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 transition-colors"
            >
              Contact Membership Lead →
            </a>
          </div>
        </div>

        {/* Tracks */}
        <section className="space-y-4">
          <div className="border-b border-border/60 pb-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Focus Tracks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="rounded-lg border border-border/70 bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                <span>Competitive Programming</span>
              </div>
              <p className="leading-relaxed">
                Focus on algorithms, data structures, Codeforces/CodeChef contest performance, and ICPC regional preparation.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <span>Software & Systems</span>
              </div>
              <p className="leading-relaxed">
                Full-stack web applications, developer CLI utilities, distributed services, and open-source contributions.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Design & Operations</span>
              </div>
              <p className="leading-relaxed">
                User experience design, hackathon organization, technical writing, media production, and community initiatives.
              </p>
            </div>
          </div>
        </section>

        {/* Selection Steps */}
        <section className="space-y-4">
          <div className="border-b border-border/60 pb-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Induction Workflow
            </h2>
          </div>

          <div className="divide-y divide-border/60 rounded-lg border border-border/80 bg-card overflow-hidden">
            {selectionSteps.map((s) => (
              <div key={s.step} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 p-4 hover:bg-secondary/20 transition-colors">
                <span className="font-mono text-xs font-semibold text-foreground shrink-0 w-20">
                  Step {s.step}
                </span>
                <div className="space-y-0.5 flex-1">
                  <div className="text-xs font-semibold text-foreground">
                    {s.title}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-4">
          <div className="border-b border-border/60 pb-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-lg border border-border/70 bg-card p-4 space-y-1.5">
                <h3 className="text-xs font-semibold text-foreground">
                  {faq.q}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
