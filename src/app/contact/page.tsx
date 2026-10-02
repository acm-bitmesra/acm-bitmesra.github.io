import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Mail, MapPin, ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact & Campus Location",
  description:
    "Official contact channels, campus location, and communication details for ACM Student's Chapter, BIT Mesra.",
};

export default function ContactPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-12">
        {/* Document Header */}
        <div className="space-y-3 border-b border-border pb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Contact ACM BIT Mesra
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            Inquiries regarding hackathons, sponsorship opportunities, workshop collaborations, or chapter inductions can be directed to the executive committee.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email / Official Desk */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <Mail className="h-4 w-4 text-neutral-500" />
                <span>Official Email</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For official correspondence, sponsorships, partnerships, and event questions:
              </p>
              <div className="font-mono text-sm text-foreground">
                <a
                  href={`mailto:${siteConfig.social.email}`}
                  className="hover:underline font-medium"
                >
                  {siteConfig.social.email}
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="inline-flex h-9 items-center justify-center rounded-md bg-neutral-900 px-4 text-xs font-medium text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors w-full"
              >
                Send Email
              </a>
            </div>
          </div>

          {/* Physical Campus Address */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                <MapPin className="h-4 w-4 text-neutral-500" />
                <span>Campus Location</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Department of Computer Science & Engineering, main BIT Mesra campus:
              </p>
              <div className="font-mono text-xs text-muted-foreground space-y-1">
                <p className="text-foreground font-medium">
                  Department of Computer Science & Engineering
                </p>
                <p>Birla Institute of Technology, Mesra</p>
                <p>Ranchi, Jharkhand 835215, India</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <a
                href="https://maps.google.com/?q=Birla+Institute+of+Technology+Mesra+Ranchi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-xs font-medium text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors w-full gap-2"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>

        {/* Social Media & Communities */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Digital Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors group"
            >
              <GithubIcon className="h-4 w-4 text-neutral-500 group-hover:text-foreground transition-colors" />
              <div>
                <span className="font-medium text-sm text-foreground block">GitHub</span>
                <span className="font-mono text-xs text-muted-foreground">acm-bitmesra</span>
              </div>
            </a>

            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors group"
            >
              <LinkedinIcon className="h-4 w-4 text-neutral-500 group-hover:text-foreground transition-colors" />
              <div>
                <span className="font-medium text-sm text-foreground block">LinkedIn</span>
                <span className="font-mono text-xs text-muted-foreground">ACM BIT Mesra</span>
              </div>
            </a>

            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors group"
            >
              <InstagramIcon className="h-4 w-4 text-neutral-500 group-hover:text-foreground transition-colors" />
              <div>
                <span className="font-medium text-sm text-foreground block">Instagram</span>
                <span className="font-mono text-xs text-muted-foreground">@acmbitmesra</span>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
