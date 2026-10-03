import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Mail, MapPin, ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact & Campus Location | ACM BIT Mesra",
  description:
    "Official contact channels, campus location, and communication details for ACM Student's Chapter, BIT Mesra.",
  openGraph: {
    title: "Contact & Campus Location | ACM BIT Mesra",
    description:
      "Official contact channels, campus location, and communication details for ACM Student's Chapter, BIT Mesra.",
  },
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Document Header */}
        <div className="space-y-4 border-b border-border/70 pb-8">
          <div className="text-xs sm:text-sm font-mono text-muted-foreground">
            Connect / Office & Inquiries
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            Contact ACM BIT Mesra
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Inquiries regarding hackathons, sponsorship opportunities, workshop collaborations, or chapter inductions can be directed to the executive committee.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email / Official Desk */}
          <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
                <Mail className="h-5 w-5 text-foreground" />
                <span>Official Email</span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                For official correspondence, sponsorships, partnerships, and event questions:
              </p>
              <div className="font-mono text-base text-foreground bg-secondary/40 p-3 rounded-lg border border-border/60">
                <a
                  href={`mailto:${siteConfig.social.email}`}
                  className="hover:underline font-semibold"
                >
                  {siteConfig.social.email}
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60">
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors w-full"
              >
                Send Email Directly
              </a>
            </div>
          </div>

          {/* Physical Campus Address */}
          <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
                <MapPin className="h-5 w-5 text-foreground" />
                <span>Campus Location</span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Department of Computer Science & Engineering, main BIT Mesra campus:
              </p>
              <div className="font-mono text-xs sm:text-sm text-muted-foreground space-y-1 bg-secondary/40 p-3 rounded-lg border border-border/60">
                <p className="text-foreground font-semibold">
                  Department of Computer Science & Engineering
                </p>
                <p>Birla Institute of Technology, Mesra</p>
                <p>Ranchi, Jharkhand 835215, India</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60">
              <a
                href="https://maps.google.com/?q=Birla+Institute+of+Technology+Mesra+Ranchi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors w-full gap-2"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>

        {/* Social Media & Communities */}
        <section className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Official Digital Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-xl border border-border/80 bg-card hover:bg-secondary/40 hover:border-foreground/30 transition-all group"
            >
              <GithubIcon className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              <div>
                <span className="font-bold text-base text-foreground block group-hover:underline">GitHub</span>
                <span className="font-mono text-xs sm:text-sm text-muted-foreground">acm-bitmesra</span>
              </div>
            </a>

            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-xl border border-border/80 bg-card hover:bg-secondary/40 hover:border-foreground/30 transition-all group"
            >
              <LinkedinIcon className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              <div>
                <span className="font-bold text-base text-foreground block group-hover:underline">LinkedIn</span>
                <span className="font-mono text-xs sm:text-sm text-muted-foreground">ACM BIT Mesra</span>
              </div>
            </a>

            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-xl border border-border/80 bg-card hover:bg-secondary/40 hover:border-foreground/30 transition-all group"
            >
              <InstagramIcon className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              <div>
                <span className="font-bold text-base text-foreground block group-hover:underline">Instagram</span>
                <span className="font-mono text-xs sm:text-sm text-muted-foreground">@acmbitm</span>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
