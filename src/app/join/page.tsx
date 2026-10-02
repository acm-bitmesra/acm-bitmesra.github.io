import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Sparkles, HelpCircle, Code2, Users, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Join ACM BIT Mesra · Inductions",
  description:
    "Learn about recruitment, membership selection, eligibility, and the induction workflow for ACM Student Chapter at BIT Mesra.",
};

const selectionSteps = [
  { step: "01", title: "Registration", desc: "Fill out the official chapter induction form expressing your focus areas (Competitive Programming, Web/Systems Development, Hackathons, Design/Media)." },
  { step: "02", title: "Aptitude & Coding Round", desc: "An objective problem-solving and algorithmic logic assessment testing basic coding concepts and analytical reasoning." },
  { step: "03", title: "Technical Task / Interaction", desc: "A discussion with senior chapter members reviewing your code, side projects, or problem-solving approaches." },
  { step: "04", title: "Induction & Orientation", desc: "Welcome to ACM BIT Mesra. You are assigned to a Special Interest Group (SIG) and paired with a senior mentor." },
];

const faqs = [
  {
    q: "Can first-year students apply?",
    a: "Yes! First-year students are actively encouraged to apply. We look for curiosity, problem-solving enthusiasm, and commitment to learning rather than encyclopedic prior knowledge.",
  },
  {
    q: "Is prior competitive programming or development experience required?",
    a: "No prior competitive programming rating is mandatory. Basic familiarity with any programming language (C++, C, Python, or Java) and strong logic skills are sufficient for junior inductees.",
  },
  {
    q: "Is ACM only open to Computer Science & Engineering students?",
    a: "No. ACM BIT Mesra is an institute-wide technical society open to all branches (ECE, EEE, Mechanical, Chemical, IT, etc.) as well as postgraduate students (MCA, M.Tech). Passion for computing is what matters.",
  },
  {
    q: "How often is chapter recruitment conducted?",
    a: "Official chapter inductions are conducted annually during the Autumn semester for the incoming freshman and sophomore batches, with supplementary recruitment for specific project roles as needed.",
  },
  {
    q: "What should I prepare for the induction?",
    a: "Brush up on fundamental programming syntax (loops, arrays, functions), basic algorithmic intuition, and be ready to explain any projects or technologies you have explored.",
  },
];

export default function JoinPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1 text-xs font-mono text-primary backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Chapter Recruitment · Membership</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-foreground leading-tight">
            Join the ACM BIT Mesra Community
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Surround yourself with students who love building real software, mastering algorithms, and competing at the highest collegiate level.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href={`mailto:${siteConfig.social.email}?subject=ACM%20BIT%20Mesra%20Membership%20Inquiry`}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Express Interest via Email
            </a>
            <a
              href="#process"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium hover:bg-secondary transition-colors"
            >
              See Selection Flow ↓
            </a>
          </div>
        </section>

        {/* Section: Who Should Apply? */}
        <section className="rounded-2xl border border-border bg-card p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Eligibility</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Who Should Apply?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" /> Problem Solvers
              </h3>
              <p>
                Students who enjoy logic puzzles, mathematics, discrete structures, and want to compete in Codeforces, CodeChef, and ICPC regionals.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" /> Software Builders
              </h3>
              <p>
                Developers who want to ship modern web apps, distributed backends, mobile tools, and contribute to public open-source software.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Organizers & Designers
              </h3>
              <p>
                Creative minds who want to design intuitive user interfaces, coordinate 36-hour hackathons, and shape campus technical culture.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Selection Process */}
        <section id="process" className="space-y-8 scroll-mt-24">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Selection Flow</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              How Inductions Work
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              A transparent, merit-based selection pipeline designed to assess problem solving, collaboration, and passion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectionSteps.map((s) => (
              <div
                key={s.step}
                className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    STEP {s.step}
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Frequently Asked Questions */}
        <section className="space-y-6 rounded-2xl border border-border bg-card p-8 sm:p-10">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">FAQ</span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6 pt-4 divide-y divide-border/60">
            {faqs.map((faq, i) => (
              <div key={i} className="pt-4 first:pt-0 space-y-1.5">
                <h3 className="text-base font-bold text-foreground">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Contact Reminder */}
        <div className="rounded-xl border border-border bg-secondary/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <span>Questions about membership? Email our student coordinators:</span>
          <a
            href={`mailto:${siteConfig.social.email}`}
            className="text-primary font-bold hover:underline"
          >
            {siteConfig.social.email} →
          </a>
        </div>
      </div>
    </div>
  );
}
