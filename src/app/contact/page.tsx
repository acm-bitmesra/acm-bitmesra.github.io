import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Mail, MapPin, Building2, ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact & Campus Location",
  description:
    "Official contact channels, campus location, and communication details for ACM Student's Chapter, BIT Mesra.",
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <Mail className="h-4 w-4" />
            <span>Connect · Inquiries & Campus Info</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Contact ACM BIT Mesra
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Have questions regarding upcoming hackathons, sponsorship opportunities, workshop collaborations, or chapter inductions? Reach out to our executive body directly.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email / Official Desk */}
          <div className="rounded-2xl border border-border bg-card p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Official Email
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For official correspondence, event partnerships, contest sponsorships, or student inquiries:
              </p>
              <div className="pt-2 font-mono text-sm font-bold text-foreground">
                <a
                  href={`mailto:${siteConfig.social.email}`}
                  className="text-primary hover:underline"
                >
                  {siteConfig.social.email}
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors w-full"
              >
                Send Direct Email
              </a>
            </div>
          </div>

          {/* Physical Campus Address */}
          <div className="rounded-2xl border border-border bg-card p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Campus Location
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The chapter operates out of the Department of Computer Science & Engineering on the main BIT Mesra campus:
              </p>
              <div className="pt-2 font-mono text-xs text-muted-foreground space-y-1">
                <p className="text-foreground font-semibold">
                  Department of Computer Science & Engineering
                </p>
                <p>Birla Institute of Technology, Mesra</p>
                <p>Ranchi, Jharkhand 835215, India</p>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <a
                href="https://maps.google.com/?q=Birla+Institute+of+Technology+Mesra+Ranchi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-border px-6 text-sm font-medium hover:bg-secondary transition-colors w-full gap-2"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>

        {/* Social Media & Communities */}
        <section className="rounded-2xl border border-border bg-secondary/30 p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">Channels</span>
            <h2 className="text-2xl font-bold text-foreground">
              Official Digital Communities
            </h2>
            <p className="text-sm text-muted-foreground">
              Follow our verified accounts for contest announcements, registration alerts, and event photographs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary transition-colors group"
            >
              <GithubIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <span className="font-bold text-sm text-foreground block">GitHub</span>
                <span className="font-mono text-xs text-muted-foreground">acm-bitmesra</span>
              </div>
            </a>

            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary transition-colors group"
            >
              <LinkedinIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <span className="font-bold text-sm text-foreground block">LinkedIn</span>
                <span className="font-mono text-xs text-muted-foreground">ACM BIT Mesra</span>
              </div>
            </a>

            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary transition-colors group"
            >
              <InstagramIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <span className="font-bold text-sm text-foreground block">Instagram</span>
                <span className="font-mono text-xs text-muted-foreground">@acmbitmesra</span>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
