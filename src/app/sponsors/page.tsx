import type { Metadata } from "next";
import Link from "next/link";
import { institutionalPartners, sponsorBenefits } from "@/data/sponsors";
import { siteConfig } from "@/config/site";
import { Building2, ExternalLink, ShieldCheck, Mail, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sponsors & Institutional Partners",
  description:
    "Institutional patrons, technology partners, and sponsorship opportunities for ACM BIT Mesra hackathons and contests.",
};

export default function SponsorsPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <Building2 className="h-4 w-4" />
            <span>Collaboration · Institutional Backing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Sponsors & Partners
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            ACM BIT Mesra partners with academic institutions, global computing bodies, and technology organizations to support high-impact hackathons, student workshops, and algorithmic tournaments.
          </p>
        </div>

        {/* Section: Institutional Partners */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Institutional Patrons & Chartering Bodies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {institutionalPartners.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {partner.category}
                    </span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {partner.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-border/60 text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Verified Affiliation</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Section: Sponsorship Prospectus & Tiers */}
        <section className="space-y-8 border-t border-border pt-16">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Sponsorship Tiers</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Partner with ACM BIT Mesra
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Engage directly with hundreds of skilled software engineers, algorithmic problem solvers, and student developers through Hack-A-Bit and CodeZilla.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sponsorBenefits.map((tier) => (
              <div
                key={tier.tier}
                className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <span className="font-mono text-xs font-bold text-primary block">
                    {tier.focus}
                  </span>
                  <h3 className="text-xl font-bold text-foreground">
                    {tier.tier}
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground pt-2">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border/60">
                  <a
                    href={`mailto:${siteConfig.social.email}?subject=Partnership%20with%20ACM%20BIT%20Mesra`}
                    className="inline-flex w-full h-9 items-center justify-center rounded-md border border-border bg-secondary/80 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    Request Deck
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Sponsor Desk */}
        <section className="rounded-2xl border border-border bg-secondary/40 p-8 sm:p-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-primary font-bold">
            <Mail className="h-4 w-4" />
            <span>PARTNERSHIP DESK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Connect with Chapter Sponsorship Team
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            To discuss sponsoring Hack-A-Bit, offering student API credits, or collaborating on workshops, reach out to our corporate relations wing.
          </p>
          <div className="pt-2">
            <a
              href={`mailto:${siteConfig.social.email}`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Contact {siteConfig.social.email}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
