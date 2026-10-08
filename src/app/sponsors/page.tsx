import type { Metadata } from "next";
import { institutionalPartners, sponsorBenefits } from "@/data/sponsors";
import { siteConfig } from "@/config/site";
import { ExternalLink, ShieldCheck, CircleCheck as CheckCircle2 } from "@animateicons/react/lucide";

export const metadata: Metadata = {
  title: "Sponsors & Institutional Partners",
  description:
    "Institutional patrons, technology partners, and sponsorship opportunities for ACM BIT Mesra hackathons and contests.",
};

import { Callout } from "@/components/ui/callout";

export default function SponsorsPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-12">
        {/* Document Header */}
        <div className="space-y-3 border-b border-border pb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Sponsors & Institutional Partners
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            ACM BIT Mesra collaborates with academic institutions, computing bodies, and technology partners to support student hackathons, workshops, and algorithmic tournaments.
          </p>
        </div>

        {/* Section: Institutional Partners */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Patrons & Chartering Bodies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {institutionalPartners.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-card p-5 flex flex-col justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">
                      {partner.category}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-neutral-400 group-hover:text-foreground transition-colors" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground group-hover:underline">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {partner.description}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-border text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Verified Affiliation</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Section: Sponsorship Prospectus & Tiers */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Sponsorship Tiers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sponsorBenefits.map((tier) => (
              <div
                key={tier.tier}
                className="rounded-lg border border-border bg-card p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="font-mono text-xs text-muted-foreground block">
                    {tier.focus}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {tier.tier}
                  </h3>
                  <ul className="space-y-1.5 text-xs text-muted-foreground pt-1">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-border">
                  <a
                    href={`mailto:${siteConfig.social.email}?subject=Partnership%20with%20ACM%20BIT%20Mesra`}
                    className="inline-flex w-full h-8 items-center justify-center rounded-md border border-border bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Request Prospectus
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Sponsor Desk Callout */}
        <Callout>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Corporate Relations & Event Partnerships
              </p>
              <p className="text-xs text-muted-foreground">
                To sponsor Hack-A-Bit, provide student cloud credits, or conduct technical recruitment talks, reach out directly.
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.social.email}`}
              className="inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 text-xs font-medium text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shrink-0"
            >
              Contact Desk
            </a>
          </div>
        </Callout>
      </div>
    </div>
  );
}
