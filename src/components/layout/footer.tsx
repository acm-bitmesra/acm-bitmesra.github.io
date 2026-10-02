import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ExternalLink, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, AcmLogo } from "@/components/ui/icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: ACM BIT Mesra Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <AcmLogo className="h-8 w-8" />
              <span className="text-base font-bold tracking-tight">
                ACM Student&apos;s Chapter
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Birla Institute of Technology, Mesra. A dedicated technical society empowering students through competitive programming, systems engineering, developer education, hackathons, and collaborative open source.
            </p>
            <div className="pt-2 flex items-center gap-3 text-muted-foreground">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Organization"
                className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:text-foreground hover:bg-secondary transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:text-foreground hover:bg-secondary transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:text-foreground hover:bg-secondary transition-colors"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${siteConfig.social.email}`}
                aria-label="Contact Email"
                className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Chapter
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-foreground transition-colors">
                  Activities & SIGs
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-foreground transition-colors">
                  Events & Contests
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-foreground transition-colors">
                  Executive Team
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-foreground transition-colors">
                  Student Resources
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Technical Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Focus & Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
              Programs
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/competitive-programming" className="hover:text-foreground transition-colors">
                  Competitive Programming
                </Link>
              </li>
              <li>
                <Link href="/icpc" className="hover:text-foreground transition-colors">
                  ICPC Preparation
                </Link>
              </li>
              <li>
                <Link href="/events/hack-a-bit" className="hover:text-foreground transition-colors">
                  Hack-A-Bit Hackathon
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-foreground transition-colors">
                  Alumni Network
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-foreground transition-colors">
                  Chapter History
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-primary font-medium hover:underline">
                  Join Chapter →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
              Institutional
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={siteConfig.institution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  BIT Mesra <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.parentOrganization.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  ACM Global <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact & Campus Info
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-foreground transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} ACM Student&apos;s Chapter, BIT Mesra. Built by the ACM BIT Mesra community.</p>
          <p className="font-mono text-[11px] text-muted-foreground/80">
            {siteConfig.location.campus} • {siteConfig.location.city}, {siteConfig.location.state}, {siteConfig.location.country}
          </p>
        </div>
      </div>
    </footer>
  );
}
