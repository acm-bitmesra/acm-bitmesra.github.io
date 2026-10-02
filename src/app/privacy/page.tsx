import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy practices and data handling policies of ACM Student's Chapter, BIT Mesra.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <span className="font-mono text-xs uppercase tracking-wider text-primary">Institutional</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm font-mono text-muted-foreground">Last updated: October 2026</p>
      </div>

      <div className="mt-8 space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
        <p>
          The ACM Student&apos;s Chapter at Birla Institute of Technology, Mesra (&quot;ACM BIT Mesra&quot;) is committed to respecting the privacy of its students, members, event participants, and website visitors.
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">1. Information We Collect</h2>
        <p>
          This website is statically rendered and hosted on Cloudflare edge infrastructure. We do not use third-party invasive trackers or collect personally identifiable information without explicit consent. When you register for events, workshops, or chapter inductions via official forms, we collect strictly necessary details such as name, institutional roll number, email address, and department for administrative and contest communication purposes.
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">2. Use of Information</h2>
        <p>
          Collected data is used solely for chapter operations, contest logistics, certificate issuance, and communicating official announcements. We never sell, rent, or distribute personal information to external commercial third parties.
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">3. Data Security & Retention</h2>
        <p>
          Student data collected during event registrations is retained strictly for the duration necessary for event auditing and certificate verification in accordance with institutional guidelines.
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">4. Contact</h2>
        <p>
          For inquiries regarding privacy or chapter records, contact us at <a href="mailto:acm@bitmesra.ac.in" className="text-primary hover:underline">acm@bitmesra.ac.in</a>.
        </p>
      </div>
    </div>
  );
}
