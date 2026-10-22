import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudentProfileBySlug } from "@/db/queries/students";
import { AcmLogo } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CheckCircle, ExternalLink, FileText } from "lucide-react";

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function StudentProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  const { slug } = await params;
  const profile = await getStudentProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  // Extract settings from portfolio_blocks
  const blocks = profile.portfolioBlocks || [];
  const settingsBlock = blocks.find((b) => b.type === "settings");
  const settings = (settingsBlock?.content || {}) as {
    resumeUrl?: string;
  };

  const isDuolingo = profile.theme === "duolingo";
  const isTerminal = profile.theme === "terminal";

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isTerminal
          ? "bg-[#0a0a0c] text-zinc-100 font-mono"
          : isDuolingo
          ? "bg-[#f7f9fa] dark:bg-[#131f24] text-foreground font-sans"
          : "bg-background text-foreground font-sans"
      }`}
    >
      {/* Isolated Profile Header (Replaces Public Website Navbar) */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md px-4 sm:px-8 transition-colors ${
          isTerminal
            ? "border-zinc-800 bg-[#0a0a0c]/90 text-zinc-200"
            : isDuolingo
            ? "border-emerald-600/20 bg-white/90 dark:bg-[#131f24]/90"
            : "border-border bg-background/90"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              title="ACM BIT Mesra Homepage"
            >
              <AcmLogo className="h-7 w-7 transition-transform group-hover:scale-105" />
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-xs leading-none text-foreground">
                  ACM BIT Mesra
                </span>
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">
                  Verified Student
                </span>
              </div>
            </Link>

            <span className="text-muted-foreground/40 hidden sm:inline select-none">/</span>

            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-foreground">
                @{profile.slug}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isDuolingo
                    ? "bg-[#58cc02]/15 text-[#58cc02] font-bold"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                <CheckCircle className="h-3 w-3" />
                <span className="hidden sm:inline">Verified BIT Mesra Student</span>
                <span className="sm:hidden">Verified</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {settings.resumeUrl && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-all ${
                  isDuolingo
                    ? "bg-[#58cc02] text-white border-b-2 border-emerald-700 hover:brightness-105 active:translate-y-0.5 active:border-b-0"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Resume / CV</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            )}

            <ThemeToggle />

            <Link
              href={`/events/hacktoberfest-2026`}
              className="hidden md:inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              <span>Hacktoberfest 2026</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">{children}</main>

      {/* Clean Profile Footer */}
      <footer
        className={`border-t py-8 px-4 text-center text-xs transition-colors ${
          isTerminal
            ? "border-zinc-800 text-zinc-500 bg-[#0a0a0c]"
            : isDuolingo
            ? "border-emerald-600/15 text-muted-foreground bg-white/50 dark:bg-[#131f24]/50"
            : "border-border text-muted-foreground bg-card/40"
        }`}
      >
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AcmLogo className="h-5 w-5" />
            <span>
              Official Student Developer Mini-Site ·{" "}
              <strong className="text-foreground">{profile.displayName || profile.slug}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/" className="hover:text-primary transition-colors">
              ACM BIT Mesra
            </Link>
            <Link href="/events/hacktoberfest-2026/rankings" className="hover:text-primary transition-colors">
              Leaderboard
            </Link>
            <Link href="/login" className="hover:text-primary transition-colors">
              Student Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
