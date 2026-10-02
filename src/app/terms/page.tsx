import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for participating in ACM Student's Chapter, BIT Mesra activities and website usage.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <span className="font-mono text-xs uppercase tracking-wider text-primary">Institutional</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-sm font-mono text-muted-foreground">Last updated: October 2026</p>
      </div>

      <div className="mt-8 space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
        <p>
          Welcome to the official digital platform of the ACM Student&apos;s Chapter at Birla Institute of Technology, Mesra. By accessing this website or participating in our hackathons, workshops, and competitive programming contests, you agree to comply with these terms.
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">1. Code of Conduct</h2>
        <p>
          ACM BIT Mesra is dedicated to providing an inclusive, harassment-free, and respectful environment for everyone regardless of gender, sexual orientation, disability, physical appearance, race, or religion. Academic dishonesty, plagiarism, or contest rule violations during competitions will result in immediate disqualification.
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">2. Intellectual Property</h2>
        <p>
          Participants in ACM hackathons and open-source sprints retain ownership of the software and code they create. Open-source projects hosted under the ACM BIT Mesra GitHub organization are licensed under their respective open-source licenses (typically MIT or Apache 2.0).
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">3. Disclaimers</h2>
        <p>
          Information provided on this site is provided for educational and community coordination purposes. While we strive for accuracy, event dates, venues, and guidelines are subject to administrative updates.
        </p>
      </div>
    </div>
  );
}
