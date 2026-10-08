import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ExternalLink, Mail } from "@animateicons/react/lucide";
import { GithubIcon, LinkedinIcon, InstagramIcon, TwitterIcon, AcmLogo } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: ACM BIT Mesra Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <AcmLogo className="h-8 w-8" />
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-foreground">
                  ACM BIT Mesra
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Student Chapter
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Birla Institute of Technology, Mesra. A dedicated technical society empowering students through competitive programming, systems engineering, developer education, hackathons, and collaborative open source.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-muted-foreground">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACM BIT Mesra on GitHub (opens in new tab)"
                title="GitHub Organization"
                className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-95"
              >
                <GithubIcon className="h-4 w-4 shrink-0" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACM BIT Mesra on LinkedIn (opens in new tab)"
                title="LinkedIn Profile"
                className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-95"
              >
                <LinkedinIcon className="h-4 w-4 shrink-0" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACM BIT Mesra on Instagram (opens in new tab)"
                title="Instagram Profile"
                className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-95"
              >
                <InstagramIcon className="h-4 w-4 shrink-0" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href={siteConfig.social.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACM BIT Mesra on X (opens in new tab)"
                title="X (Twitter) Profile"
                className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-95"
              >
                <TwitterIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="sr-only">X (formerly Twitter)</span>
              </a>
              <a
                href={`mailto:${siteConfig.social.email}`}
                aria-label={`Send email to ${siteConfig.social.email}`}
                title="Official Chapter Email"
                className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-95"
              >
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
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
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <p>© {currentYear} ACM Student Chapter, BIT Mesra. Built by the ACM BIT Mesra community.</p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="font-mono text-xs text-muted-foreground/80 text-center sm:text-right break-words">
              {siteConfig.location.campus} • {siteConfig.location.city}, {siteConfig.location.state}
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
